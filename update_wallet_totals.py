import sqlite3
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, 'instance', 'users.db')

# Ensure the 'instance' directory exists
if not os.path.exists(os.path.dirname(db_path)):
    os.makedirs(os.path.dirname(db_path))

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Step 1: Fetch the real-time prices of cryptocurrencies (including Dogecoin) from 'crypto_prices'
cursor.execute("SELECT crypto_name, price FROM crypto_prices")
crypto_prices = cursor.fetchall()

# Step 2: Fetch all users and their wallet balances
cursor.execute("SELECT email, btc_balance, eth_balance, usdt_balance, dogecoin_balance FROM wallets")
wallets = cursor.fetchall()

# Step 3: Calculate and update total_balance for each wallet
for wallet in wallets:
    email, btc_balance, eth_balance, usdt_balance, dogecoin_balance = wallet
    
    # Get the real-time price for each crypto from the 'crypto_prices' table
    btc_price = next(price for name, price in crypto_prices if name.lower() == "bitcoin")
    eth_price = next(price for name, price in crypto_prices if name.lower() == "ethereum")
    usdt_price = next(price for name, price in crypto_prices if name.lower() == "tether")
    dogecoin_price = next(price for name, price in crypto_prices if name.lower() == "dogecoin")
    
    # Calculate total balance (multiply crypto balances with their respective real-time prices)
    total_balance = round(
        (btc_balance * btc_price) + 
        (eth_balance * eth_price) + 
        (usdt_balance * usdt_price) + 
        (dogecoin_balance * dogecoin_price),
        2
    )
    
    # Update the 'wallet' table with the calculated total balance
    cursor.execute("""
    UPDATE wallets
    SET total_balance = ?
    WHERE email = ?
    """, (total_balance, email))

# Commit changes and close the connection
conn.commit()
conn.close()

print("Wallet total balances updated successfully!")
