import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

const main = {
  backgroundColor: "#fff5f8",
  fontFamily: "Helvetica, Arial, sans-serif",
  padding: "30px 0",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "0 20px",
};

const card = {
  backgroundColor: "#ffffff",
  padding: "45px 35px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow: "0 12px 40px rgba(255,63,108,0.08)",
};

const logo = {
  margin: "0 auto 30px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  marginBottom: "20px",
  color: "#111",
};

const paragraph = {
  fontSize: "14px",
  color: "#555",
  lineHeight: "1.8",
  marginBottom: "30px",
};

const otpWrapper = {
  backgroundColor: "#fff0f4",
  border: "2px solid #ff3f6c",
  borderRadius: "16px",
  padding: "22px",
  marginBottom: "30px",
};

const otpText = {
  fontSize: "34px",
  fontWeight: "700",
  letterSpacing: "8px",
  color: "#ff3f6c",
  margin: 0,
};

const button = {
  backgroundColor: "#ff3f6c",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "30px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  marginBottom: "25px",
};

const validityText = {
  fontSize: "13px",
  color: "#777",
  marginBottom: "30px",
};

const divider = {
  borderColor: "#f1f1f1",
  margin: "30px 0",
};

const securityText = {
  fontSize: "12px",
  color: "#888",
  lineHeight: "1.6",
};

const footer = {
  textAlign: "center",
  fontSize: "12px",
  color: "#999",
  marginTop: "20px",
};

const link = {
  color: "#ff3f6c",
  textDecoration: "none",
};

const imageWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}




export default function LoginOtpEmail({ otp }) {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>Your Zulree verification code</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            {/* Logo */}
            <div style={imageWrapper}>
              <Img
                src="https://res.cloudinary.com/dh4blkvix/image/upload/v1771153898/zulree_assets/h3euusutterlyrf6g7ss.png"
                width="130"
                style={logo}
                alt="Zulree"
              />
            </div>

            <Heading style={heading}>Confirm It’s Really You</Heading>

            <Text style={paragraph}>
              <br />
              We received a request to sign in to your Zulree account. Enter the
              verification code below to continue your fashion journey.
            </Text>

            {/* OTP Box */}
            <Section style={otpWrapper}>
              <Text style={otpText}>{otp}</Text>
            </Section>

            {/* CTA Button */}
            <Button href="https://zulree.com" style={button}>
              Continue to Zulree
            </Button>

            <Text style={validityText}>This code is valid for 10 minutes.</Text>

            <Hr style={divider} />

            <Text style={securityText}>
              If this wasn’t you, no worries — simply ignore this email. Zulree
              will never ask for your password or payment details.
            </Text>
          </Section>

          <Text style={footer}>
            © {currentYear} Zulree. Made with love for modern fashion.
            <br />
            <Link href="https://zulree.com" style={link}>
              zulree.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
