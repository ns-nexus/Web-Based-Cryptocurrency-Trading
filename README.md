<img align="right" src="https://vbr.nathanchung.dev/badge?page_id=ns-nexus.ns-nexus/Web-Based-Cryptocurrency-Trading/&color=55acb7&style=for-the-badge&logo=Github"/>
<br>
<br>
<div align="center">
    <img src="https://readme-typing-svg.herokuapp.com/?font=Righteous&size=35&center=true&vCenter=true&width=500&height=70&duration=4000&lines=TradeSphere;" />
  <br>
  A Web-based Cryptocurrency Trading and Advanced Transaction Analysis Platform
</div>

# TradeSphere - Cryptocurrency Trading Website

## Project Overview

TradeSphere is a cryptocurrency trading platform that provides advanced transaction analysis and trading functionalities. It includes features like wallet management, price updates, user authentication, and facial recognition as a security measure.

## Project Structure

```
TradeSphere/
│── app.py                   # Main application file
│── wallet.py                # Wallet functionality
│── price_updater.py         # Updates cryptocurrency prices
│── insert_dummy_users.py    # Inserts test users into the database
│── insert_wallet_data.py    # Inserts wallet data
│── update_wallet_totals.py  # Updates wallet totals
│── static/                  # CSS, JavaScript, images
│── templates/               # HTML templates
│── instance/                # Contains SQLite database files/configs
```

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/TradeSphere.git
cd TradeSphere
```

### 2. Create a Virtual Environment (Optional but Recommended)

```sh
python -m venv venv
source venv/bin/activate   # On macOS/Linux
venv\Scripts\activate      # On Windows
```

### 3. Install Dependencies

```sh
pip install -r requirements.txt
```

#### If `dlib` or `cmake` fails, install them manually:

**Windows:**
```sh
pip install cmake dlib
```
(If issues arise, install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) first.)

**Linux:**
```sh
sudo apt update && sudo apt install -y cmake libboost-all-dev
pip install dlib
```

**macOS:**
```sh
brew install cmake
pip install dlib
```

### 4. Set Up the Database

```sh
python insert_dummy_users.py
python insert_wallet_data.py
python update_wallet_totals.py
```

### 5. Run the Application

```sh
python app.py
```

Then open `http://127.0.0.1:5000/` in your browser.

## Technologies Used

- **Security:** Facial Recognition
- **Database:** SQLite3
- **Development Stack:** HTML, CSS, JavaScript
- **APIs Used:** CoinGecko, Binance

## Website Pages Overview

### Homepage  
<img src="ui_screens/homepage1.png" width="500">
<img src="ui_screens/homepage2.png" width="500">
<img src="ui_screens/homepage3.png" width="500">  
*The homepage provides an overview of the platform with navigation options.*  

### About Us  
<img src="ui_screens/aboutus1.png" width="500">
<img src="ui_screens/aboutus2.png" width="500">
<img src="ui_screens/aboutus3.png" width="500">  
*Details about TradeSphere and its mission.*  

### Prices Page  
<img src="ui_screens/prices.png" width="500">  
*Live cryptocurrency price tracking and market trends.*  

### FAQ Page  
<img src="ui_screens/faq.png" width="500">  
*Frequently asked questions about the platform.*  

### Login & Signup  
<img src="ui_screens/login.png" width="500">
<img src="ui_screens/signup.png" width="500">  
*User authentication with face verification.*  

### Dashboard  
<img src="ui_screens/dashboard.png" width="500">  
*Overview of user activity, portfolio, and market trends.*  

### Wallet  
<img src="ui_screens/wallet.png" width="500">  
*Displays user balances, transaction history, and deposit/withdrawal options.*  

### Trade  
<img src="ui_screens/trade.png" width="500">  
*Trading interface for buying and selling cryptocurrencies with market insights.*  

### Community  
<img src="ui_screens/community.png" width="500">  
*Interactive forum and social features for traders to connect and share insights.*  

### Insights  
<img src="ui_screens/insights.png" width="500">  
*Real-time analytics and AI-powered market predictions.*  

### Settings  
<img src="ui_screens/settings.png" width="500">  
*User preferences, security settings, and account management.*  

---

**Navigation Details (Before Login & Dashboard Access):**  
- The **logo in the header** redirects to the homepage.  
- The **"Learn More" and "Join Us" buttons** redirect to the login page.  
- After logging in, **face verification** is required before accessing the dashboard.  
