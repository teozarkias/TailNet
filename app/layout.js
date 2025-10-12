import "./globals.css";

export const metadata = {
  title: "Dog Walker",
  description: "Find and manage dog walks easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
