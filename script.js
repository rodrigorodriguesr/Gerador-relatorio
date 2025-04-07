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

    const imgMaxWidth = 150;
    const imgMaxHeight = 100;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yOffset = 0;
    let pageCount = 1;
    let imagesPerPage = 0;

    const splitText = (text, maxWidth) => doc.splitTextToSize(text, maxWidth);

    const addHeader = () => {
        const headerTop = 10;
        const headerHeight = 50;

        doc.setFillColor(44, 44, 44);
        doc.rect(0, headerTop, pageWidth, headerHeight, 'F'); // fundo do cabeçalho

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text(city, margin, headerTop + 18);

        doc.setFontSize(12);
        const convenioLine = `Convênio: ${agreement} - ${year}`;
        const objectLine = `Objeto: ${object}`;

        const convenioLines = splitText(convenioLine, pageWidth - 2 * margin);
        const objectLines = splitText(objectLine, pageWidth - 2 * margin);

        let currentY = headerTop + 30;
        convenioLines.forEach(line => {
            doc.text(line, margin, currentY);
            currentY += 6;
        });
        objectLines.forEach(line => {
            doc.text(line, margin, currentY);
            currentY += 6;
        });

        yOffset = currentY + 10; // espaço após cabeçalho
    };

    const addFooter = () => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");

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

                const xPos = (pageWidth - finalWidth) / 2;
                doc.addImage(imgData, 'JPEG', xPos, yOffset, finalWidth, finalHeight);

                yOffset += finalHeight + margin;
                imagesPerPage++;

                resolve();
            };
        });
    };

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

    addHeader();
    loadImages().catch(() => {
        alert("Ocorreu um erro ao gerar o PDF.");
    });
});
