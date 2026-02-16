import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import LoginOtpEmail from "../../emails/LoginOtpEmail";


export async function sendOtpEmail(email, verifyCode) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Render React Email template to HTML
    const emailHtml = await render(LoginOtpEmail({ otp: verifyCode }));

    await transporter.sendMail({
      from: `"Zulree" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Zulree Verification Code",
      html: emailHtml,
    });

    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("OTP Email Error:", error);
    return {
      success: false,
      message: "Failed to send OTP",
      error,
    };
  }
}
