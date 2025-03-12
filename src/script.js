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
    const imgWidth = 150; // Largura das imagens (ajustável)
    const imgHeight = 100; // Altura das imagens (ajustável)
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
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");

        // Texto do cabeçalho
        const headerText = `Cidade: ${city}    Ano: ${year}    Objeto: ${object}`;
        const headerLines = splitText(headerText, pageWidth - 2 * margin);

        // Adiciona cada linha do cabeçalho
        headerLines.forEach((line, index) => {
            doc.text(line, margin, 15 + index * 10);
        });

        // Linha divisória
        doc.setLineWidth(0.5);
        const lastLineY = 15 + headerLines.length * 10;
        doc.line(margin, lastLineY + 5, pageWidth - margin, lastLineY + 5);
    };

    // Função para adicionar o rodapé
    const addFooter = () => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");

        // Rodapé com texto e paginação
        const footerText = `${footer}`;
        const pageText = `Página ${pageCount}`;

        doc.text(footerText, margin, pageHeight - 15);
        doc.text(pageText, pageWidth - margin - doc.getTextWidth(pageText), pageHeight - 15);
    };

    // Adiciona o cabeçalho na primeira página
    addHeader();

    // Função para adicionar uma imagem ao PDF
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

                // Adiciona a imagem
                doc.addImage(img, 'JPEG', margin, yOffset, imgWidth, imgHeight);
                yOffset += imgHeight + margin; // Atualiza o yOffset para a próxima imagem
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
