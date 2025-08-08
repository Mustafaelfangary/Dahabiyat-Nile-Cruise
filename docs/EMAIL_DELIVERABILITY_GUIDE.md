# Email Deliverability Guide for Dahabiyat Nile Cruise

## Current Issues Fixed

✅ **Email Templates Updated**
- Removed dark backgrounds and improved contrast
- Simplified design with professional appearance
- Removed excessive promotional language
- Added proper plain text versions

✅ **Email Headers Improved**
- Added proper authentication headers
- Included unsubscribe headers
- Added organization and return-path headers

## DNS Records Required for Better Deliverability

### 1. SPF Record
Add this TXT record to your domain DNS:
```
v=spf1 include:_spf.google.com include:sendgrid.net ~all
```
(Adjust based on your email provider)

### 2. DKIM Record
Your email provider should provide DKIM keys. Add them as TXT records.

### 3. DMARC Record
Add this TXT record:
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@dahabiyatnilecruise.com
```

## Email Provider Recommendations

### Current Issues with Gmail/Outlook
- Emails going to spam/junk folder
- Low sender reputation (new domain)

### Recommended Solutions

1. **Use Professional Email Service**
   - SendGrid (recommended)
   - Mailgun
   - Amazon SES
   - Postmark

2. **Warm Up Your Domain**
   - Start with low volume
   - Gradually increase sending
   - Monitor bounce rates

3. **Content Best Practices**
   - Avoid spam trigger words
   - Maintain good text-to-image ratio
   - Include unsubscribe links
   - Use proper formatting

## Environment Variables to Update

Add these to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_FROM=noreply@dahabiyatnilecruise.com

# For better deliverability
EMAIL_DOMAIN=dahabiyatnilecruise.com
UNSUBSCRIBE_URL=https://dahabiyatnilecruise.com/unsubscribe
```

## Testing Email Deliverability

### Tools to Use
1. **Mail Tester** (mail-tester.com)
2. **MXToolbox** (mxtoolbox.com)
3. **SendForensics**
4. **GlockApps**

### Test Process
1. Send test emails to multiple providers
2. Check spam scores
3. Monitor delivery rates
4. Test on different devices

## Monitoring and Maintenance

### Key Metrics to Track
- Delivery rate
- Open rate
- Click rate
- Bounce rate
- Spam complaints

### Regular Tasks
- Monitor blacklists
- Update DNS records
- Review email content
- Clean email lists

## Immediate Actions Required

1. **Set up proper DNS records** (SPF, DKIM, DMARC)
2. **Switch to professional email service** (SendGrid recommended)
3. **Test email deliverability** using tools mentioned above
4. **Monitor email metrics** and adjust accordingly

## Contact Information

For technical support with email setup:
- Check your domain registrar for DNS management
- Contact your email service provider for DKIM setup
- Use email testing tools to verify configuration
