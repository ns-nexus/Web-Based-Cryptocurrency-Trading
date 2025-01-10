// Header--------------------------------------------------------------------------------------
const bar = document.getElementById("bar");
const nav = document.getElementById("nav");

bar.onclick = (e) => {
    const icon = e.target.getAttribute("class")
    if(icon == "fa-solid fa-bars"){
        e.target.setAttribute("class","fa-solid fa-xmark")

    }else{
        e.target.setAttribute("class","fa-solid fa-bars")
    }
    nav.classList.toggle("showNav")
}

const tableBody = document.getElementById("crypto-data");

// Carousel-----------------------------------------------------------------------

const carouselContainer = document.querySelector(".carouselContainer");
const allEachCarousel = document.querySelectorAll(".eachCarousel");
let currentIndex = 0;

const slideCarousel = () => {
    const itemWidth = allEachCarousel[0].clientWidth + 20; // Add gap between items
    carouselContainer.scrollLeft = currentIndex * itemWidth;
};

// Automatically slide every 3 seconds
const autoSlide = () => {
    setInterval(() => {
        if (currentIndex < allEachCarousel.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back to first item
        }
        slideCarousel();
    }, 3000); // Change the interval as needed (3000ms = 3 seconds)
};

// Start auto sliding
autoSlide();


// Crypto Prices Section-------------------------------------------------------------

// Counter
document.addEventListener("DOMContentLoaded", () => {
    const targetNumber = 350; // The final number to count up to
    const speed = 15; // Adjust for smoother or faster counting (lower value = faster)
    let currentNumber = 1;

    const counter = document.getElementById("cryptoCount");

    const updateCounter = () => {
      if (currentNumber < targetNumber) {
        currentNumber++;
        counter.textContent = currentNumber;
        setTimeout(updateCounter, speed); // Call again after the delay
      } else {
        counter.textContent = targetNumber; // Ensure the final number is set
      }
    };

    updateCounter();
  });

// Function to fetch crypto prices
const fetchCryptoPrices = async () => {
  try {
    const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    const data = await response.json();
    
    // Filter out desired coins (Bitcoin, Ethereum, and more)
    const filteredCoins = ["BTCUSDT", "ETHUSDT", "ADAUSDT", "DOGEUSDT"];
    const cryptoData = data.filter(coin => filteredCoins.includes(coin.symbol));

    // Map the data into table rows
    tableBody.innerHTML = cryptoData.map(coin => {
      const price = parseFloat(coin.lastPrice).toFixed(2);
      const change = parseFloat(coin.priceChangePercent).toFixed(2);
      const changeClass = change > 0 ? "positive" : "negative";

      return `
        <tr>
          <td><strong>${getCryptoName(coin.symbol)}</strong></td>
          <td>USD ${price}</td>
          <td class="${changeClass}">${change}%</td>
          <td><button class="trade-btn">Trade</button></td>
        </tr>
      `;
    }).join("");

    // Attach event listener to 'Trade' buttons for redirection
    const tradeButtons = document.querySelectorAll(".trade-btn");
    tradeButtons.forEach(button => {
      button.addEventListener("click", () => {
        window.location.href = "./login.html"; // Redirect to login page
      });
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    tableBody.innerHTML = `<tr><td colspan="4">Error loading data</td></tr>`;
  }
};


// Function to get crypto names
const getCryptoName = (symbol) => {
  const names = {
    BTCUSDT: "Bitcoin BTC",
    ETHUSDT: "Ethereum ETH",
    ADAUSDT: "Cardano ADA",
    DOGEUSDT: "Dogecoin DOGE"
  };
  return names[symbol] || symbol;
};

// Call the fetch function on page load
fetchCryptoPrices();

// Redirect all "Buy" buttons to login page
const buyButtons = document.querySelectorAll('.buyBtn');
buyButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = './login.html'; // Redirect to login page
    });
});

// Hero Section Buttons
const contactButton = document.querySelector('.contactBtn');
const knowMoreButton = document.querySelector('.knowMoreBtn');

// Redirect "Contact Now" button to contact page
contactButton.addEventListener('click', () => {
  window.location.href = './contact.html'; // Redirect to contact page
});

// Redirect "Know More" button to about page
knowMoreButton.addEventListener('click', () => {
  window.location.href = './about.html'; // Redirect to about page
});




