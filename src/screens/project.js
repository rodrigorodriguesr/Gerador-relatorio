// Estilos de transição para elementos
const style = document.createElement('style');
style.innerHTML = `
    .hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .show {
        opacity: 1;
        transform: translateY(0);
    }
    #about-container {
        text-align: center;
    }
    #about-container img {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        object-fit: cover;
        margin-top: 20px;
    }
`;
document.head.appendChild(style);

// Função para detectar o momento em que os elementos entram na tela
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".hidden");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    });
    elements.forEach((el) => observer.observe(el));
});
