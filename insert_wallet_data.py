import sqlite3
import random
import os
from datetime import datetime

# Function to generate random float for balances
def random_balance():
    return round(random.uniform(0, 10), 2)

# Function to calculate total balance based on crypto prices
def calculate_total_balance(btc_balance, eth_balance, usdt_balance, dogecoin_balance):
    btc_price = 50000  # Example price for Bitcoin
    eth_price = 3000   # Example price for Ethereum
    usdt_price = 1     # Example price for Tether
    dogecoin_price = 0.2  # Example price for Dogecoin
    
    total_balance = round(
        (btc_balance * btc_price) + 
        (eth_balance * eth_price) + 
        (usdt_balance * usdt_price) + 
        (dogecoin_balance * dogecoin_price), 
        2
    )
    return total_balance

# Set up database connection
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, 'instance', 'users.db')

# Ensure the 'instance' directory exists
os.makedirs(os.path.dirname(db_path), exist_ok=True)

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# ✅ Create the `wallets` table if it does not exist
cursor.execute("""
CREATE TABLE IF NOT EXISTS wallets (
    email TEXT PRIMARY KEY,
    dogecoin_balance REAL DEFAULT 0,
    btc_balance REAL DEFAULT 0,
    eth_balance REAL DEFAULT 0,
    usdt_balance REAL DEFAULT 0,
    total_balance REAL DEFAULT 0
)
""")

# Fetch all emails from the 'user' table
cursor.execute("SELECT email FROM user")
users = cursor.fetchall()

# Insert or update wallet data for each user
for user in users:
    email = user[0]
    dogecoin_balance = random_balance()
    btc_balance = random_balance()
    eth_balance = random_balance()
    usdt_balance = random_balance()

    # Calculate total balance
    total_balance = calculate_total_balance(btc_balance, eth_balance, usdt_balance, dogecoin_balance)

    # ✅ Efficient UPSERT: Insert if new, update if existing
    cursor.execute("""
    INSERT INTO wallets (email, dogecoin_balance, btc_balance, eth_balance, usdt_balance, total_balance)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
        dogecoin_balance = excluded.dogecoin_balance,
        btc_balance = excluded.btc_balance,
        eth_balance = excluded.eth_balance,
        usdt_balance = excluded.usdt_balance,
        total_balance = excluded.total_balance
    """, (email, dogecoin_balance, btc_balance, eth_balance, usdt_balance, total_balance))

# Commit changes and close the database connection
conn.commit()
conn.close()

print("Wallet table created and wallet data inserted/updated successfully!")
