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
    const imgMaxWidth = 150; 
    const imgMaxHeight = 100; 
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yOffset = 50; 
    let pageCount = 1; 
    let imagesPerPage = 0; 

    // Função para quebrar texto
    const splitText = (text, maxWidth) => doc.splitTextToSize(text, maxWidth);

    // Função para adicionar o cabeçalho
    const addHeader = () => {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");

        const headerText = `${city}  ${year}    Objeto: ${object}`;
        const headerLines = splitText(headerText, pageWidth - 2 * margin);

        doc.setFillColor(44, 44, 44);
        doc.rect(0, 10, pageWidth, 30, 'F'); 

        doc.setTextColor(255, 255, 255);
        headerLines.forEach((line, index) => {
            doc.text(line, margin, 25 + index * 10);
        });
    };

    // Função para adicionar o rodapé
    const addFooter = () => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");

        // Obtém a data atual
        const today = new Date();
        const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

        const pageText = `Página ${pageCount}`;
        const footerText = `${footer} - Data: ${formattedDate}`;

        doc.setFillColor(44, 44, 44);
        doc.rect(0, pageHeight - 25, pageWidth, 15, 'F');

        doc.setTextColor(255, 255, 255);
        doc.text(footerText, margin, pageHeight - 15);
        doc.text(pageText, pageWidth - margin - doc.getTextWidth(pageText), pageHeight - 15);
    };

    addHeader();

    // Função para adicionar imagem ao PDF centralizada
    const addImageToPDF = (imgData, index) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = imgData;
            img.onload = () => {
                if (imagesPerPage >= 2) {
                    addFooter();
                    doc.addPage();
                    pageCount++;
                    addHeader();
                    yOffset = 50;
                    imagesPerPage = 0;
                }

                const aspectRatio = img.width / img.height;
                let finalWidth = imgMaxWidth;
                let finalHeight = imgMaxHeight;

                if (aspectRatio > 1) {
                    finalHeight = imgMaxWidth / aspectRatio;
                } else {
                    finalWidth = imgMaxHeight * aspectRatio;
                }

                // Centraliza a imagem na página
                const xPos = (pageWidth - finalWidth) / 2;
                doc.addImage(imgData, 'JPEG', xPos, yOffset, finalWidth, finalHeight);

                yOffset += finalHeight + margin;
                imagesPerPage++;

                resolve();
            };
        });
    };

    // Carregar e adicionar todas as imagens
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
        addFooter();
        doc.save(`${title}.pdf`);
        alert("Relatório gerado com sucesso!");
    };

    loadImages().catch(() => {
        alert("Ocorreu um erro ao gerar o PDF.");
    });
});