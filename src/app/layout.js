import "./globals.css";
import ReduxProvider from "./StoreProvider";
import { Playfair_Display, Inter } from "next/font/google";






const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});


export const metadata = {
  title: "Zulree",
  description: "Luxury Jewellery Brand",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${headingFont.variable}
          ${bodyFont.variable}
          antialiased
          bg-background
          text-foreground
        `}
      >
        <ReduxProvider>
            {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
