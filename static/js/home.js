document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript loaded successfully!");

    // Define login URL (Update this to your actual login page URL)
    const loginUrl = "/login";  // Change this to your actual login route

    // Crypto Counter (Trigger on Scroll)
    const counter = document.getElementById("cryptoCount");
    let counterStarted = false;

    const startCounter = () => {
        if (counter && !counterStarted) {
            counterStarted = true;
            let currentNumber = 1;
            const targetNumber = 350;
            const speed = 15;

            const updateCounter = () => {
                if (currentNumber < targetNumber) {
                    currentNumber++;
                    counter.textContent = currentNumber;
                    setTimeout(updateCounter, speed);
                } else {
                    counter.textContent = targetNumber;
                }
            };
            updateCounter();
        }
    };

    // Scroll Event for Counter
    window.addEventListener("scroll", () => {
        const rect = counter.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            startCounter();
        }
    });

    // Fetch Crypto Prices
    const tableBody = document.getElementById("crypto-data");
    if (tableBody) {
        const fetchCryptoPrices = async () => {
            try {
                const response = await fetch("https://api.binance.com/api/v3/ticker/24hr");
                const data = await response.json();

                const filteredCoins = ["BTCUSDT", "ETHUSDT", "ADAUSDT", "DOGEUSDT"];
                const cryptoData = data.filter(coin => filteredCoins.includes(coin.symbol));

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

                // Add event listeners to 'Trade' buttons
                document.querySelectorAll(".trade-btn").forEach(button => {
                    button.addEventListener("click", () => {
                        console.log("Redirecting to login:", loginUrl);
                        window.location.href = loginUrl;
                    });
                });

            } catch (error) {
                console.error("Error fetching data:", error);
                tableBody.innerHTML = `<tr><td colspan="4">Error loading data</td></tr>`;
            }
        };

        fetchCryptoPrices();
    } else {
        console.error("Element with ID 'crypto-data' not found!");
    }

    // Helper function to get crypto names
    const getCryptoName = (symbol) => {
        const names = {
            BTCUSDT: "Bitcoin BTC",
            ETHUSDT: "Ethereum ETH",
            ADAUSDT: "Cardano ADA",
            DOGEUSDT: "Dogecoin DOGE"
        };
        return names[symbol] || symbol;
    };

    // ==========================
    // CAROUSEL FUNCTIONALITY
    // ==========================
    const carouselContainer = document.querySelector(".carouselContainer");

    if (carouselContainer) {
        let scrollAmount = 0;
        const step = 300; // Adjust this based on carousel width
        const maxScroll = carouselContainer.scrollWidth - carouselContainer.clientWidth;

        const scrollCarousel = () => {
            if (scrollAmount >= maxScroll) {
                scrollAmount = 0;
            } else {
                scrollAmount += step;
            }
            carouselContainer.scrollTo({
                left: scrollAmount,
                behavior: "smooth",
            });
        };

        // Auto-scroll every 3 seconds
        setInterval(scrollCarousel, 3000);
    }
});
