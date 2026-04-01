export const POLYGON_AMOY = {
  chainId: 80002,
  chainIdHex: '0x13882',
  chainName: 'Polygon Amoy Testnet',
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
};

export const getExplorerUrl = (type: 'tx' | 'address' | 'token', hash: string): string => {
  const base = POLYGON_AMOY.blockExplorerUrls[0];
  return `${base}${type}/${hash}`;
};

export const getExplorerTxUrl = (txHash: string): string => getExplorerUrl('tx', txHash);
export const getExplorerAddressUrl = (address: string): string => getExplorerUrl('address', address);
export const getExplorerTokenUrl = (address: string): string => getExplorerUrl('token', address);