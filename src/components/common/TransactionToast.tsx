import { getExplorerTxUrl } from '@/constants/networks';

interface TransactionToastProps {
  message: string;
  txHash: string;
}

export default function TransactionToast({ message, txHash }: TransactionToastProps) {
  const explorerUrl = getExplorerTxUrl(txHash);

  return (
    <div className="flex flex-col space-y-1">
      <p className="font-medium text-sm">{message}</p>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-400 hover:text-blue-300 underline flex items-center space-x-1"
      >
        <span>View on Polygonscan ↗</span>
      </a>
    </div>
  );
}