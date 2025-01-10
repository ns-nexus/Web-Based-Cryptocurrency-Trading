const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&sparkline=false";
const rowsPerPage = 20; // Number of rows per page
let currentPage = 1; // Current page
let cryptoData = []; // Store fetched cryptocurrency data

// Helper function to format large numbers into M (million) or B (billion)
function formatNumber(value) {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(2) + "B"; // Billion
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(2) + "M"; // Million
  } else {
    return value.toLocaleString(); // Less than million
  }
}

// Show loading message
function showLoading() {
  const tableBody = document.getElementById("crypto-table-body");
  tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Loading...</td></tr>`;
}

// Hide loading message
function hideLoading() {
  const tableBody = document.getElementById("crypto-table-body");
  tableBody.innerHTML = ""; // Clear loading message
}

// Fetch cryptocurrency data in chunks
async function fetchCryptoData() {
  showLoading(); // Show loading message while fetching data
  const promises = [
    fetch(`${apiUrl}&per_page=100&page=1`).then((res) => res.json()),
    fetch(`${apiUrl}&per_page=100&page=2`).then((res) => res.json()),
    fetch(`${apiUrl}&per_page=100&page=3`).then((res) => res.json()),
    fetch(`${apiUrl}&per_page=50&page=4`).then((res) => res.json()),
  ];

  const results = await Promise.all(promises);
  cryptoData = results.flat(); // Merge all results into one array
  hideLoading(); // Hide loading message
  displayPage(1); // Display the first page
  setupPagination();
}

// Display rows for the current page
function displayPage(page) {
  currentPage = page;
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentRows = cryptoData.slice(start, end);

  const tableBody = document.getElementById("crypto-table-body");
  tableBody.innerHTML = ""; // Clear existing rows

  currentRows.forEach((crypto, index) => {
    const priceChangeClass = crypto.price_change_percentage_24h > 0 ? "change-positive" : "change-negative";
    const row = `
      <tr>
        <td>${start + index + 1}</td>
        <td>${crypto.name}</td>
        <td>$${crypto.current_price.toFixed(2)}</td>
        <td class="${priceChangeClass}">${crypto.price_change_percentage_24h.toFixed(2)}%</td>
        <td>$${formatNumber(crypto.total_volume)}</td>
        <td>$${formatNumber(crypto.market_cap)}</td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

// Set up pagination with limited pages and "More" button
function setupPagination() {
  const totalPages = Math.ceil(cryptoData.length / rowsPerPage);
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = ""; // Clear existing buttons

  // Add previous button
  const prevButton = document.createElement("button");
  prevButton.textContent = "<";
  prevButton.disabled = currentPage === 1;
  prevButton.classList.add("pagination-button");
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      displayPage(currentPage - 1);
      setupPagination();
    }
  });
  paginationDiv.appendChild(prevButton);

  // Add first 5 pages or remaining pages if less than 5
  const maxVisiblePages = Math.min(5, totalPages);
  for (let i = 1; i <= maxVisiblePages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination-button");
    if (i === currentPage) button.classList.add("active");
    button.addEventListener("click", () => {
      displayPage(i);
      setupPagination();
    });
    paginationDiv.appendChild(button);
  }

  // Add "More" button if there are additional pages
  if (totalPages > 5) {
    const moreButton = document.createElement("button");
    moreButton.textContent = "...";
    moreButton.classList.add("pagination-button");
    moreButton.addEventListener("click", () => {
      displayAllPages(totalPages);
    });
    paginationDiv.appendChild(moreButton);
  }

  // Add next button
  const nextButton = document.createElement("button");
  nextButton.textContent = ">";
  nextButton.disabled = currentPage === totalPages;
  nextButton.classList.add("pagination-button");
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      displayPage(currentPage + 1);
      setupPagination();
    }
  });
  paginationDiv.appendChild(nextButton);
}

// Display all pages when "More" is clicked
function displayAllPages(totalPages) {
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = ""; // Clear existing buttons

  // Add all page numbers
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination-button");
    if (i === currentPage) button.classList.add("active");
    button.addEventListener("click", () => {
      displayPage(i);
      setupPagination();
    });
    paginationDiv.appendChild(button);
  }
}

// Initialize the app
fetchCryptoData();

// Logo redirect to home
document.querySelector(".logo").addEventListener("click", function () {
  window.location.href = "home.html"; 
});

//Learn More button
document.querySelector('.learnMore-button').addEventListener('click', () => {
  window.location.href = './login.html';
});

