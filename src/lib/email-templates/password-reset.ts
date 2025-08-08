export const passwordResetTemplate = {
  subject: '🔐 Password Reset Request - Dahabiyat Nile Cruise',
  html: (data: {
    user: { name: string; email: string };
    resetUrl: string;
    resetToken: string;
    expiryTime: string;
    supportEmail: string;
  }) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #0080ff;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #8B4513;
          margin-bottom: 10px;
        }
        .hieroglyphics {
          font-size: 24px;
          color: #0080ff;
          margin: 10px 0;
        }
        .content {
          margin-bottom: 30px;
        }
        .greeting {
          font-size: 18px;
          color: #8B4513;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.8;
        }
        .reset-button {
          display: inline-block;
          background: linear-gradient(135deg, #0080ff, #B8941F);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px;
          margin: 20px 0;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 128, 255, 0.3);
          transition: all 0.3s ease;
        }
        .reset-button:hover {
          background: linear-gradient(135deg, #B8941F, #0080ff);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 128, 255, 0.4);
        }
        .security-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .security-title {
          font-weight: bold;
          color: #856404;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
        .security-text {
          color: #856404;
          font-size: 14px;
          line-height: 1.6;
        }
        .expiry-warning {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #721c24;
          text-align: center;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        .support-info {
          background: #e7f3ff;
          border: 1px solid #b8daff;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
        }
        .token-info {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          font-family: monospace;
          font-size: 12px;
          color: #6c757d;
        }
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          .container {
            padding: 20px;
          }
          .reset-button {
            display: block;
            width: 100%;
            box-sizing: border-box;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Dahabiyat Nile Cruise</div>
          <div class="hieroglyphics">𓇳 𓈖 𓊪 𓏏 𓇳</div>
          <p style="color: #666; margin: 0;">Luxury Nile River Experience</p>
        </div>

        <div class="content">
          <div class="greeting">
            Hello ${data.user.name || 'Valued Customer'},
          </div>

          <div class="message">
            We received a request to reset the password for your Dahabiyat Nile Cruise account 
            associated with <strong>${data.user.email}</strong>.
          </div>

          <div class="message">
            If you made this request, click the button below to reset your password:
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" class="reset-button">
              🔐 Reset My Password
            </a>
          </div>

          <div class="expiry-warning">
            ⏰ This link will expire in ${data.expiryTime}
          </div>

          <div class="security-info">
            <div class="security-title">
              🛡️ Security Information
            </div>
            <div class="security-text">
              • If you didn't request this password reset, please ignore this email<br>
              • Your password will remain unchanged until you create a new one<br>
              • This link can only be used once<br>
              • For security, we recommend using a strong, unique password
            </div>
          </div>

          <div class="message">
            If the button above doesn't work, you can copy and paste this link into your browser:
          </div>

          <div class="token-info">
            ${data.resetUrl}
          </div>

          <div class="support-info">
            <strong>Need Help?</strong><br>
            If you're having trouble resetting your password or didn't request this change, 
            please contact our support team at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a>
          </div>
        </div>

        <div class="footer">
          <p><strong>Dahabiyat Nile Cruise</strong></p>
          <p>Experience the magic of ancient Egypt in luxury</p>
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: (data: {
    user: { name: string; email: string };
    resetUrl: string;
    resetToken: string;
    expiryTime: string;
    supportEmail: string;
  }) => `
Password Reset Request - Dahabiyat Nile Cruise

Hello ${data.user.name || 'Valued Customer'},

We received a request to reset the password for your Dahabiyat Nile Cruise account associated with ${data.user.email}.

If you made this request, click the link below to reset your password:
${data.resetUrl}

This link will expire in ${data.expiryTime}.

Security Information:
- If you didn't request this password reset, please ignore this email
- Your password will remain unchanged until you create a new one
- This link can only be used once
- For security, we recommend using a strong, unique password

Need Help?
If you're having trouble resetting your password or didn't request this change, please contact our support team at ${data.supportEmail}

Dahabiyat Nile Cruise
Experience the magic of ancient Egypt in luxury

This is an automated message. Please do not reply to this email.
  `
};
