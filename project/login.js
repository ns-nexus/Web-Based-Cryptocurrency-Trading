// Logo redirect to home
document.querySelector(".logo").addEventListener("click", function () {
    window.location.href = "home.html"; 
  });

function handleGoogleLogin() {
    // Redirect to Google authentication
    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&response_type=code&redirect_uri=YOUR_REDIRECT_URI&client_id=YOUR_CLIENT_ID";
}

function handleFacebookLogin() {
    // Redirect to Facebook authentication
    window.location.href = "https://www.facebook.com/v12.0/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=YOUR_REDIRECT_URI&scope=email";
}