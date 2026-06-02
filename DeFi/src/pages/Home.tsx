import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/common/Card';
import { useWallet } from '../hooks/useWallet';
import { useModal, BuyModal } from '../components/common/Modal';
import { PRIVATE_SALE_ADDRESS, PRIVATE_SALE_ABI } from '../contracts/privateSale';

const CountdownBox: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <div className="bg-bg-secondary p-4 rounded-xl border border-gray-700 text-center">
    <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
    <div className="text-xs text-text-muted">{label}</div>
  </div>
);

const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="w-full h-12 bg-bg-secondary rounded-xl overflow-hidden border border-gray-700 relative">
    <div
      className="h-full bg-gradient-to-r from-green-600 to-green-500 transition-all duration-500"
      style={{ width: `${Math.min(percentage, 100)}%` }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-xl font-bold text-white">{Math.round(percentage)}%</div>
    </div>
  </div>
);

// 目标金额 - 60,000 USDT
const TARGET_AMOUNT = 60000n * 10n ** 18n;
// 基础金额 - 25,000 USDT
const BASE_AMOUNT = 25000n * 10n ** 18n;
// USDT decimals
const USDT_DECIMALS = 18;

// 格式化金额
const formatAmount = (amount: bigint | null): string => {
  if (amount === null) return '0';
  const displayAmount = amount + BASE_AMOUNT;
  const divisor = 10n ** BigInt(USDT_DECIMALS);
  const whole = displayAmount / divisor;
  return whole.toLocaleString();
};

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const { address, isConnected, web3, openWalletModal } = useWallet();
  const { isBuyModalOpen, openBuyModal, closeBuyModal } = useModal();

  // 处理BUY NOW按钮点击
  const handleBuyNowClick = () => {
    if (!isConnected) {
      openWalletModal();
    } else {
      openBuyModal();
    }
  };
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [shouldSlideOut, setShouldSlideOut] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [totalRaised, setTotalRaised] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);

  // 从合约读取募集金额
  const fetchTotalRaised = useCallback(async () => {
    if (!web3) return;

    try {
      setLoading(true);

      // 转换为checksum地址
      const privateSaleAddress = web3.utils.toChecksumAddress(PRIVATE_SALE_ADDRESS);

      const contract = new web3.eth.Contract(PRIVATE_SALE_ABI, privateSaleAddress);
      const raised = await contract.methods.totalRaised().call();
      console.log('募集金额:', raised);
      setTotalRaised(BigInt(raised as string));
    } catch (error) {
      console.error('读取募集金额失败:', error);
    } finally {
      setLoading(false);
    }
  }, [web3]);

  // 计算截止时间：今年6月14日
  const getEndDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), 5, 14, 23, 59, 59); // 5是6月（0-11）
  };

  // 计算剩余时间
  const calculateCountdown = () => {
    const now = new Date();
    const end = getEndDate();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  // 计算进度百分比
  const getProgressPercentage = () => {
    if (totalRaised === null) return 0;
    const displayAmount = totalRaised + BASE_AMOUNT;
    const percentage = (Number(displayAmount) / Number(TARGET_AMOUNT)) * 100;
    return Math.min(percentage, 100);
  };

  useEffect(() => {
    // 初始化倒计时
    setCountdown(calculateCountdown());

    // 每秒更新
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 读取募集金额
    fetchTotalRaised();

    // 每30秒刷新一次
    const interval = setInterval(fetchTotalRaised, 30000);
    return () => clearInterval(interval);
  }, [fetchTotalRaised]);

  const handleCopyReferralLink = async () => {
    if (!isConnected || !address) {
      alert('请先连接钱包');
      return;
    }

    const referralCode = address.toLowerCase();
    const referralLink = `${window.location.origin}?code=${referralCode}`;

    try {
      await navigator.clipboard.writeText(referralLink);
      setShowCopySuccess(true);
      setShouldSlideOut(false);

      setTimeout(() => setShouldSlideOut(true), 1000);

      setTimeout(() => {
        setShowCopySuccess(false);
        setShouldSlideOut(false);
      }, 1600);
    } catch (err) {
      console.error('复制失败，尝试备用方法:', err);
      try {
        const textArea = document.createElement('textarea');
        textArea.value = referralLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        setShowCopySuccess(true);
        setShouldSlideOut(false);

        setTimeout(() => setShouldSlideOut(true), 1000);

        setTimeout(() => {
          setShowCopySuccess(false);
          setShouldSlideOut(false);
        }, 1600);
      } catch (err2) {
        console.error('备用复制方法也失败:', err2);
        alert(`复制失败，请手动复制：\n${referralLink}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center">
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
        </div>

        {/* Hero Icon */}
        <div className="relative mb-6 flex justify-center">
          <img
            src="/images/hero.webp"
            alt="DeFi Hero"
            className="w-72 h-72 object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold text-text-primary mb-2 relative">
          {t('home.heroTitle')}
        </h1>
        <p className="text-primary text-sm mb-6 relative">
          {t('home.heroSubtitle')}
        </p>
      </div>

      {/* 私募销售板块 */}
      <div>
        <Card>
        <h2 className="text-lg font-bold text-center mb-6 text-text-primary">
          {t('home.sale.title')}
        </h2>

        {/* 倒计时 */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <CountdownBox value={countdown.days} label={t('home.sale.day')} />
          <CountdownBox value={countdown.hours} label={t('home.sale.hours')} />
          <CountdownBox value={countdown.minutes} label={t('home.sale.minutes')} />
          <CountdownBox value={countdown.seconds} label={t('home.sale.seconds')} />
        </div>

        {/* 募集金额 */}
        <div className="text-center mb-6">
          <span className="text-text-muted text-sm">{t('home.sale.raisedAmount')}: </span>
          <span className="text-lg font-bold text-text-primary">
            {loading ? '...' : `${formatAmount(totalRaised)} USDT`}
          </span>
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <ProgressBar percentage={getProgressPercentage()} />
        </div>

        {/* 目标 */}
        <div className="flex justify-between mb-6">
          <div className="text-left">
            <div className="text-xs text-text-muted mb-1">{t('home.sale.minimumTarget')}</div>
            <div className="text-xl font-bold text-text-primary">30,000 USDT</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-muted mb-1">{t('home.sale.maximumTarget')}</div>
            <div className="text-xl font-bold text-text-primary">60,000 USDT</div>
          </div>
        </div>

        {/* 捐赠按钮 */}
        <div className="text-center mb-6">
          <button
            onClick={handleBuyNowClick}
            className="px-10 py-4 btn-gradient text-white text-base font-bold rounded-btn hover:opacity-90 transition-opacity shadow-lg"
          >
            {t('home.sale.buyNow')}
          </button>
        </div>

        {/* 最小购买 */}
        <div className="text-center pt-4 border-t border-gray-700">
          <div className="text-text-muted text-sm">{t('home.sale.minimumBuy')}: </div>
          <div className="text-lg font-bold text-text-primary mt-1">200 USDT</div>
        </div>
        </Card>
      </div>

      {/* 复制推广链接按钮 */}
      <div className="relative">
        <button
          onClick={handleCopyReferralLink}
          className="w-full py-3 btn-gradient text-white font-semibold rounded-btn hover:opacity-90 transition-opacity"
        >
          {t('home.sale.copyReferralLink')}
        </button>

        {/* 复制成功提示 */}
        {showCopySuccess && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2">
            <div className={`bg-success text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 ${shouldSlideOut ? 'slide-up-out' : 'fade-in'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">{t('home.sale.copySuccess')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Partners Section */}
      <section>
        <Card>
          <h2 className="text-xl font-bold text-center mb-6 text-text-primary">{t('home.partners')}</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'MetaMask', img: '/images/partner/matemask.png' },
              { name: 'BSC', img: '/images/partner/bsc.png' },
              { name: 'PancakeSwap', img: '/images/partner/pancake.png' },
              { name: 'TokenPocket', img: '/images/partner/tp.png' },
              { name: 'CoinMarketCap', img: '/images/partner/cmc.png' },
              { name: 'AWS', img: '/images/partner/aws.png' }
            ].map((partner, index) => (
              <div key={index} className="bg-bg-secondary rounded-lg flex items-center justify-center">
                <img
                  src={partner.img}
                  alt={partner.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Social Section */}
      <section className="pt-4 pb-8">
        <h3 className="text-center text-text-muted text-sm mb-4">{t('home.followUs')}</h3>
        <div className="flex justify-center items-center gap-8 mb-6">
          <button className="p-2 hover:bg-bg-secondary rounded-lg transition-all">
            <img src="/images/github.png" alt="GitHub" className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-bg-secondary rounded-lg transition-all">
            <img src="/images/x.png" alt="X" className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-bg-secondary rounded-lg transition-all">
            <img src="/images/Telegram.png" alt="Telegram" className="w-6 h-6" />
          </button>
        </div>
        <hr className="border-gray-700 mb-4" />
        <p className="text-center text-text-muted text-xs">© 2026. All rights reserved.</p>
      </section>

      {/* 购买面板 */}
      <BuyModal isOpen={isBuyModalOpen} onClose={closeBuyModal} />
    </div>
  );
};
