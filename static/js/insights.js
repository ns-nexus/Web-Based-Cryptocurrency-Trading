document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from Binance API for Bitcoin (BTC)
    fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
        .then(response => response.json())
        .then(data => {
            console.log('BTC Data:', data); // Debugging log
            if (data) {
                document.getElementById('btc-price').textContent = `$${parseFloat(data.lastPrice).toFixed(2)}`;
                document.getElementById('btc-change').textContent = `${parseFloat(data.priceChangePercent).toFixed(2)}%`;
            }
        })
        .catch(error => console.error('Error fetching BTC data:', error));

    // Fetch data from Binance API for Ethereum (ETH)
    fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT')
        .then(response => response.json())
        .then(data => {
            console.log('ETH Data:', data); // Debugging log
            if (data) {
                document.getElementById('eth-price').textContent = `$${parseFloat(data.lastPrice).toFixed(2)}`;
                document.getElementById('eth-change').textContent = `${parseFloat(data.priceChangePercent).toFixed(2)}%`;
            }
        })
        .catch(error => console.error('Error fetching ETH data:', error));

    // Fetch data from Binance API for Tether (USDT)
    fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=USDTUSDT')
        .then(response => response.json())
        .then(data => {
            console.log('USDT Data:', data); // Debugging log
            if (data) {
                document.getElementById('usdt-price').textContent = `$${parseFloat(data.lastPrice).toFixed(2)}`;
                document.getElementById('usdt-change').textContent = `${parseFloat(data.priceChangePercent).toFixed(2)}%`;
            }
        })
        .catch(error => console.error('Error fetching USDT data:', error));

    // Fetch BTC price history for the chart (30-minute data for demo)
    fetch('https://api.binance.com/api/v1/klines?symbol=BTCUSDT&interval=30m&limit=10')
        .then(response => response.json())
        .then(data => {
            console.log('BTC Price History:', data); // Debugging log
            const labels = data.map(item => new Date(item[0]).toLocaleTimeString());
            const prices = data.map(item => parseFloat(item[4]));

            // Create a chart using Chart.js
            const ctx = document.getElementById('priceChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Bitcoin Price (BTC)',
                        data: prices,
                        borderColor: '#ff0040',
                        backgroundColor: 'rgba(255, 0, 64, 0.2)',
                        borderWidth: 2,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: true,
                                maxRotation: 90
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching BTC price history:', error));

    // Fetch top gainers and losers
    fetch('https://api.binance.com/api/v3/ticker/24hr')
        .then(response => response.json())
        .then(data => {
            console.log('Top Gainers and Losers:', data); // Debugging log
            const gainers = data.sort((a, b) => b.priceChangePercent - a.priceChangePercent).slice(0, 5);
            const losers = data.sort((a, b) => a.priceChangePercent - b.priceChangePercent).slice(0, 5);

            const gainersList = document.getElementById('gainers-list');
            const losersList = document.getElementById('losers-list');

            gainers.forEach(gainer => {
                const li = document.createElement('li');
                li.textContent = `${gainer.symbol}: ${parseFloat(gainer.priceChangePercent).toFixed(2)}%`;
                gainersList.appendChild(li);
            });

            losers.forEach(loser => {
                const li = document.createElement('li');
                li.textContent = `${loser.symbol}: ${parseFloat(loser.priceChangePercent).toFixed(2)}%`;
                losersList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching top gainers/losers:', error));

    // Market sentiment (For simplicity, we can mock this data)
    const sentiment = document.getElementById('sentiment-bar');
    sentiment.style.width = '70%';  // 70% for a positive sentiment

    // Fetch latest news (mock data)
    const newsList = document.getElementById('news-list');
    const newsArticles = [
        { title: 'Bitcoin Hits New All-Time High', link: '#' },
        { title: 'Ethereum 2.0 Launch Coming Soon', link: '#' },
        { title: 'Market Sentiment Shifts Towards Altcoins', link: '#' }
    ];

    newsArticles.forEach(news => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${news.link}" target="_blank">${news.title}</a>`;
        newsList.appendChild(li);
    });
});

function logout() {
    fetch('/logout', { method: 'POST' })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(error => console.error('Logout Error:', error));
}
