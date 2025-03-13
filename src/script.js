document.getElementById('generateReport').addEventListener('click', function(event) {
    event.preventDefault();

    // Captura dos dados do formulário
    const city = document.getElementById('city').value;
    const agreement = document.getElementById('agreement').value;
    const year = document.getElementById('year').value;
    const object = document.getElementById('object').value;
    const footer = document.getElementById('footer').value;
    const title = document.getElementById('title').value;
    const images = document.getElementById('images').files;
    
    if (!title) {
        alert("Por favor, insira um título para o relatório.");
        return;
    }
    if (images.length === 0) {
        alert("Por favor, selecione pelo menos uma imagem.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações do layout
    const imgWidth = 150; // Largura máxima das imagens
    const imgHeight = 100; // Altura máxima das imagens
    const margin = 20; // Margem entre as imagens e bordas
    const pageWidth = doc.internal.pageSize.width; // Largura da página
    const pageHeight = doc.internal.pageSize.height; // Altura da página
    let yOffset = 50; // Posição inicial do conteúdo (abaixo do cabeçalho)
    let pageCount = 1; // Contador de páginas
    let imagesPerPage = 0; // Contador de imagens por página

    // Função para quebrar texto em várias linhas
    const splitText = (text, maxWidth) => {
        return doc.splitTextToSize(text, maxWidth);
    };

    // Função para adicionar o cabeçalho em todas as páginas
    const addHeader = () => {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");

        // Texto do cabeçalho
        const headerText = `Cidade: ${city}    Ano: ${year}    Objeto: ${object}`;
        const headerLines = splitText(headerText, pageWidth - 2 * margin);

        // Adiciona um retângulo sem arredondamento e com cor de fundo #2C2C2C
        doc.setFillColor(44, 44, 44); // Cor de fundo #2C2C2C
        doc.setDrawColor(44, 44, 44); // Cor da borda #2C2C2C
        doc.setLineWidth(1);
        doc.rect(0, 10, pageWidth, 30, 'F'); // Retângulo sem arredondamento

        // Adiciona cada linha do cabeçalho
        doc.setTextColor(255, 255, 255); // Cor do texto branco
        headerLines.forEach((line, index) => {
            doc.text(line, margin, 25 + index * 10); // Alinha o texto à esquerda com margem
        });
    };

    // Função para adicionar o rodapé
    const addFooter = () => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");

        // Rodapé com texto e paginação
        const footerText = `${footer}`;
        const pageText = `Página ${pageCount}`;

        // Adiciona um retângulo sem arredondamento e com cor de fundo #2C2C2C
        doc.setFillColor(44, 44, 44); // Cor de fundo #2C2C2C
        doc.setDrawColor(44, 44, 44); // Cor da borda #2C2C2C
        doc.setLineWidth(1);
        doc.rect(0, pageHeight - 25, pageWidth, 15, 'F'); // Retângulo sem arredondamento

        // Adiciona o texto do rodapé
        doc.setTextColor(255, 255, 255); // Cor do texto branco
        doc.text(footerText, margin, pageHeight - 15); // Alinha o texto à esquerda com margem
        doc.text(pageText, pageWidth - margin - doc.getTextWidth(pageText), pageHeight - 15); // Alinha o texto à direita com margem
    };

    // Adiciona o cabeçalho na primeira página
    addHeader();

    // Função para adicionar uma imagem ao PDF com bordas arredondadas
    const addImageToPDF = (imgData, index) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = imgData;
            img.onload = () => {
                // Verifica se já adicionamos 2 imagens na página atual
                if (imagesPerPage >= 2) {
                    addFooter(); // Adiciona o rodapé antes de criar nova página
                    doc.addPage(); // Adiciona uma nova página
                    pageCount++;
                    addHeader(); // Adiciona o cabeçalho na nova página
                    yOffset = 50; // Reinicia o yOffset para a nova página
                    imagesPerPage = 0; // Reinicia o contador de imagens
                }

                // Calcula a proporção da imagem para manter a aspect ratio
                const aspectRatio = img.width / img.height;
                let finalWidth = imgWidth;
                let finalHeight = imgHeight;

                if (aspectRatio > 1) {
                    // Imagem mais larga que alta
                    finalHeight = imgWidth / aspectRatio;
                } else {
                    // Imagem mais alta que larga
                    finalWidth = imgHeight * aspectRatio;
                }

                // Adiciona um retângulo com borda arredondada ao redor da imagem
                doc.setDrawColor(220, 220, 220); // Cor da borda cinza claro
                doc.setLineWidth(1);
                doc.roundedRect(margin, yOffset, finalWidth, finalHeight, 5, 5, 'D'); // Borda arredondada

                // Adiciona a imagem com bordas arredondadas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = finalWidth;
                canvas.height = finalHeight;

                // Aplica bordas arredondadas na imagem
                ctx.beginPath();
                ctx.moveTo(5, 0);
                ctx.arcTo(canvas.width, 0, canvas.width, canvas.height, 5);
                ctx.arcTo(canvas.width, canvas.height, 0, canvas.height, 5);
                ctx.arcTo(0, canvas.height, 0, 0, 5);
                ctx.arcTo(0, 0, canvas.width, 0, 5);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

                // Adiciona a imagem ao PDF
                doc.addImage(canvas.toDataURL(), 'JPEG', margin, yOffset, finalWidth, finalHeight);
                yOffset += finalHeight + margin; // Atualiza o yOffset para a próxima imagem
                imagesPerPage++; // Incrementa o contador de imagens

                resolve();
            };
        });
    };

    // Função para carregar e adicionar todas as imagens
    const loadImages = async () => {
        const imagePromises = [];
        for (let i = 0; i < images.length; i++) {
            const reader = new FileReader();
            const promise = new Promise((resolve) => {
                reader.onload = async function(e) {
                    await addImageToPDF(e.target.result, i);
                    resolve();
                };
            });
            reader.readAsDataURL(images[i]);
            imagePromises.push(promise);
        }

        await Promise.all(imagePromises);
        addFooter(); // Adiciona o rodapé na última página
        doc.save(`${title}.pdf`); // Salva o PDF com o nome do título
        alert("Relatório gerado com sucesso!");
    };

    loadImages().catch(() => {
        alert("Ocorreu um erro ao gerar o PDF.");
    });
});