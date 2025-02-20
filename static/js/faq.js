document.querySelectorAll('.faq-question').forEach((question) => {
    question.addEventListener('click', () => {
        const parent = question.parentElement;
        parent.classList.toggle('faq-open');
        const icon = question.querySelector('.toggle-icon');
        icon.textContent = parent.classList.contains('faq-open') ? '-' : '+';
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".faq-question").forEach((question) => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector(".toggle-icon");

            if (answer.style.display === "block") {
                answer.style.display = "none";
                icon.textContent = "+";
            } else {
                answer.style.display = "block";
                icon.textContent = "-";
            }
        });
    });
});

  

