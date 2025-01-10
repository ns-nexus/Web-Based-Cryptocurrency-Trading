// Logo redirect to home
document.querySelector(".logo").addEventListener("click", function () {
    window.location.href = "home.html"; 
  });
  
// Sample user data (fetch this from your backend or authentication system)
const user = {
    name: "John Doe",
    email: "johndoe@gmail.com",
};

// Inject user info
document.querySelector('.user-name').textContent = user.name;
document.querySelector('.user-email').textContent = user.email;

// Crypto Cards Placeholder
document.addEventListener('DOMContentLoaded', () => {
    const placeholderData = [
        { name: "Ethereum", balance: "0.00 ETH", value: "$0.00" },
        { name: "Bitcoin", balance: "0.00 BTC", value: "$0.00" },
        { name: "Tether", balance: "0.00 USDT", value: "$0.00" },
        { name: "Dogecoin", balance: "0.00 DOGE", value: "$0.00" }
    ];

    const container = document.getElementById('crypto-cards');
    container.innerHTML = ''; // Clear existing content

    placeholderData.forEach(data => {
        const card = `
            <div class="crypto-card">
                <h3>${data.name}</h3>
                <p>${data.balance}</p>
                <p>${data.value}</p>
            </div>
        `;
        container.innerHTML += card;
    });
});

// Growth Chart 
    const ctx = document.getElementById('growthChart').getContext('2d');
    const growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Growth',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Placeholder values
                borderColor: '#00aaff',
                backgroundColor: 'rgba(0, 170, 255, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#ccc'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#444'
                    },
                    ticks: {
                        color: '#ccc'
                    }
                }
            }
        }
    });


// Activity Section
document.addEventListener("DOMContentLoaded", function() {
    // Example: Update BTC, ETH, and USDT values after the data is received.
    const activityItems = [
        { currency: 'BTC', action: 'Sold', amount: 0 },
        { currency: 'ETH', action: 'Bought', amount: 0 },
        { currency: 'USDT', action: 'Sold', amount: 0 }
    ];

    const activityList = document.getElementById('activity-list');
    activityItems.forEach((item, index) => {
        const activityItem = activityList.children[index];
        // Find the relevant elements to update
        const activityAmount = activityItem.querySelector('.activity-amount .placeholder-text');
        
        // Update the amount text dynamically
        activityAmount.textContent = `${item.amount}`;

        // You can also change other parts like action text dynamically
        const activityTitle = activityItem.querySelector('.activity-title');
        activityTitle.textContent = `${item.currency} ${item.action}`;
    });
});


