'use client';

import { useWallet } from '@/hooks/useWallet';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { address, connectWallet, disconnectWallet } = useWallet();

  return (
    <>
      <Navbar
        walletAddress={address}
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
      />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}