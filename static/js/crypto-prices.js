const apiUrl = "https://api.binance.com/api/v3/ticker/24hr";
const rowsPerPage = 20;
let currentPage = 1;
let cryptoData = [];
let totalPages = 1;
const maxCryptos = 350; // Limit to 350 cryptos

// Fetch crypto data from Binance API
async function fetchCryptoData() {
    try {
        const response = await fetch(apiUrl);
        let data = await response.json();

        // Sort by 24h volume (most popular first)
        data.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));

        // Limit to 350 cryptos
        cryptoData = data.slice(0, maxCryptos);
        totalPages = Math.ceil(cryptoData.length / rowsPerPage);

        displayPage(1);
        setupPagination();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Display rows for the current page
function displayPage(page) {
    currentPage = page;
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const currentRows = cryptoData.slice(start, end);

    const tableBody = document.getElementById("crypto-table-body");
    tableBody.innerHTML = ""; 

    currentRows.forEach((crypto, index) => {
        const priceChangeClass = crypto.priceChangePercent > 0 ? "change-positive" : "change-negative";
        const row = `
            <tr>
                <td>${start + index + 1}</td>
                <td>${crypto.symbol}</td>
                <td>$${parseFloat(crypto.lastPrice).toFixed(2)}</td>
                <td class="${priceChangeClass}">${parseFloat(crypto.priceChangePercent).toFixed(2)}%</td>
                <td>$${parseFloat(crypto.quoteVolume).toFixed(2)}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });

    setupPagination();
}

// Dynamic Pagination Setup
function setupPagination() {
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = "";

    const visiblePages = 5;
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(startPage + visiblePages - 1, totalPages);

    // Previous Button
    paginationDiv.appendChild(createPageButton("<", currentPage > 1, () => displayPage(currentPage - 1)));

    // Page Number Buttons
    for (let i = startPage; i <= endPage; i++) {
        paginationDiv.appendChild(createPageButton(i, true, () => displayPage(i), i === currentPage));
    }

    // Next Button
    paginationDiv.appendChild(createPageButton(">", currentPage < totalPages, () => displayPage(currentPage + 1)));
}

// Helper function to create a pagination button
function createPageButton(text, enabled, onClick, isActive = false) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("pagination-button");
    if (!enabled) button.disabled = true;
    if (isActive) button.classList.add("active");
    button.addEventListener("click", onClick);
    return button;
}

// Initialize app
fetchCryptoData();
