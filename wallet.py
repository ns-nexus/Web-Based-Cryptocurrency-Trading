from flask import Flask, request, jsonify
import random
import string

app = Flask(__name__)

# Dummy database (for example purposes)
users_db = {}

# Function to generate a random wallet address
def generate_wallet_address():
    return '0x' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=40))

# API endpoint to create a wallet
@app.route('/create-wallet', methods=['POST'])
def create_wallet():
    user_id = request.json.get('user_id')  # Get user ID from request
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    # Generate wallet address
    wallet_address = generate_wallet_address()

    # Store the wallet address in the database (this is just a dummy example)
    users_db[user_id] = {
        'wallet_address': wallet_address,
        'balance': 0.0
    }
    
    return jsonify({'wallet_address': wallet_address})

if __name__ == '__main__':
    app.run(debug=True)
