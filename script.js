// ===================================
// CONFIGURATION
// ===================================

const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Replace with your actual Paystack public key

// ===================================
// STATE
// ===================================

let currentCourse = { name: '', price: 0 };

// ===================================
// MODAL FUNCTIONS
// ===================================

function animateModal(modal, backdrop, panel, show) {
    if (!modal || !backdrop || !panel) return;
    
    if (show) {
        modal.classList.remove('hidden');
        // Trigger reflow
        void modal.offsetWidth;
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('opacity-0', 'translate-y-4');
        document.body.style.overflow = 'hidden';
    } else {
        backdrop.classList.add('opacity-0');
        panel.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 200);
    }
}

// ===================================
// PURCHASE MODAL FUNCTIONS
// ===================================

function openPurchaseModal(name, price) {
    const purchaseModal = document.getElementById('purchaseModal');
    const purchaseBackdrop = document.getElementById('purchaseBackdrop');
    const purchasePanel = document.getElementById('purchasePanel');
    
    currentCourse = { name, price };
    document.getElementById('selectedCourseName').textContent = name;
    document.getElementById('payButtonAmount').textContent = `₵${price.toLocaleString()}`;
    
    if (purchaseModal && purchaseBackdrop && purchasePanel) {
        animateModal(purchaseModal, purchaseBackdrop, purchasePanel, true);
    }
}

function closePurchaseModal() {
    const purchaseModal = document.getElementById('purchaseModal');
    const purchaseBackdrop = document.getElementById('purchaseBackdrop');
    const purchasePanel = document.getElementById('purchasePanel');
    
    if (purchaseModal && purchaseBackdrop && purchasePanel) {
        animateModal(purchaseModal, purchaseBackdrop, purchasePanel, false);
        const form = document.getElementById('purchaseForm');
        if (form) form.reset();
        toggleGiftFields(); // Reset to hidden
    }
}


// ===================================
// GIFT FIELDS TOGGLE
// ===================================

function toggleGiftFields() {
    const isGift = document.querySelector('input[name="purchaseType"]:checked').value === 'gift';
    const giftFields = document.getElementById('giftFields');
    const recipientName = document.getElementById('recipientName');
    const recipientEmail = document.getElementById('recipientEmail');

    if (isGift) {
        giftFields.classList.remove('hidden');
        recipientName.setAttribute('required', 'true');
        recipientEmail.setAttribute('required', 'true');
    } else {
        giftFields.classList.add('hidden');
        recipientName.removeAttribute('required');
        recipientEmail.removeAttribute('required');
    }
}


// ===================================
// TOAST NOTIFICATION
// ===================================

function showToast(message) {
    const successToast = document.getElementById('successToast');
    const successMessage = document.getElementById('successMessage');
    
    if (successMessage) successMessage.textContent = message;
    if (successToast) {
        successToast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => {
            successToast.classList.add('translate-y-20', 'opacity-0');
        }, 4000);
    }
}

// ===================================
// PAYSTACK PAYMENT HANDLER
// ===================================

function handlePayment(e) {
    e.preventDefault();
    
    const email = document.getElementById('buyerEmail')?.value;
    const name = document.getElementById('buyerName')?.value;
    
    // Basic validation
    if (!email || !name) {
        showToast('Please fill in all required fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address');
        return;
    }
    
    const isGift = document.querySelector('input[name="purchaseType"]:checked')?.value === 'gift';
    const metadata = {
        course_name: currentCourse.name,
        buyer_email: email,
        buyer_name: name,
        is_gift: isGift
    };
    
    // Add gift recipient info if this is a gift
    if (isGift) {
        const recipientName = document.getElementById('recipientName')?.value || '';
        const recipientEmail = document.getElementById('recipientEmail')?.value || '';
        
        if (!recipientName.trim() || !recipientEmail.trim()) {
            showToast('Please fill in all recipient details');
            return;
        }
        
        if (!emailRegex.test(recipientEmail)) {
            showToast('Please enter a valid recipient email');
            return;
        }
        
        metadata.recipient_name = recipientName;
        metadata.recipient_email = recipientEmail;
    }
    
    // Check if Paystack is loaded
    if (typeof PaystackPop === 'undefined') {
        showToast('Payment service is currently unavailable. Please try again later.');
        console.error('Paystack script not loaded');
        return;
    }
    
    try {
        const handler = PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: email,
            amount: currentCourse.price * 100, // Amount in kobo (or pesewas for Ghana)
            currency: 'GHS',
            metadata: metadata,
            callback: function(response) {
                closePurchaseModal();
                const msg = isGift 
                    ? 'Gift sent successfully! Confirmation emailed.' 
                    : 'Enrollment successful! Check your email.';
                showToast(msg);
            },
            onClose: function() {
                // Transaction was not completed, window closed
            }
        });
        
        handler.openIframe();
    } catch (error) {
        console.error('Payment initialization error:', error);
        showToast('Error initializing payment. Please try again.');
    }
}

// ===================================
// EVENT LISTENERS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Close purchase modal on clicking outside
    const purchaseModal = document.getElementById('purchaseModal');
    const purchaseBackdrop = document.getElementById('purchaseBackdrop');
    
    if (purchaseModal && purchaseBackdrop) {
        purchaseModal.addEventListener('click', (e) => {
            if (e.target === purchaseBackdrop || e.target.closest('.w-screen') === e.target) {
                closePurchaseModal();
            }
        });
    }
});

