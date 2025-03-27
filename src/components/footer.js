function loadFooter() {
    const footer = document.createElement("footer");
    footer.innerHTML = `
        <p>&copy; 2025 FotoLab. Todos os direitos reservados.</p>
    `;
    document.body.appendChild(footer);
}

// Chama a função quando a página carregar
document.addEventListener("DOMContentLoaded", loadFooter);
