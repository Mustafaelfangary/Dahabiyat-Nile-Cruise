# 📧 Free Email Notification Setup Guide

## 🎯 Overview
This guide shows you how to set up **FREE** automatic email notifications for your booking system using Gmail's free SMTP service.

## ✅ What You'll Get
- **Automatic emails** to customers when they book dahabiyat or packages
- **Admin notifications** when new bookings are received
- **Professional email templates** with pharaonic theming
- **Zero cost** - completely free using Gmail

## 🔧 Setup Instructions

### Step 1: Create Gmail App Password

1. **Go to your Gmail account** (the one you want to send emails from)
2. **Enable 2-Factor Authentication** (required for app passwords)
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification" and follow setup
3. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (custom name)"
   - Enter name: "Cleopatra Dahabiyat Website"
   - Copy the 16-character password (save it!)

### Step 2: Update Environment Variables

Add these to your `.env.local` file:

```env
# Email Configuration (Gmail SMTP - FREE)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
SMTP_FROM=your-email@gmail.com

# Admin Email (where booking notifications go)
ADMIN_EMAIL=your-email@gmail.com
CONTACT_EMAIL=your-email@gmail.com
```

### Step 3: Replace Email Values

Replace these values:
- `your-email@gmail.com` → Your actual Gmail address
- `your-16-character-app-password` → The app password from Step 1

### Step 4: Test the System

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Make a test booking**
   - Go to your website
   - Book a dahabiya or package
   - Check your email for confirmations

## 📧 Email Templates Included

### Customer Emails
- **Dahabiya Booking Confirmation** - Beautiful pharaonic-themed confirmation
- **Package Booking Confirmation** - Sacred journey confirmation with details
- **Booking Modification** - When bookings are changed
- **Booking Cancellation** - Cancellation confirmations

### Admin Emails
- **New Dahabiya Booking Alert** - Instant notification of new bookings
- **New Package Booking Alert** - Package booking notifications
- **Contact Form Submissions** - Contact form notifications

## 🎨 Email Features

### Professional Design
- **Pharaonic theming** with hieroglyphic symbols
- **Golden color scheme** matching your website
- **Responsive design** works on all devices
- **Professional layout** with clear information

### Complete Information
- **Booking details** (dates, guests, price)
- **Customer information** (name, email)
- **Special requests** and notes
- **Booking reference numbers**
- **Status updates**

## 🔄 How It Works

### When Customer Books:
1. **Availability checked** automatically
2. **Booking created** in database
3. **Customer email sent** with confirmation
4. **Admin email sent** with booking details
5. **Success message** shown to customer

### Email Flow:
```
Customer Books → Availability Check → Create Booking → Send Emails
                                                    ↓
                              Customer Confirmation + Admin Notification
```

## 🚨 Troubleshooting

### Common Issues:

**"Authentication failed"**
- Check your app password is correct
- Ensure 2FA is enabled on Gmail
- Verify SMTP_USER matches your Gmail

**"Connection refused"**
- Check SMTP_HOST=smtp.gmail.com
- Verify SMTP_PORT=587
- Ensure SMTP_SECURE=false

**"Emails not sending"**
- Check server logs for errors
- Verify all environment variables
- Test with a simple email first

### Test Email Function:
Add this to test your setup:

```javascript
// Test in your browser console or API route
fetch('/api/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: 'your-email@gmail.com' })
});
```

## 💰 Cost Breakdown

### Gmail SMTP (Recommended)
- **Cost:** FREE
- **Limit:** 500 emails/day
- **Features:** Professional, reliable, easy setup

### Alternative Free Options:

**Outlook/Hotmail SMTP**
- **Cost:** FREE
- **Setup:** Similar to Gmail
- **SMTP:** smtp-mail.outlook.com:587

**Yahoo SMTP**
- **Cost:** FREE
- **Setup:** Similar to Gmail  
- **SMTP:** smtp.mail.yahoo.com:587

## 🎯 Production Deployment

### For Production (Vercel/Netlify):
1. **Add environment variables** to your hosting platform
2. **Use same Gmail setup** (works in production)
3. **Monitor email delivery** through Gmail sent folder
4. **Consider upgrading** to dedicated service if volume increases

### Scaling Options:
- **Gmail:** 500 emails/day (FREE)
- **SendGrid:** 100 emails/day (FREE tier)
- **Mailgun:** 5,000 emails/month (FREE tier)
- **Amazon SES:** $0.10 per 1,000 emails

## ✅ Final Checklist

- [ ] Gmail app password created
- [ ] Environment variables added
- [ ] Server restarted
- [ ] Test booking made
- [ ] Customer email received
- [ ] Admin notification received
- [ ] Email templates look good
- [ ] All booking types working

## 🏺 Ready to Go!

Your automatic email system is now set up! Every booking will automatically:
1. **Send beautiful confirmation** to customers
2. **Notify you immediately** of new bookings
3. **Include all booking details** for easy management
4. **Maintain professional appearance** with pharaonic theming

**Cost: $0** - Completely free using Gmail! 🎉
