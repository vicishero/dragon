import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../../hooks/useWallet';
import { formatAddress } from '../../utils/format';
import { Button } from '../common/Button';

export const WalletConnect: React.FC = () => {
  const { t } = useTranslation();
  const { address, isConnected, disconnect, openWalletModal } = useWallet();

  const handleConnect = () => {
    openWalletModal();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected && address) {
    return (
      <button
        onClick={handleDisconnect}
        className="flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-btn border border-gray-700 hover:border-gray-500 transition-all"
      >
        <div className="w-2 h-2 rounded-full bg-success pulse"></div>
        <span className="text-sm font-mono text-text-secondary">{formatAddress(address)}</span>
      </button>
    );
  }

  return (
    <Button onClick={handleConnect} size="sm" variant="primary">
      {t('common.connectWallet')}
    </Button>
  );
};
