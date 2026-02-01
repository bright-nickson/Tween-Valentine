// ===================================
// CONFIGURATION
// ===================================

const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Placeholder Key - Replace with your actual Paystack public key

// ===================================
// STATE
// ===================================

let currentCourse = { name: '', price: 0 };

// ===================================
// DOM ELEMENTS
// ===================================

const purchaseModal = document.getElementById('purchaseModal');
const waitlistModal = document.getElementById('waitlistModal');
const purchaseBackdrop = document.getElementById('purchaseBackdrop');
const waitlistBackdrop = document.getElementById('waitlistBackdrop');
const purchasePanel = document.getElementById('purchasePanel');
const waitlistPanel = document.getElementById('waitlistPanel');
const successToast = document.getElementById('successToast');

// ===================================
// MODAL ANIMATION FUNCTIONS
// ===================================

function animateModal(modal, backdrop, panel, show) {
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
        }, 300);
    }
}

// ===================================
// PURCHASE MODAL FUNCTIONS
// ===================================

function openPurchaseModal(name, price) {
    currentCourse = { name, price };
    document.getElementById('selectedCourseName').textContent = name;
    document.getElementById('payButtonAmount').textContent = `₵${price.toLocaleString()}`;
    animateModal(purchaseModal, purchaseBackdrop, purchasePanel, true);
}

function closePurchaseModal() {
    animateModal(purchaseModal, purchaseBackdrop, purchasePanel, false);
    document.getElementById('purchaseForm').reset();
    toggleGiftFields(); // Reset to hidden
}

// ===================================
// WAITLIST MODAL FUNCTIONS
// ===================================

function openWaitlistModal() {
    animateModal(waitlistModal, waitlistBackdrop, waitlistPanel, true);
}

function closeWaitlistModal() {
    animateModal(waitlistModal, waitlistBackdrop, waitlistPanel, false);
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
// WAITLIST HANDLER
// ===================================

function handleWaitlist(e) {
    e.preventDefault();
    closeWaitlistModal();
    showToast('You have been added to the waitlist!');
}

// ===================================
// TOAST NOTIFICATION
// ===================================

function showToast(message) {
    document.getElementById('successMessage').textContent = message;
    successToast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        successToast.classList.add('translate-y-20', 'opacity-0');
    }, 4000);
}

// ===================================
// PAYSTACK PAYMENT HANDLER
// ===================================

function handlePayment(e) {
    e.preventDefault();
    
    const email = document.getElementById('buyerEmail').value;
    const name = document.getElementById('buyerName').value;
    
    // Basic Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Determine if gift
    const isGift = document.querySelector('input[name="purchaseType"]:checked').value === 'gift';
    let metadata = {
        custom_fields: [
            { display_name: "Course", variable_name: "course", value: currentCourse.name },
            { display_name: "Type", variable_name: "type", value: isGift ? "Gift" : "Personal" }
        ]
    };

    if (isGift) {
        metadata.custom_fields.push({
            display_name: "Recipient",
            variable_name: "recipient_email",
            value: document.getElementById('recipientEmail').value
        });
    }

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
            // Transaction was not completed, window closed.
        }
    });
    handler.openIframe();
}

// ===================================
// EVENT LISTENERS
// ===================================

// Close modals on clicking outside
purchaseModal.addEventListener('click', (e) => {
    if (e.target === purchaseBackdrop || e.target.closest('.w-screen') === e.target) {
        closePurchaseModal();
    }
});

waitlistModal.addEventListener('click', (e) => {
    if (e.target === waitlistBackdrop || e.target.closest('.w-screen') === e.target) {
        closeWaitlistModal();
    }
});
