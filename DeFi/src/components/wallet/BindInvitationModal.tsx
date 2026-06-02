import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useTranslation } from 'react-i18next';
import { INVITATION_CONTRACT_ADDRESS, INVITATION_ABI } from '../../contracts/invitation';

interface BindInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  web3: Web3;
  onBindSuccess: (inviter: string) => void;
}

export const BindInvitationModal: React.FC<BindInvitationModalProps> = ({
  isOpen,
  onClose,
  address,
  web3,
  onBindSuccess,
}) => {
  const { t } = useTranslation();
  const [inviterCode, setInviterCode] = useState('');
  const [isBinding, setIsBinding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 从URL获取邀请码
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      setInviterCode(code || '');
    }
  }, [isOpen]);

  const handleBind = async () => {
    if (!inviterCode) {
      alert(t('bind.pleaseEnterInviteCode'));
      return;
    }

    if (!web3.utils.isAddress(inviterCode)) {
      alert(t('bind.invalidInviteCode'));
      return;
    }

    try {
      setIsBinding(true);
      const contract = new web3.eth.Contract(INVITATION_ABI, INVITATION_CONTRACT_ADDRESS);

      console.log('正在绑定邀请关系，邀请人:', inviterCode);

      // 调用bind函数
      await contract.methods.bind(inviterCode).send({ from: address });

      console.log('绑定成功！');
      onBindSuccess(inviterCode);
      onClose();
    } catch (error) {
      console.error('绑定失败:', error);
      alert(t('bind.bindFailed'));
    } finally {
      setIsBinding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative w-full max-w-[500px] bg-bg-secondary rounded-t-[20px] md:rounded-[20px] md:mb-auto md:mt-auto fade-in">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-primary">{t('bind.title')}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">
                {t('bind.inviteCode')}
              </label>
              <input
                type="text"
                value={inviterCode}
                onChange={(e) => setInviterCode(e.target.value)}
                placeholder={t('bind.inviteCodePlaceholder')}
                className="w-full px-4 py-3 bg-bg-dark border border-gray-700 rounded-btn text-text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <button
              onClick={handleBind}
              disabled={isBinding}
              className="w-full py-3 btn-gradient text-white font-semibold rounded-btn hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBinding ? t('bind.binding') : t('bind.bind')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
