// Fetch articles dynamically
const API_URL = "https://api.coingecko.com/api/v3/search/trending";

async function loadArticles() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const container = document.getElementById("articles-container");

        data.coins.forEach(coin => {
            let articleElement = `<div class="article">
                <img src="${coin.item.thumb}" alt="${coin.item.name}">
                <h3>${coin.item.name}</h3>
                <a href="https://www.coingecko.com/en/coins/${coin.item.id}" target="_blank">Read More</a>
            </div>`;
            container.innerHTML += articleElement;
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
    }
}

loadArticles();

const text = "Welcome to the TradeSphere Community!";
let index = 0;

function typeEffect() {
    if (index < text.length) {
        document.getElementById("typing-text").textContent += text.charAt(index);
        index++;
        setTimeout(typeEffect, 100); // Adjust speed (lower = faster)
    }
}

document.addEventListener("DOMContentLoaded", typeEffect);