const nodemailer = require('nodemailer');

const getAppBaseUrl = () => {
  return process.env.APP_BASE_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
};

const hasSmtpConfig = () => {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
};

const createTransporter = () => {
  if (!hasSmtpConfig()) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    connectionTimeout: 5000, // 5 giây giới hạn kết nối
    greetingTimeout: 5000,   // 5 giây giới hạn chào hỏi SMTP
    socketTimeout: 10000     // 10 giây giới hạn socket truyền dữ liệu
  });
};

const sendMail = async ({ to, subject, html, text, fallbackLink }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('SMTP is not configured. Email was not sent.');
    console.log(subject + ' link:', fallbackLink);
    return { skipped: true, fallbackLink };
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  return transporter.sendMail({ from, to, subject, html, text });
};

const sendVerificationEmail = async ({ to, name, token }) => {
  const link = `${getAppBaseUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  const safeName = name || 'bạn';

  return sendMail({
    to,
    subject: 'Xác thực tài khoản Nutricore Tây Nguyên',
    fallbackLink: link,
    text: `Xin chào ${safeName}, vui lòng xác thực tài khoản tại: ${link}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:28px;background:#f7f4e8;color:#2c351f;border-radius:18px">
        <h2 style="color:#3f5628;margin:0 0 12px">Xác thực tài khoản Nutricore</h2>
        <p>Xin chào <strong>${safeName}</strong>,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại Nutricore Tây Nguyên. Vui lòng bấm nút bên dưới để kích hoạt tài khoản.</p>
        <p style="margin:28px 0">
          <a href="${link}" style="background:#3f5628;color:#fff;padding:14px 24px;border-radius:999px;text-decoration:none;font-weight:700;display:inline-block">Xác thực email</a>
        </p>
        <p style="font-size:13px;color:#6d705d">Liên kết có hiệu lực trong 24 giờ. Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
      </div>
    `
  });
};

const sendPasswordResetEmail = async ({ to, name, token }) => {
  const link = `${getAppBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  const safeName = name || 'bạn';

  return sendMail({
    to,
    subject: 'Đặt lại mật khẩu Nutricore Tây Nguyên',
    fallbackLink: link,
    text: `Xin chào ${safeName}, đặt lại mật khẩu tại: ${link}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:28px;background:#f7f4e8;color:#2c351f;border-radius:18px">
        <h2 style="color:#3f5628;margin:0 0 12px">Đặt lại mật khẩu</h2>
        <p>Xin chào <strong>${safeName}</strong>,</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Nutricore của bạn.</p>
        <p style="margin:28px 0">
          <a href="${link}" style="background:#a66b2f;color:#fff;padding:14px 24px;border-radius:999px;text-decoration:none;font-weight:700;display:inline-block">Đặt lại mật khẩu</a>
        </p>
        <p style="font-size:13px;color:#6d705d">Liên kết có hiệu lực trong 60 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      </div>
    `
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
