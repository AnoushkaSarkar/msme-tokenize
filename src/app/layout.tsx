import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "MSME Tokenize — Micro Equity for Indian MSMEs",
  description:
    "Blockchain-based micro equity tokenisation platform enabling Indian MSMEs to raise capital via fractional ERC-20 tokens. Educational prototype only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Global Disclaimer Banner */}
        <div className="disclaimer-banner sticky top-0 z-50">
          ⚠️ EDUCATIONAL PROTOTYPE ONLY — Not a real securities offering. Testnet only. No real money involved.
          SEBI registration required for actual operations.
        </div>

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />

        {/* Client Layout with Navbar + Footer */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}