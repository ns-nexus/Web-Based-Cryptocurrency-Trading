document.addEventListener("DOMContentLoaded", function () {
    let ethAmount = 1.5, ethPrice = 3000;
    let btcAmount = 0.25, btcPrice = 42000;
    let usdtAmount = 500, usdtPrice = 1;
    let dogeAmount = 1000, dogePrice = 0.08;

    document.getElementById("eth-amount").innerText = ethAmount + " ETH";
    document.getElementById("eth-price").innerText = "$" + (ethAmount * ethPrice).toFixed(2);
    document.getElementById("btc-amount").innerText = btcAmount + " BTC";
    document.getElementById("btc-price").innerText = "$" + (btcAmount * btcPrice).toFixed(2);
    document.getElementById("usdt-amount").innerText = usdtAmount + " USDT";
    document.getElementById("usdt-price").innerText = "$" + (usdtAmount * usdtPrice).toFixed(2);
    document.getElementById("doge-amount").innerText = dogeAmount + " DOGE";
    document.getElementById("doge-price").innerText = "$" + (dogeAmount * dogePrice).toFixed(2);

    let totalBalance = (ethAmount * ethPrice) + (btcAmount * btcPrice) + (usdtAmount * usdtPrice) + (dogeAmount * dogePrice);
    document.getElementById("total-balance").innerText = "$" + totalBalance.toFixed(2);

    // Portfolio Chart
    let ctx1 = document.getElementById('portfolioChart').getContext('2d');
    new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: ['Ethereum', 'Bitcoin', 'Tether', 'Dogecoin'],
            datasets: [{
                data: [ethAmount * ethPrice, btcAmount * btcPrice, usdtAmount * usdtPrice, dogeAmount * dogePrice],
                backgroundColor: ['#3498db', '#f1c40f', '#2ecc71', '#e74c3c']
            }]
        }
    });

    // Market Trend Chart
    let ctx2 = document.getElementById('marketTrendChart').getContext('2d');
    new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{ 
                label: 'Market Trends', 
                data: [40000, 42000, 45000, 47000, 48000],
                borderColor: '#2c3e50'
            }]
        }
    });
});

 // Fetch data from Binance API
 fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=100')
 .then(response => response.json())
 .then(data => {
     const labels = data.map(item => new Date(item[0]).toLocaleTimeString());
     const prices = data.map(item => parseFloat(item[4])); // Close price

     // Line chart
     const ctx = document.getElementById('marketChart').getContext('2d');
     new Chart(ctx, {
         type: 'line',
         data: {
             labels: labels,
             datasets: [{
                 label: 'BTC/USDT Price',
                 data: prices,
                 borderColor: '#5670ef',
                 fill: false,
                 tension: 0.1
             }]
         },
         options: {
             responsive: true,
             plugins: {
                 legend: {
                     display: false
                 }
             },
             scales: {
                 x: {
                     title: {
                         display: true,
                         text: 'Time'
                     }
                 },
                 y: {
                     title: {
                         display: true,
                         text: 'Price (USDT)'
                     },
                     min: Math.min(...prices) * 0.9,
                     max: Math.max(...prices) * 1.1
                 }
             }
         }
     });
 })
 .catch(error => console.error('Error fetching Binance data:', error));

 // Example dynamic data for activity
const activityData = [
    {
        icon: 'fa-bitcoin',
        color: '#f3b9d8',
        title: 'BTC Sold',
        subtitle: 'Sold Bitcoin',
        amount: '$5000',
        type: 'negative'
    },
    {
        icon: 'fa-ethereum',
        color: '#b9bbde',
        title: 'ETH Bought',
        subtitle: 'Bought Ethereum',
        amount: '$1200',
        type: 'positive'
    },
    {
        icon: 'fa-dollar-sign',
        color: '#c1d3d7',
        title: 'USDT Transferred',
        subtitle: 'Transferred USDT to wallet',
        amount: '$1000',
        type: 'neutral'
    },
    
];

// Function to load activity dynamically
function loadActivity() {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = ''; // Clear existing items

    activityData.forEach(activity => {
        const activityItem = document.createElement('li');
        activityItem.classList.add('activity-item');

        const activityIcon = document.createElement('div');
        activityIcon.classList.add('activity-icon');
        activityIcon.innerHTML = `<i class="fa-brands ${activity.icon}" style="color: ${activity.color};"></i>`;

        const activityDetails = document.createElement('div');
        activityDetails.classList.add('activity-details');
        activityDetails.innerHTML = `
            <div class="activity-title">${activity.title}</div>
            <div class="activity-subtitle">${activity.subtitle}</div>
        `;

        const activityAmount = document.createElement('div');
        activityAmount.classList.add('activity-amount');
        activityAmount.style.color = activity.type === 'negative' ? 'red' : (activity.type === 'positive' ? 'green' : 'black');
        activityAmount.textContent = activity.amount;

        activityItem.appendChild(activityIcon);
        activityItem.appendChild(activityDetails);
        activityItem.appendChild(activityAmount);
        activityList.appendChild(activityItem);
    });
}

// Load activity on page load
window.onload = loadActivity;