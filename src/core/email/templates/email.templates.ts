export function sendActivationCodeTemplate(
  name: string,
  activationCode: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Account Activation</title>
      </head>
      <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 30px;">
          <h2 style="color: #333;">Hello, ${name}! 👋</h2>
          <p>Thank you for registering. Please use the following code to activate your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${activationCode}</span>
          </div>
          <p style="color: #888; font-size: 13px;">This code is valid for <strong>15 minutes</strong>. If you did not register, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #aaa; font-size: 12px; text-align: center;">FRC Platform</p>
        </div>
      </body>
    </html>
  `;
}

export function sendForgetCodeTemplate(
  name: string,
  forgetCode: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Password Reset</title>
      </head>
      <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 30px;">
          <h2 style="color: #333;">Hello, ${name}! 🔒</h2>
          <p>We received a request to reset your password. Use the code below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #EF4444;">${forgetCode}</span>
          </div>
          <p style="color: #888; font-size: 13px;">This code is valid for <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #aaa; font-size: 12px; text-align: center;">FRC Platform</p>
        </div>
      </body>
    </html>
  `;
}
