import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Dongker Barber | Premium Barber Shop Booking",
  description: "Pesan layanan potong rambut premium pria di Dongker Barber dengan mudah secara online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
        {/* Load Midtrans Snap SDK untuk checkout popup */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-your-client-key"}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
