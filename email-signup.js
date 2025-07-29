// email-signup.js
// Direct email signup functionality for SwipeHire landing page

async function submitEmail(e) {
  e.preventDefault();
  
  const emailInput = document.getElementById('emailInput');
  const submitButton = document.getElementById('submitButton');
  const messageContainer = document.getElementById('messageContainer');
  const email = emailInput.value.trim();
  
  // Clear any existing messages
  messageContainer.innerHTML = '';
  
  // Validate email format
  if (!isValidEmail(email)) {
    showMessage('Please enter a valid email address.', 'error');
    return;
  }
  
  // Show loading state
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Joining...';
  submitButton.disabled = true;
  
  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email })
    });
    
    if (response.ok) {
      showMessage('🎉 Thank you! You\'ve been added to our waitlist.', 'success');
      emailInput.value = '';
      
      // Keep success message visible longer
      setTimeout(() => {
        const successMsg = document.querySelector('.success-message');
        if (successMsg) {
          successMsg.classList.remove('show');
          setTimeout(() => successMsg.remove(), 300);
        }
      }, 5000);
      
    } else {
      const errorText = await response.text();
      showMessage('Something went wrong. Please try again.', 'error');
      console.error('Server error:', errorText);
    }
    
  } catch (error) {
    showMessage('Network error. Please check your connection and try again.', 'error');
    console.error('Network error:', error);
  } finally {
    // Reset button state
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showMessage(message, type) {
  const messageContainer = document.getElementById('messageContainer');
  
  // Remove existing message if any
  const existingMessage = messageContainer.querySelector('.success-message, .error-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
  messageDiv.textContent = message;
  
  messageContainer.appendChild(messageDiv);
  
  // Trigger animation
  setTimeout(() => {
    messageDiv.classList.add('show');
  }, 100);
  
  // Auto-remove error messages after 4 seconds
  if (type === 'error') {
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.classList.remove('show');
        setTimeout(() => messageDiv.remove(), 300);
      }
    }, 4000);
  }
}

// Initialize functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('emailInput');
  const submitButton = document.getElementById('submitButton');
  
  // Add hover effects to submit button
  if (submitButton) {
    submitButton.addEventListener('mouseenter', function() {
      if (!this.disabled) {
        this.style.transform = 'translateY(-2px)';
      }
    });
    
    submitButton.addEventListener('mouseleave', function() {
      if (!this.disabled) {
        this.style.transform = 'translateY(0)';
      }
    });
  }
  
  // Add focus effects to input
  if (emailInput) {
    emailInput.addEventListener('focus', function() {
      this.style.transform = 'scale(1.02)';
    });
    
    emailInput.addEventListener('blur', function() {
      this.style.transform = 'scale(1)';
    });
    
    // Submit form on Enter key
    emailInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        document.getElementById('emailSignupForm').dispatchEvent(new Event('submit'));
      }
    });
  }
});

// Export functions for potential use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    submitEmail,
    isValidEmail,
    showMessage
  };
}
