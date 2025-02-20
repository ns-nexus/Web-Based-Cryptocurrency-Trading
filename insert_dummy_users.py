import sqlite3
import random
import string
from datetime import datetime
import bcrypt
import os

# Get the absolute path to the project's root directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Ensure the "instance" folder exists (important for portability)
INSTANCE_DIR = os.path.join(BASE_DIR, 'instance')
os.makedirs(INSTANCE_DIR, exist_ok=True)  # Creates the folder if it doesn't exist

# Define the database path inside the instance directory
db_path = os.path.join(INSTANCE_DIR, 'users.db')

# Connect to SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Ensure the 'user' table exists before inserting data
cursor.execute(''' 
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
''')

# Function to generate random strings
def random_string(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# Function to hash passwords using bcrypt
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Function to check if email already exists
def email_exists(email):
    cursor.execute("SELECT 1 FROM user WHERE email = ?", (email,))
    return cursor.fetchone() is not None

# Insert 100 dummy users into the 'user' table
for i in range(1, 101):
    username = f'User{i}'
    email = f'user{i}@example.com'

    # Ensure the email doesn't already exist in the database
    if email_exists(email):
        print(f"Skipping {email} as it already exists.")
        continue  # Skip this iteration if the email exists

    password = random_string()
    password_hash = hash_password(password)
    created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute("INSERT INTO user (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
                (username, email, password_hash, created_at))

# Commit and close the connection
conn.commit()
conn.close()

print(f"Dummy user data inserted successfully! Database path: {db_path}")
