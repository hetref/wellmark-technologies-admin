import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthContainer from "./AuthContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Panel | Wellmark Technologies",
  description: "Welcome to admin panel of Wellmark Technologies!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <AuthContainer>{children}</AuthContainer>
      </body>
    </html>
  );
}
