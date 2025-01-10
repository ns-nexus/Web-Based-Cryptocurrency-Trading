document.querySelectorAll('.faq-question').forEach((question) => {
    question.addEventListener('click', () => {
        const parent = question.parentElement;
        parent.classList.toggle('faq-open');
        const icon = question.querySelector('.toggle-icon');
        icon.textContent = parent.classList.contains('faq-open') ? '-' : '+';
    });
});

// Logo redirect to home
document.querySelector(".logo").addEventListener("click", function () {
    window.location.href = "home.html"; 
  });
  
//Learn More button
document.querySelector('.learnMore-button').addEventListener('click', () => {
    window.location.href = './login.html';
  });