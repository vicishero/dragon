import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import Web3 from 'web3';

interface WalletContextType {
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  disconnect: () => void;
  openWalletModal: () => void;
  web3: Web3 | undefined;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [web3, setWeb3] = useState<Web3 | undefined>();

  const isConnected = !!address;
  const isDisconnected = !address;

  const openWalletModal = useCallback(() => {
    setShowWalletModal(true);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(undefined);
    setWeb3(undefined);
  }, []);

  const connectMetaMask = useCallback(async () => {
    try {
      setIsConnecting(true);

      if (typeof window.ethereum === 'undefined') {
        alert('请安装MetaMask钱包');
        return;
      }

      // 请求账户授权
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts && accounts.length > 0) {
        const newWeb3 = new Web3(window.ethereum);
        setWeb3(newWeb3);
        setAddress(accounts[0]);
        setShowWalletModal(false);
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      alert('连接钱包失败，请重试');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // 自动连接已授权的钱包
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // 检查是否已经有授权的账户
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });

          if (accounts && accounts.length > 0) {
            const newWeb3 = new Web3(window.ethereum);
            setWeb3(newWeb3);
            setAddress(accounts[0]);
          }
        } catch (error) {
          console.error('自动连接失败:', error);
        }
      }
    };

    autoConnect();
  }, []);

  // 监听账户变化
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          setAddress(undefined);
          setWeb3(undefined);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        isDisconnected,
        disconnect,
        openWalletModal,
        web3,
      }}
    >
      {children}

      {/* 钱包选择弹窗 */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowWalletModal(false)} />
          <div className="relative w-full max-w-[500px] bg-bg-secondary rounded-t-[20px] md:rounded-[20px] md:mb-auto md:mt-auto fade-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text-primary">选择钱包</h3>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={connectMetaMask}
                  disabled={isConnecting}
                  className="w-full flex items-center gap-4 p-4 bg-bg-dark border border-gray-700 rounded-btn hover:border-primary transition-all disabled:opacity-50"
                >
                  <div className="w-12 h-12 rounded-lg bg-bg-secondary flex items-center justify-center">
                    <svg className="w-8 h-8" viewBox="0 0 35 33" fill="none">
                      <path d="M32.9634 2.58553L28.6514 0L25.2693 4.1825L22.3795 1.05098L17.6129 4.81369L15.1406 0.667508L10.3739 4.43931L7.48428 1.05098L4.10215 5.2438L0 2.58553L0.874518 12.1889L3.27789 10.6543L3.68873 14.0679L2.04542 15.2228V17.2832L3.62822 18.5806L3.38774 20.2532L5.39993 22.1008L7.04324 21.1028L8.37622 23.0279L10.0806 22.0704L10.6095 24.5017L12.5763 25.4192L13.9494 22.988L15.0536 23.5245L15.7266 26.3767L17.5298 27.6741L19.3104 26.3767L20.0065 23.5245L21.0978 22.988L22.4974 25.4192L24.4805 24.5017L24.9872 22.0704L26.7099 23.0279L28.028 21.1028L29.6645 22.1008L31.6848 20.2532L31.4443 18.5806L33.0271 17.2832V15.2228L31.3838 14.0679L31.7946 10.6543L34.198 12.1889L32.9634 2.58553Z" fill="#E2761B"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-text-primary">MetaMask</div>
                    <div className="text-xs text-text-muted">
                      {isConnecting ? '连接中...' : '点击连接'}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
