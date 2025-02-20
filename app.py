from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime
import pytz
import cv2
import numpy as np
import face_recognition
import os
import base64
from flask_mail import Mail, Message
from random import randint
import time

# Initialize the app and its extensions
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  # Database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.secret_key = os.urandom(24)

CORS(app)  # Enable CORS for frontend-backend communication
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

def get_local_time():
    local_timezone = pytz.timezone('Asia/Kolkata')  # Replace with your desired local timezone
    return datetime.now(local_timezone)
'''
# Setup Flask-Mail
# Setup Flask-Mail for Gmail with App Password
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True  # Use TLS for secure communication
app.config['MAIL_USE_SSL'] = False  # Don't use SSL, use TLS
app.config['MAIL_USERNAME'] = 'your_email@gmail.com'  # Your Gmail address
app.config['MAIL_PASSWORD'] = 'your_app_password'  # Replace this with the generated App Password
app.config['MAIL_DEFAULT_SENDER'] = 'your_email@gmail.com'  # Default sender email address

mail = Mail(app)

mail = Mail(app)
otp_data = {}
'''
# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    face_encoding = db.Column(db.Text, nullable=True)  # Store face encoding as a base64 string
    created_at = db.Column(db.DateTime, default=get_local_time())

class UserSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    login_time = db.Column(db.DateTime, default=get_local_time)
    logout_time = db.Column(db.DateTime, nullable=True)
    user = db.relationship('User', backref=db.backref('sessions', lazy=True))

# Route Definitions
@app.route('/signup', methods=['GET'])
def serve_signup():
    return render_template("signup.html")

@app.route('/login', methods=['GET'])
def serve_login():
    return render_template("login.html")

@app.route('/home', methods=['GET'])
def serve_home():
    return render_template("home.html")

@app.route('/about', methods=['GET'])
def serve_about():
    return render_template("about.html")

@app.route('/faq', methods=['GET'])
def serve_faq():
    return render_template('faq.html')

@app.route('/community', methods=['GET'])
def serve_community():
    return render_template('community.html')

@app.route('/crypto-prices', methods=['GET'])
def serve_crypto_prices():
    return render_template('crypto-prices.html')

@app.route('/dashboard', methods=['GET'])
def serve_dashboard():
    return render_template('dashboard.html')

@app.route('/wallet', methods=['GET'])
def serve_wallet():
    return render_template('wallet.html')

@app.route('/trade', methods=['GET'])
def serve_trade():
    return render_template('trade.html')

@app.route('/insights', methods=['GET'])
def serve_insights():
    return render_template('insights.html')

@app.route('/settings', methods=['GET'])
def serve_settings():
    return render_template('settings.html')


@app.route('/')
def home():
    return render_template("home.html")

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.form
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return render_template('signup.html', error="All fields are required.")
        
        if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
            return render_template('signup.html', error="Username or email already exists."), 400
        
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(username=username, email=email, password_hash=password_hash)
        db.session.add(new_user)
        db.session.commit()
        
        return redirect(url_for('capture_face', user_id=new_user.id))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/capture_face/<int:user_id>', methods=['GET'])
def capture_face(user_id):
    return render_template('capture_face.html', user_id=user_id)

@app.route('/save_face_encoding/<int:user_id>', methods=['POST'])
def save_face_encoding(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        file = request.files['image']
        image_np = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        face_encodings = face_recognition.face_encodings(rgb_image)

        if face_encodings:
            user.face_encoding = base64.b64encode(face_encodings[0].tobytes()).decode('utf-8')
            db.session.commit()
            return jsonify({'message': 'Face encoding saved successfully'}), 200
        else:
            return jsonify({'error': 'No face detected'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.form
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return render_template('login.html', error="Wrong email or password.")

         # Check if OTP is required
        '''if email in otp_data:
            return render_template('login.html', otp_required=True, user_email=email)
        '''
        return redirect(url_for('verify_face', user_id=user.id))
    except Exception as e:
        return render_template('login.html', error=str(e))

@app.route('/verify_face/<int:user_id>', methods=['GET'])
def verify_face(user_id):
    return render_template('verify_face.html', user_id=user_id)

@app.route('/check_face/<int:user_id>', methods=['POST'])
def check_face(user_id):
    try:
        user = User.query.get(user_id)
        if not user or not user.face_encoding:
            return jsonify({'success': False, 'message': 'Face data not found.'}), 404

        file = request.files['image']
        image_np = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        face_encodings = face_recognition.face_encodings(rgb_image)

        if not face_encodings:
            return jsonify({'success': False, 'message': 'No face detected. Please try again.'}), 400

        stored_encoding = np.frombuffer(base64.b64decode(user.face_encoding), dtype=np.float64)
        match_result = face_recognition.compare_faces([stored_encoding], face_encodings[0])[0]

        if match_result:
            session['user_id'] = user.id 
            session_entry = UserSession(user_id=user.id, login_time=get_local_time())
            db.session.add(session_entry)
            db.session.commit()

            return jsonify({'success': True, 'message': 'Login successful'}), 200  # ✅ Correct JSON format
        else:
            return jsonify({'success': False, 'message': 'Face mismatch. Please try again.'}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

'''# Route to send OTP
@app.route('/send_otp', methods=['POST'])
def send_otp():
    email = request.form.get('email')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    otp = randint(100000, 999999)  # 6-digit OTP
    otp_expiry = time.time() + 300  # OTP expires in 5 minutes

    # Save OTP and expiry time
    otp_data[email] = {'otp': otp, 'expiry': otp_expiry}

    # Send OTP via email
    try:
        msg = Message('Your OTP Code', recipients=[email])
        msg.body = f"Your OTP code is {otp}. It will expire in 5 minutes."
        mail.send(msg)
        return jsonify({'message': 'OTP sent to your email!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to verify OTP
@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    email = request.form.get('email')
    otp_input = request.form.get('otp')

    if email not in otp_data:
        return jsonify({'error': 'OTP not requested or expired'}), 400

    otp_info = otp_data[email]
    if otp_info['expiry'] < time.time():
        del otp_data[email]
        return jsonify({'error': 'OTP has expired'}), 400

    if otp_info['otp'] == int(otp_input):
        del otp_data[email]  # Clear OTP after successful verification
        session['user_id'] = User.query.filter_by(email=email).first().id
        return jsonify({'message': 'OTP verified successfully, login complete'}), 200
    else:
        return jsonify({'error': 'Invalid OTP'}), 400'''

@app.route('/logout', methods=['POST'])
def logout():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return redirect(url_for('home'))  # If no user is logged in, redirect to home

        # Get the latest active session of the user
        last_session = UserSession.query.filter_by(user_id=user_id, logout_time=None).order_by(UserSession.login_time.desc()).first()
        
        if last_session:
            last_session.logout_time = get_local_time()  # Update logout time
            db.session.commit()

        # Clear the session and redirect to home
        session.pop('user_id', None)
        return redirect(url_for('home'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
