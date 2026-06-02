import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect, useRef } from 'react';
import Web3 from 'web3';
import { INVITATION_CONTRACT_ADDRESS, INVITATION_ABI } from '../contracts/invitation';
import { BindInvitationModal } from '../components/wallet/BindInvitationModal';

interface WalletContextType {
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  disconnect: () => void;
  openWalletModal: () => void;
  web3: Web3 | undefined;
  isBound: boolean;
  inviterAddress: string | undefined;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showBindModal, setShowBindModal] = useState(false);
  const [web3, setWeb3] = useState<Web3 | undefined>();
  const [isBound, setIsBound] = useState(false);
  const [inviterAddress, setInviterAddress] = useState<string | undefined>();

  const isConnected = !!address;
  const isDisconnected = !address;

  const openWalletModal = useCallback(() => {
    setShowWalletModal(true);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(undefined);
    setWeb3(undefined);
    setIsBound(false);
    setInviterAddress(undefined);
    setShowBindModal(false);
  }, []);

  // 检测绑定状态
  const checkBindStatus = useCallback(async (userAddress: string, web3Instance: Web3) => {
    try {
      console.log('开始检测绑定关系...');
      const contract = new web3Instance.eth.Contract(INVITATION_ABI, INVITATION_CONTRACT_ADDRESS);

      // 使用合约的 isBound 接口判断是否已绑定
      const boundResult = await contract.methods.isBound(userAddress).call();
      console.log('isBound 返回值:', boundResult, '类型:', typeof boundResult);

      // 健壮的布尔值转换 - 处理可能的返回值格式问题
      const bound = !!boundResult;
      console.log('转换后的 bound 值:', bound);

      if (bound) {
        // 已绑定，获取邀请人地址
        const inviterAddr = await contract.methods.getInviter(userAddress).call();
        console.log('getInviter 返回值:', inviterAddr, '类型:', typeof inviterAddr);
        setIsBound(true);
        // 安全的类型转换
        const inviterAddrStr = String(inviterAddr);
        setInviterAddress(inviterAddrStr);
        console.log('已绑定邀请关系，邀请人:', inviterAddrStr);
        return;
      }

      // 未绑定，显示绑定面板
      console.log('未绑定，显示绑定面板');
      setShowBindModal(true);
    } catch (error) {
      console.error('检测绑定状态失败:', error);
    }
  }, []);

  // 绑定成功回调
  const handleBindSuccess = useCallback((inviter: string) => {
    setIsBound(true);
    setInviterAddress(inviter);
    console.log('绑定成功，邀请人:', inviter);
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

        // 检测绑定状态
        await checkBindStatus(accounts[0], newWeb3);
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      alert('连接钱包失败，请重试');
    } finally {
      setIsConnecting(false);
    }
  }, [checkBindStatus]);

  // 初始化监听
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    if (typeof window.ethereum === 'undefined') {
      return;
    }

    const ethereum = window.ethereum as any;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        const newWeb3 = new Web3(ethereum);
        setWeb3(newWeb3);
        setAddress(accounts[0]);

        // 检测绑定状态
        await checkBindStatus(accounts[0], newWeb3);
      } else {
        setAddress(undefined);
        setWeb3(undefined);
        setIsBound(false);
        setInviterAddress(undefined);
        setShowBindModal(false);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    // 自动连接已授权的钱包
    const autoConnect = async () => {
      try {
        const accounts = await ethereum.request({
          method: 'eth_accounts'
        });

        if (accounts && accounts.length > 0) {
          const newWeb3 = new Web3(ethereum);
          setWeb3(newWeb3);
          setAddress(accounts[0]);
          await checkBindStatus(accounts[0], newWeb3);
        }
      } catch (error) {
        console.error('自动连接失败:', error);
      }
    };

    autoConnect();

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      try {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      } catch (e) {
        console.error('清理监听器失败:', e);
      }
    };
  }, [checkBindStatus]);

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
        isBound,
        inviterAddress,
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

      {/* 绑定邀请关系弹窗 */}
      {showBindModal && address && web3 && (
        <BindInvitationModal
          isOpen={showBindModal}
          onClose={() => setShowBindModal(false)}
          address={address}
          web3={web3}
          onBindSuccess={handleBindSuccess}
        />
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
