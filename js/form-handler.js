// form-handler.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Replace with your Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxV4bJOEjULT2z70R9P9igqaJ3AihzTqKEy3uc8_CswgdAaiSPydf3HtkHlqQnlBhpn/exec';
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Send data to Google Sheets
        fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                // Show success message with timestamp from server
                showSuccessMessage(data.timestamp);
                form.reset();
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        })
        .finally(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
    
    function showSuccessMessage(timestamp) {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <h3><i class="fas fa-check-circle"></i> Success!</h3>
                <p>Your message has been sent successfully.</p>
                <p>Submitted at: ${new Date(timestamp).toLocaleString()}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('.success-styles')) {
            const styles = document.createElement('style');
            styles.className = 'success-styles';
            styles.textContent = `
                .success-message {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                }
                .success-content {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    text-align: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    max-width: 400px;
                    width: 80%;
                }
                .success-content h3 {
                    color: #17a2b8;
                    margin-bottom: 15px;
                    font-size: 24px;
                }
                .success-content h3 i {
                    color: #28a745;
                    margin-right: 10px;
                }
                .success-content p {
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                .success-content button {
                    background-color: #17a2b8;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                    font-size: 16px;
                }
                .success-content button:hover {
                    background-color: #138496;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to document
        document.body.appendChild(successDiv);
    }
});