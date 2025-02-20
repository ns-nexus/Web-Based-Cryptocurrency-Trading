import requests
import sqlite3
import os

# CoinGecko API URL to get the current crypto prices in USD
url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,dogecoin&vs_currencies=usd"

# Fetch the data from CoinGecko API
response = requests.get(url)

if response.status_code == 200:
    data = response.json()

    # Extract prices
    btc_price = data['bitcoin']['usd']
    eth_price = data['ethereum']['usd']
    usdt_price = data['tether']['usd']
    dogecoin_price = data['dogecoin']['usd']

    # Set up database path
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(BASE_DIR, 'instance', 'users.db')

    # Ensure the 'instance' directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create the crypto_prices table if it doesn't exist
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS crypto_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        crypto_name TEXT UNIQUE NOT NULL,
        price REAL NOT NULL
    )
    """)

    # Insert or update crypto prices
    cryptos = [
        ('Bitcoin', btc_price),
        ('Ethereum', eth_price),
        ('Tether', usdt_price),
        ('Dogecoin', dogecoin_price)
    ]

    for name, price in cryptos:
        cursor.execute("""
        INSERT INTO crypto_prices (crypto_name, price)
        VALUES (?, ?)
        ON CONFLICT(crypto_name) DO UPDATE SET price = excluded.price
        """, (name, price))

    # Commit changes and close the connection
    conn.commit()
    conn.close()

    print("Crypto prices updated successfully!")
else:
    print("Error fetching data from CoinGecko API")
