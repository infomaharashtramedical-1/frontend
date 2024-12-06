document.addEventListener("DOMContentLoaded", function () {
    const announcementList = document.getElementById("announcement-list");

    // Start auto-scroll
    function autoScroll() {
        if (announcementList.scrollTop === 0) {
            // If reached the top, scroll to the bottom
            announcementList.scrollTo({
                top: announcementList.scrollHeight,
                behavior: "smooth",
            });
        } else {
            // Scroll to the top
            announcementList.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }

    // Trigger auto-scroll every 5 seconds
    setInterval(autoScroll, 5000);

    // Handle CAPTCHA elements
    const refreshCaptchaButton = document.getElementById('refresh-captcha');
    const verifyCaptchaButton = document.getElementById('verify-captcha');

    // Only add event listeners if the elements exist
    if (refreshCaptchaButton) {
        refreshCaptchaButton.addEventListener('click', setCaptcha);
    }

    if (verifyCaptchaButton) {
        verifyCaptchaButton.addEventListener('click', () => {
            if (captchaInput.value === captchaText.textContent) {
                captchaMessage.textContent = 'CAPTCHA verified successfully!';
                captchaMessage.className = 'success';
                searchBtn.disabled = false; // Enable search button
            } else {
                captchaMessage.textContent = 'Incorrect CAPTCHA. Try again.';
                captchaMessage.className = 'error';
            }
        });
    }

    // Handle form submission
    const form = document.getElementById('pdfForm');
    const pdfViewer = document.getElementById('pdfViewer');
    const errorDiv = document.getElementById('error');
    const captchaText = document.getElementById('captcha-text');
    const captchaInput = document.getElementById('captcha-input');
    const captchaMessage = document.getElementById('captcha-message');
    const searchBtn = document.getElementById('search-btn');

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

    // Initialize CAPTCHA on load
    setCaptcha();

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const filename = document.getElementById('filename').value;
        errorDiv.textContent = ''; // Clear previous errors
        pdfViewer.hidden = true; // Hide iframe initially

        try {
            const response = await fetch('https://backend-mkt5.onrender.com/api/result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'search-result': filename }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.pdfUrl) {
                pdfViewer.src = data.pdfUrl;
                pdfViewer.hidden = false; // Show the iframe with the PDF
            } else {
                throw new Error('PDF URL not found in response');
            }
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    });
});
