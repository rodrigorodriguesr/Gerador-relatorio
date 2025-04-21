function loadMenu() {
    const header = document.createElement("header");

    header.innerHTML = `
        <style>
            header a {
                color: white;
                text-decoration: none;
                transition: color 0.3s ease, transform 0.2s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem; /* Espaço entre o ícone e o texto */
                padding: 0.5rem;
            }

            header a:hover {
                color: #F7921E;
                transform: scale(1.05);
            }

            .mode-toggle:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            nav {
                display: flex;
                gap: 2rem; /* Aumentei o espaçamento entre os itens */
                justify-content: center; /* Centraliza os itens no nav */
                flex-grow: 1;
            }
        </style>

        <div id="logo-container" style="display: flex; align-items: center; gap: 1rem;">
            <img src="/src/image/logofotoLab.png" alt="FotoLab Logo" id="logo" style="height: 50px;">
            <h1 id="site-name" style="margin: 0; font-size: 1.5rem;">FotoLab</h1>
        </div>

        <nav>
            <a href="/index.html"><i class="fas fa-home"></i> Home</a>
            <a href="/src/screens/geo.html"><i class="fas fa-map-marker-alt"></i> Georreferência</a>
            <a href="/src/screens/project.html"><i class="fas fa-file"></i> O Projeto</a>
        </nav>
    `;

    Object.assign(header.style, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "rgba(45, 45, 45, 0.9)",
        color: "white",
        borderRadius: "8px",
        margin: "1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
    });

    document.body.insertBefore(header, document.body.firstChild);
}

document.addEventListener("DOMContentLoaded", loadMenu);
