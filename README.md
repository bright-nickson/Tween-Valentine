# Skills is the NEW LOVE - Tweentech Valentine Campaign

A modern, responsive landing page for Tweentech's Valentine's Day tech course gifting campaign.

## 🎯 Project Overview

This is a single-page website that allows users to:
- Purchase tech courses (Cybersecurity, Data Science) for themselves or as gifts
- Join a waitlist for the sold-out AI course
- Complete secure payments via Paystack integration
- Receive email confirmations

## 📁 Project Structure

```
/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Form handling, validation, and Paystack integration
└── README.md           # This file
```

## 🎨 Design Features

### Color Palette
- Primary: `#003CB0` (Deep Blue)
- Accent: `#3E9DFF` (Light Blue)
- Dark: `#002371` (Navy)

### Typography
- Display Font: **Sora** (Headers, titles)
- Body Font: **DM Sans** (Body text, forms)

### Key Features
- ✨ Smooth expanding forms within course cards
- 🎁 Gift toggle (buy for self or gift someone)
- ✅ Real-time email validation
- 💳 Paystack inline payment integration
- 📱 Fully responsive design
- 🎯 Engaging animations and micro-interactions

## 🚀 Setup Instructions

### 1. Replace Paystack Public Key

Open `script.js` and update line 7:

```javascript
const PAYSTACK_PUBLIC_KEY = 'pk_test_YOUR_ACTUAL_KEY_HERE';
```

### 2. Add Your Logos

#### Primary Logo (Header)
In `index.html`, replace this section (around line 18):
```html
<div class="logo-primary">
    <span class="logo-text">TWEENTECH</span>
</div>
```

With:
```html
<div class="logo-primary">
    <img src="path/to/your-primary-logo.png" alt="Tweentech">
</div>
```

#### Secondary Logo (Footer)
In `index.html`, replace this section (around line 258):
```html
<div class="logo-secondary">
    <span class="logo-text">TWEENTECH</span>
</div>
```

With:
```html
<div class="logo-secondary">
    <img src="path/to/your-secondary-logo.png" alt="Tweentech">
</div>
```

### 3. Update Social Links

In `index.html`, around line 261, update the social links:
```html
<div class="footer-social">
    <a href="https://instagram.com/yourhandle" class="social-link">Instagram</a>
    <a href="https://twitter.com/yourhandle" class="social-link">Twitter</a>
    <a href="https://linkedin.com/company/yourcompany" class="social-link">LinkedIn</a>
</div>
```

### 4. Test Locally

Simply open `index.html` in a modern browser. All functionality works client-side except for actual payment processing.

## 💳 Payment Flow

1. User clicks "Buy Now" on a course
2. Form expands within the course card
3. User selects "For Myself" or "Gift Someone"
4. User fills required information
5. Form validates inputs
6. User clicks "Proceed to Payment"
7. Paystack payment modal opens
8. After successful payment:
   - Success notification appears
   - Confirmation email mention
   - Form resets and closes

## 🔧 Backend Integration (Production)

For production deployment, you'll need to:

### 1. Waitlist Handling

Update the waitlist form submission in `script.js` (around line 200):

```javascript
// Replace this console.log with actual API call
fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, course: 'AI' })
});
```

### 2. Payment Verification

Update the payment success handler in `script.js` (around line 380):

```javascript
// Verify payment on your backend
fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        reference: response.reference,
        purchaseData: purchaseData
    })
})
.then(res => res.json())
.then(data => {
    // Handle verification response
    // Send confirmation emails
});
```

### 3. Email Notifications

Set up email sending on your backend:
- Purchase confirmation to buyer
- Gift notification to recipient (if applicable)
- Waitlist confirmation

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: 480px - 767px
- Small Mobile: < 480px

## ✅ Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Known Issues / Notes

1. **Paystack Test Mode**: Remember to switch to live keys in production
2. **Email Sending**: Currently shows notification only - integrate actual email service
3. **Form Persistence**: Forms reset on page refresh (add localStorage if needed)

## 🎯 Future Enhancements

- [ ] Add loading states during payment
- [ ] Implement actual backend API
- [ ] Add Google Analytics tracking
- [ ] Add social sharing for gift purchases
- [ ] Implement coupon code functionality
- [ ] Add course details modal/page

## 📄 License

© 2026 Tweentech. All rights reserved.

## 🤝 Support

For issues or questions, contact: [your-email@tweentech.com]
