function loadMenu() {
    const header = document.createElement("header");

    header.innerHTML = `
        <style>
            /* Estilos base (mobile-first) */
            header {
                display: flex;
                flex-direction: column;
                padding: 0.75rem 1rem;
                background-color: rgba(45, 45, 45, 0.9);
                color: white;
                border-radius: 8px;
                margin: 0.5rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                gap: 0.75rem;
            }

            #logo-container {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
            }

            #logo {
                height: 36px;
                transition: transform 0.2s ease;
            }

            #logo:hover {
                transform: scale(1.05);
            }

            #site-name {
                margin: 0;
                font-size: 1.2rem;
                font-weight: 500;
            }

            nav {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                align-items: center;
                width: 100%;
            }

            header a {
                color: white;
                text-decoration: none;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 0.75rem;
                border-radius: 4px;
                width: 100%;
                justify-content: center;
                text-align: center;
            }

            header a:hover {
                color: #F7921E;
                background-color: rgba(255, 255, 255, 0.1);
            }

            /* Tablet (768px+) */
            @media (min-width: 768px) {
                header {
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 1.5rem;
                    gap: 1rem;
                }

                nav {
                    flex-direction: row;
                    gap: 0.75rem;
                    width: auto;
                    justify-content: flex-end;
                }

                header a {
                    width: auto;
                    padding: 0.5rem 1rem;
                }

                #logo-container {
                    justify-content: flex-start;
                }
            }

            /* Desktop (1024px+) */
            @media (min-width: 1024px) {
                header {
                    padding: 0.75rem 2rem;
                    margin: 1rem;
                }

                nav {
                    gap: 1.25rem;
                }

                #logo {
                    height: 40px;
                }

                #site-name {
                    font-size: 1.3rem;
                }
            }
        </style>

        <div id="logo-container">
            <a href="/index.html" id="logo-link">
                <img src="/src/image/logofotoLab.png" alt="FotoLab Logo" id="logo">
            </a>
            <a href="/index.html" id="site-name-link">
                <h1 id="site-name">FotoLab</h1>
            </a>
        </div>

        <nav>
            <a href="/index.html"><i class="fas fa-home"></i> Home</a>
            <a href="/src/screens/geo.html"><i class="fas fa-map-marker-alt"></i> Georreferência</a>
            <a href="/src/screens/project.html"><i class="fas fa-file"></i> O Projeto</a>
        </nav>
    `;

    document.body.insertBefore(header, document.body.firstChild);
}

document.addEventListener("DOMContentLoaded", loadMenu);