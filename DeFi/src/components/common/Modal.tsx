import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../../hooks/useWallet';
import { PRIVATE_SALE_ADDRESS, PRIVATE_SALE_ABI, USDT_ADDRESS, ERC20_ABI } from '../../contracts/privateSale';

interface ModalContextType {
  isBuyModalOpen: boolean;
  openBuyModal: () => void;
  closeBuyModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const openBuyModal = useCallback(() => {
    setIsBuyModalOpen(true);
  }, []);

  const closeBuyModal = useCallback(() => {
    setIsBuyModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{
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

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const USDT_DECIMALS = 18;

// 最小购买金额：200 USDT
const MIN_PURCHASE_AMOUNT = 200n * 10n ** BigInt(USDT_DECIMALS);

// 格式化金额显示
const formatDisplayAmount = (amount: bigint): string => {
  const divisor = 10n ** BigInt(USDT_DECIMALS);
  const whole = amount / divisor;
  const fraction = (amount % divisor).toString().padStart(USDT_DECIMALS, '0').slice(0, 2);
  return `${whole}.${fraction}`;
};

// 将用户输入转换为合约金额
const parseAmount = (amountStr: string): bigint | null => {
  if (!amountStr || isNaN(parseFloat(amountStr))) return null;
  const parts = amountStr.split('.');
  const whole = parts[0] || '0';
  const fraction = (parts[1] || '').padEnd(USDT_DECIMALS, '0').slice(0, USDT_DECIMALS);
  return BigInt(whole + fraction);
};

export const BuyModal: React.FC<BuyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { address, web3 } = useWallet();
  const [amount, setAmount] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [usdtBalance, setUsdtBalance] = useState<bigint | null>(null);
  const [allowance, setAllowance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);

  // 重置状态
  const resetState = () => {
    setAmount('');
    setIsApproved(false);
    setIsProcessing(false);
  };

  // 当弹窗关闭时重置
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  // 读取余额和授权
  const fetchBalanceAndAllowance = useCallback(async () => {
    if (!web3 || !address) return;

    try {
      setLoading(true);

      // 转换为checksum地址
      const usdtAddress = web3.utils.toChecksumAddress(USDT_ADDRESS);
      const privateSaleAddress = web3.utils.toChecksumAddress(PRIVATE_SALE_ADDRESS);
      const userAddress = web3.utils.toChecksumAddress(address);

      console.log('USDT地址:', usdtAddress);
      console.log('用户地址:', userAddress);

      const usdtContract = new web3.eth.Contract(ERC20_ABI, usdtAddress);

      // 读取余额
      const balance = await usdtContract.methods.balanceOf(userAddress).call();
      console.log('USDT余额:', balance);
      setUsdtBalance(BigInt(balance as string));

      // 读取授权
      const allowed = await usdtContract.methods.allowance(userAddress, privateSaleAddress).call();
      const allowedAmount = BigInt(allowed as string);
      setAllowance(allowedAmount);

      // 检查授权是否足够
      const parsedAmount = parseAmount(amount);
      if (parsedAmount && allowedAmount >= parsedAmount) {
        setIsApproved(true);
      } else {
        setIsApproved(false);
      }
    } catch (error) {
      console.error('读取余额和授权失败:', error);
    } finally {
      setLoading(false);
    }
  }, [web3, address, amount]);

  // 当弹窗打开时读取余额和授权
  useEffect(() => {
    if (isOpen && web3 && address) {
      fetchBalanceAndAllowance();
    }
  }, [isOpen, web3, address, fetchBalanceAndAllowance]);

  const handleMax = () => {
    if (usdtBalance !== null) {
      setAmount(formatDisplayAmount(usdtBalance));
    }
  };

  const handleApprove = async () => {
    if (!web3 || !address || !amount) {
      alert(t('home.sale.buyModal.pleaseEnterAmount'));
      return;
    }

    const parsedAmount = parseAmount(amount);
    if (parsedAmount === null) {
      alert(t('home.sale.buyModal.pleaseEnterAmount'));
      return;
    }

    if (parsedAmount < MIN_PURCHASE_AMOUNT) {
      alert(t('home.sale.minimumDonationAmount'));
      return;
    }

    try {
      setIsProcessing(true);

      // 转换为checksum地址
      const usdtAddress = web3.utils.toChecksumAddress(USDT_ADDRESS);
      const privateSaleAddress = web3.utils.toChecksumAddress(PRIVATE_SALE_ADDRESS);
      const userAddress = web3.utils.toChecksumAddress(address);

      const usdtContract = new web3.eth.Contract(ERC20_ABI, usdtAddress);

      // 授权 - 使用最大金额
      const maxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      await usdtContract.methods.approve(privateSaleAddress, maxUint256).send({ from: userAddress });

      setIsApproved(true);
      setAllowance(BigInt(maxUint256));
    } catch (error) {
      console.error('授权失败:', error);
      alert('授权失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBuy = async () => {
    if (!web3 || !address || !amount) {
      alert(t('home.sale.buyModal.pleaseEnterAmount'));
      return;
    }

    const parsedAmount = parseAmount(amount);
    if (parsedAmount === null || parsedAmount <= 0n) {
      alert(t('home.sale.buyModal.pleaseEnterAmount'));
      return;
    }

    if (parsedAmount < MIN_PURCHASE_AMOUNT) {
      alert(t('home.sale.minimumDonationAmount'));
      return;
    }

    try {
      setIsProcessing(true);

      // 转换为checksum地址
      const privateSaleAddress = web3.utils.toChecksumAddress(PRIVATE_SALE_ADDRESS);
      const userAddress = web3.utils.toChecksumAddress(address);

      const privateSaleContract = new web3.eth.Contract(PRIVATE_SALE_ABI, privateSaleAddress);

      // 调用subscribe
      await privateSaleContract.methods.subscribe(parsedAmount.toString()).send({ from: userAddress });

      alert(`${t('home.sale.buyModal.buySuccess')}${amount} USDT`);
      resetState();
      onClose();
    } catch (error) {
      console.error('购买失败:', error);
      alert('购买失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const displayBalance = usdtBalance !== null ? formatDisplayAmount(usdtBalance) : '...';
  const parsedAmount = parseAmount(amount);
  const canApprove = !isProcessing && parsedAmount !== null && parsedAmount >= MIN_PURCHASE_AMOUNT;
  const canBuy = !isProcessing && isApproved && parsedAmount !== null && parsedAmount >= MIN_PURCHASE_AMOUNT;

  // 如果已经有足够的授权，直接显示购买按钮
  useEffect(() => {
    if (allowance !== null && parsedAmount !== null && allowance >= parsedAmount) {
      setIsApproved(true);
    } else if (allowance !== null && parsedAmount !== null) {
      setIsApproved(false);
    }
  }, [allowance, parsedAmount]);

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
                    min="200"
                    step="0.01"
                    disabled={isProcessing}
                    className="w-full px-4 py-3 bg-bg-dark border border-gray-700 rounded-btn text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors pr-16 disabled:opacity-50"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">USDT</span>
                </div>
                <button
                  onClick={handleMax}
                  disabled={isProcessing || loading}
                  className="px-4 py-3 bg-primary/20 text-primary font-semibold rounded-btn hover:bg-primary/30 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('home.sale.buyModal.max')}
                </button>
              </div>
              <p className="text-xs text-text-muted mt-2">{t('home.sale.minimumDonationAmount')}</p>
            </div>

            {/* USDT余额 */}
            <div className="flex justify-between items-center bg-bg-dark rounded-btn p-4">
              <span className="text-text-muted text-sm">{t('home.sale.buyModal.usdtBalance')}</span>
              <span className="text-text-primary font-semibold">{displayBalance} USDT</span>
            </div>

            {/* 授权/购买按钮 */}
            {!isApproved ? (
              <button
                onClick={handleApprove}
                disabled={!canApprove || loading}
                className="w-full py-3 btn-gradient text-white font-semibold rounded-btn hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? t('home.sale.buyModal.approving') : t('home.sale.buyModal.approve')}
              </button>
            ) : (
              <button
                onClick={handleBuy}
                disabled={!canBuy || loading}
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
