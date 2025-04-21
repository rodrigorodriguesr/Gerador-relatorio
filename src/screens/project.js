// Estilos de transição para elementos
const style = document.createElement('style');
style.innerHTML = `
 
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
