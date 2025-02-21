function handleGoogleLogin() {
    // Redirect to Google authentication
    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&response_type=code&redirect_uri=YOUR_REDIRECT_URI&client_id=YOUR_CLIENT_ID";
}

function handleFacebookLogin() {
    // Redirect to Facebook authentication
    window.location.href = "https://www.facebook.com/v12.0/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=YOUR_REDIRECT_URI&scope=email";
}
/*
document.getElementById('send-otp').addEventListener('click', function() {
    var email = document.querySelector('input[name="email"]').value;
    fetch('/send_otp', {
        method: 'POST',
        body: new URLSearchParams({
            'email': email
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.getElementById('otp').disabled = false;  // Enable OTP field
            document.getElementById('login-btn').disabled = false;  // Enable login button
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        alert("An error occurred while sending OTP.");
    });
});
*/
// Set the inactivity time limit in milliseconds (5 minutes)
let inactivityTimeout = 5 * 60 * 1000;  // 5 minutes
let inactivityTimer;

// Function to log out the user
function logout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(() => {
        window.location.href = '/';  // Redirect to home after logout
    }).catch(error => {
        console.error("Logout error:", error);
    });
}

// Reset inactivity timer
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);  // Clear existing timeout
    inactivityTimer = setTimeout(logout, inactivityTimeout);  // Set new timeout
}

// Listen for user activity (mouse movements, key presses, etc.)
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keydown', resetInactivityTimer);
document.addEventListener('scroll', resetInactivityTimer);

// Initial timer setup
resetInactivityTimer();
