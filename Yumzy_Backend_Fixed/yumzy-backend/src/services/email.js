const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from:    process.env.EMAIL_FROM || "Yumzy <no-reply@yumzy.com>",
    to,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
};

// ── Email templates ────────────────────────────────────────────────────────
const emailTemplates = {
  passwordReset: (name, resetUrl) => ({
    subject: "Reset Your Yumzy Password",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#1a3d1a;">🍜 Yumzy Password Reset</h2>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below. This link expires in <strong>10 minutes</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#1a3d1a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
        <hr/><p style="color:#999;font-size:12px;">Yumzy Restaurant Management Platform</p>
      </div>
    `,
  }),

  welcomeAdmin: (name) => ({
    subject: "Welcome to Yumzy Admin",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#1a3d1a;">🍜 Welcome to Yumzy, ${name}!</h2>
        <p>Your admin account has been created successfully.</p>
        <p>You can now access the admin portal and manage the platform.</p>
        <a href="${process.env.ADMIN_PORTAL_URL}" style="display:inline-block;background:#1a3d1a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Open Admin Portal</a>
        <hr/><p style="color:#999;font-size:12px;">Yumzy Restaurant Management Platform</p>
      </div>
    `,
  }),

  restaurantApproved: (name, restaurantName) => ({
    subject: `Your Restaurant "${restaurantName}" Has Been Approved!`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#1a3d1a;">🎉 Congratulations, ${name}!</h2>
        <p>Your restaurant <strong>${restaurantName}</strong> has been approved on the Yumzy platform.</p>
        <p>You can now start managing your restaurant, menu, orders, and more.</p>
        <a href="${process.env.CLIENT_PORTAL_URL}" style="display:inline-block;background:#1a3d1a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Open Restaurant Portal</a>
        <hr/><p style="color:#999;font-size:12px;">Yumzy Restaurant Management Platform</p>
      </div>
    `,
  }),

  restaurantSuspended: (name, restaurantName, reason) => ({
    subject: `Important Notice: Your Restaurant Has Been Suspended`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#c62828;">⚠️ Account Suspended</h2>
        <p>Hi ${name},</p>
        <p>Your restaurant <strong>${restaurantName}</strong> has been suspended.</p>
        <p><strong>Reason:</strong> ${reason || "Policy violation"}</p>
        <p>Please contact support if you believe this is a mistake.</p>
        <hr/><p style="color:#999;font-size:12px;">Yumzy Restaurant Management Platform</p>
      </div>
    `,
  }),

  newOrderAlert: (restaurantName, orderNumber, items, totalAmount) => ({
    subject: `New Order ${orderNumber} Received`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#1a3d1a;">🛎️ New Order for ${restaurantName}</h2>
        <p><strong>Order #:</strong> ${orderNumber}</p>
        <p><strong>Items:</strong> ${items.map(i => `${i.name} x${i.qty}`).join(", ")}</p>
        <p><strong>Total:</strong> ${totalAmount.toLocaleString()} RWF</p>
        <hr/><p style="color:#999;font-size:12px;">Yumzy Restaurant Management Platform</p>
      </div>
    `,
  }),

  emailVerification: (name, verifyUrl) => ({
    subject: "Verify Your Yumzy Email",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#1a3d1a;">🍜 Verify Your Email</h2>
        <p>Hi ${name}, please verify your email address by clicking the button below.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#1a3d1a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;">Verify Email</a>
        <p>This link expires in 24 hours.</p>
        <hr/><p style="color:#999;font-size:12px;">Yumzy Restaurant Management Platform</p>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };
