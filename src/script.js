document.getElementById("generateReport").addEventListener("click", async function () {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4"); // Formato A4 (210mm x 297mm)

    // Obtendo os dados do formulário
    const convenio = document.getElementById("convenio").value;
    const ano = document.getElementById("ano").value;
    const objeto = document.getElementById("objeto").value;

    // Cabeçalho do relatório
    pdf.setFontSize(14);
    pdf.text("Relatório Fotográfico - Nova Olímpia-MT", 15, 15);
    pdf.setFontSize(10);
    pdf.text(`Convênio: ${convenio} - Ano: ${ano} - Objeto: ${objeto}`, 15, 25);

    // Obtendo as imagens carregadas
    const imageFiles = document.getElementById("imageUpload").files;
    if (imageFiles.length === 0) {
        alert("Por favor, selecione ao menos uma imagem.");
        return;
    }

    let x = 15, y = 35; // Posição inicial da primeira imagem
    const imgWidth = 180, imgHeight = 80; // Tamanho fixo para as imagens

    for (let i = 0; i < imageFiles.length; i++) {
        if (i > 0 && i % 2 === 0) {
            pdf.addPage(); // Nova página após duas imagens
            y = 15; // Reinicia a posição na nova página
        }

        // Converte a imagem para base64 e adiciona ao PDF
        const imgData = await convertImageToBase64(imageFiles[i]);
        pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
        y += imgHeight + 10; // Move a posição para a próxima imagem
    }

    // Salvar e baixar o relatório
    pdf.save("relatorio_fotografico.pdf");
});

// Função para converter imagens em base64
function convertImageToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
    });
}
