const form = document.getElementById('pdfForm');
const errorDiv = document.getElementById('error');
const captchaText = document.getElementById('captcha-text');
const captchaInput = document.getElementById('captcha-input');
const captchaMessage = document.getElementById('captcha-message');
const searchBtn = document.getElementById('search-btn');
const userInfo = document.getElementById('userInfo');
const srNo = document.getElementById('srNo');
const name = document.getElementById('name');
const qualification = document.getElementById('qualification');
const registrationNo = document.getElementById('registrationNo');
const registrationDate = document.getElementById('registrationDate');
const validUpto = document.getElementById('validUpto');

// Function to generate random CAPTCHA
function generateCaptcha() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

// Set CAPTCHA initially
function setCaptcha() {
  captchaText.textContent = generateCaptcha();
}

// Refresh CAPTCHA
document.getElementById('refresh-captcha').addEventListener('click', setCaptcha);

// Verify CAPTCHA
document.getElementById('verify-captcha').addEventListener('click', () => {
  if (captchaInput.value === captchaText.textContent) {
    captchaMessage.textContent = 'CAPTCHA verified successfully!';
    captchaMessage.className = 'success';
    searchBtn.disabled = false; // Enable search button
  } else {
    captchaMessage.textContent = 'Incorrect CAPTCHA. Try again.';
    captchaMessage.className = 'error';
  }
});

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent default form submission
  const filename = document.getElementById('filename').value;
  errorDiv.textContent = ''; // Clear previous errors
  userInfo.style.display = 'none'; // Hide user info initially

  try {
    // Send the registration number through POST request body
    const response = await fetch('https://newbackend-a2wv.onrender.com/api/users/registration', {  // Your backend URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registrationNo: filename }),  // Send as JSON
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.user) {  // Assuming you get user data in the response
      // Show the user data
      srNo.textContent = data.user.srNo;
      name.textContent = data.user.name;
      qualification.textContent = data.user.qualification;
      registrationNo.textContent = data.user.registrationNo;
      registrationDate.textContent = new Date(data.user.registrationDate).toLocaleDateString();
      validUpto.textContent = new Date(data.user.validUpto).toLocaleDateString();

      // Show the user info section
      userInfo.style.display = 'block';
    } else {
      throw new Error('User not found');
    }
  } catch (err) {
    errorDiv.textContent = err.message;
  }
});

// Initialize CAPTCHA on load
document.addEventListener('DOMContentLoaded', setCaptcha);