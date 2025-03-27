function loadMenu() {
    const header = document.createElement("header");
    header.innerHTML = `
        <div id="logo-container">
            <img src="/src/image/Foto__3_-removebg-preview.png" alt="FotoLab Logo" id="logo">
            <h1 id="site-name">FotoLab</h1>
        </div>
        <nav>
            <a href="/index.html"><i class="fas fa-home"></i> Home</a>
            <a href="/src/screens/project.html"><i class="fas fa-file"></i> O Projeto</a>
            <a href="#"><i class="fas fa-envelope"></i> Contato</a>
            <a href="src/screens/geo.html"><i class="fas fa-map-marker-alt"></i> Georreferência</a>
        </nav>
        <button class="mode-toggle" onclick="toggleMode()" aria-label="Alternar modo claro/escuro">Light</button>
    `;
    document.body.insertBefore(header, document.body.firstChild);
}

// Certifique-se de chamar a função quando a página carregar
document.addEventListener("DOMContentLoaded", loadMenu);
