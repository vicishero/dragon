import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalContextType {
  isBindModalOpen: boolean;
  openBindModal: () => void;
  closeBindModal: () => void;
  isBuyModalOpen: boolean;
  openBuyModal: () => void;
  closeBuyModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isBindModalOpen, setIsBindModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const openBindModal = useCallback(() => {
    setIsBindModalOpen(true);
  }, []);

  const closeBindModal = useCallback(() => {
    setIsBindModalOpen(false);
  }, []);

  const openBuyModal = useCallback(() => {
    setIsBuyModalOpen(true);
  }, []);

  const closeBuyModal = useCallback(() => {
    setIsBuyModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{
      isBindModalOpen, openBindModal, closeBindModal,
      isBuyModalOpen, openBuyModal, closeBuyModal
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface BindModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BindModal: React.FC<BindModalProps> = ({ isOpen, onClose }) => {
  const [inviteAddress, setInviteAddress] = useState('');
  const [isBinding, setIsBinding] = useState(false);

  // 当弹窗打开时获取URL参数
  React.useEffect(() => {
    if (isOpen) {
      const urlParams = new URLSearchParams(window.location.search);
      const inviteCode = urlParams.get('code') || urlParams.get('invite') || urlParams.get('ref') || '';
      setInviteAddress(inviteCode);
    }
  }, [isOpen]);

  const handleBind = () => {
    if (!inviteAddress.trim()) {
      alert('请输入邀请人地址');
      return;
    }

    setIsBinding(true);
    setTimeout(() => {
      alert(`绑定邀请地址：${inviteAddress}`);
      setIsBinding(false);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative w-full max-w-[500px] max-h-[80vh] overflow-y-auto bg-bg-secondary rounded-t-[20px] md:rounded-[20px] md:mb-auto md:mt-auto fade-in">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-primary">绑定关系</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary mb-2 text-sm">邀请人地址</label>
              <input
                type="text"
                value={inviteAddress}
                onChange={(e) => setInviteAddress(e.target.value)}
                placeholder="请输入邀请人地址"
                className="w-full px-4 py-3 bg-bg-dark border border-gray-700 rounded-btn text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={handleBind}
              disabled={isBinding}
              className="w-full py-3 btn-gradient text-white font-semibold rounded-btn hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBinding ? '绑定中...' : '绑定'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [usdtBalance, setUsdtBalance] = useState('1250.50'); // 模拟余额

  const handleMax = () => {
    setAmount(usdtBalance);
  };

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsApproved(true);
      setIsProcessing(false);
    }, 1000);
  };

  const handleBuy = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert(t('home.sale.buyModal.pleaseEnterAmount'));
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      alert(`${t('home.sale.buyModal.buySuccess')}${amount} USDT`);
      setIsProcessing(false);
      setAmount('');
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-[500px] max-h-[80vh] overflow-y-auto bg-bg-secondary rounded-t-[20px] md:rounded-[20px] md:mb-auto md:mt-auto fade-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-primary">{t('home.sale.buyModal.title')}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-bg-dark rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* 金额输入 */}
            <div>
              <label className="block text-text-secondary mb-2 text-sm">{t('home.sale.buyModal.enterAmount')}</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t('home.sale.buyModal.placeholder')}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-bg-dark border border-gray-700 rounded-btn text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">USDT</span>
                </div>
                <button
                  onClick={handleMax}
                  className="px-4 py-3 bg-primary/20 text-primary font-semibold rounded-btn hover:bg-primary/30 transition-colors whitespace-nowrap"
                >
                  {t('home.sale.buyModal.max')}
                </button>
              </div>
            </div>

            {/* USDT余额 */}
            <div className="flex justify-between items-center bg-bg-dark rounded-btn p-4">
              <span className="text-text-muted text-sm">{t('home.sale.buyModal.usdtBalance')}</span>
              <span className="text-text-primary font-semibold">{usdtBalance} USDT</span>
            </div>

            {/* 授权/购买按钮 */}
            {!isApproved ? (
              <button
                onClick={handleApprove}
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                className="w-full py-3 btn-gradient text-white font-semibold rounded-btn hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? t('home.sale.buyModal.approving') : t('home.sale.buyModal.approve')}
              </button>
            ) : (
              <button
                onClick={handleBuy}
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                className="w-full py-3 btn-gradient text-white font-semibold rounded-btn hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? t('home.sale.buyModal.buying') : t('home.sale.buyModal.buy')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
