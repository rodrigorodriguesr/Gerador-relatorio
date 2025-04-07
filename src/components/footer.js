function loadFooter() {
    const footer = document.createElement("footer");

    footer.innerHTML = `
        <style>
            footer {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                background: rgba(46, 46, 46, 0.9); /* Fundo escuro com leve transparência */
                color: white;
                text-align: center;
                padding: 5px 0; /* Diminui a altura */
                font-size: 14px; /* Fonte menor */
                box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
                font-family: Arial, sans-serif;
                z-index: 999;
            }
        </style>

        <p>&copy; 2025 FotoLab. Todos os direitos reservados.</p>
    `;

    document.body.appendChild(footer);
}

// Chama a função quando a página carregar
document.addEventListener("DOMContentLoaded", loadFooter);
