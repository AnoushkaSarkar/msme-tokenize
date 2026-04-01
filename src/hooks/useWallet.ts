'use client';

import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, formatEther } from 'ethers';
import { POLYGON_AMOY } from '@/constants/networks';
import toast from 'react-hot-toast';

interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  balance: string;
  provider: BrowserProvider | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isCorrectNetwork: false,
    balance: '0',
    provider: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const isMetaMaskInstalled = (): boolean => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  const getWalletInfo = useCallback(async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const address = accounts[0].address;
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);
        const balance = await provider.getBalance(address);

        setWallet({
          address,
          chainId,
          isConnected: true,
          isCorrectNetwork: chainId === POLYGON_AMOY.chainId,
          balance: formatEther(balance),
          provider,
        });
      }
    } catch (error) {
      console.error('Error getting wallet info:', error);
    }
  }, []);

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask not found! Please install MetaMask extension.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const network = await provider.getNetwork();
        const chainId = Number(network.chainId);
        const balance = await provider.getBalance(accounts[0]);

        setWallet({
          address: accounts[0],
          chainId,
          isConnected: true,
          isCorrectNetwork: chainId === POLYGON_AMOY.chainId,
          balance: formatEther(balance),
          provider,
        });

        toast.success(`Wallet connected! ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);

        if (chainId !== POLYGON_AMOY.chainId) {
          await switchToAmoy();
        }
      }
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error('Connection rejected. Please approve in MetaMask.');
      } else {
        toast.error('Failed to connect wallet. Try again.');
        console.error('Connect error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      chainId: null,
      isConnected: false,
      isCorrectNetwork: false,
      balance: '0',
      provider: null,
    });
    toast.success('Wallet disconnected');
  };

  const switchToAmoy = async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_AMOY.chainIdHex }],
      });
      toast.success('Switched to Polygon Amoy Testnet!');
      await getWalletInfo();
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: POLYGON_AMOY.chainIdHex,
              chainName: POLYGON_AMOY.chainName,
              rpcUrls: POLYGON_AMOY.rpcUrls,
              nativeCurrency: POLYGON_AMOY.nativeCurrency,
              blockExplorerUrls: POLYGON_AMOY.blockExplorerUrls,
            }],
          });
          toast.success('Polygon Amoy added and switched!');
          await getWalletInfo();
        } catch (addError) {
          toast.error('Failed to add Polygon Amoy network');
        }
      } else {
        toast.error('Failed to switch network');
      }
    }
  };

  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    getWalletInfo();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        getWalletInfo();
      }
    };

    const handleChainChanged = () => {
      getWalletInfo();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [getWalletInfo]);

  return {
    ...wallet,
    isLoading,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    connectWallet,
    disconnectWallet,
    switchToAmoy,
  };
}