import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../hooks/useWallet';
import { Card } from '../components/common/Card';
import { INVITATION_CONTRACT_ADDRESS, INVITATION_ABI } from '../contracts/invitation';

export const Team: React.FC = () => {
  const { address, web3 } = useWallet();
  const [teamStats, setTeamStats] = useState({
    totalMembers: 0,
    directReferrals: 0,
    teamPerformance: '0',
    smallTeamPerformance: '0'
  });
  const [referralList, setReferralList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // 获取团队数据
  const fetchTeamData = useCallback(async () => {
    if (!web3 || !address) return;

    try {
      setLoading(true);

      const contract = new web3.eth.Contract(INVITATION_ABI, INVITATION_CONTRACT_ADDRESS);

      // 获取直推人数
      const directCount = await contract.methods.getInviteeCount(address).call();

      // 获取团队总人数
      const teamTotal = await contract.methods.getTeamCount(address).call();

      // 获取直推列表
      const directInvitees = await contract.methods.getInvitees(address).call();

      // 更新状态
      setTeamStats({
        totalMembers: Number(teamTotal), // 使用团队总人数
        directReferrals: Number(directCount),
        teamPerformance: '0',
        smallTeamPerformance: '0'
      });

      // 设置直推列表
      const referralData = (directInvitees as string[]).map((addr) => ({
        address: addr,
        teamPerformance: '0',
        personalPerformance: '0'
      }));
      setReferralList(referralData);
    } catch (error) {
      console.error('获取团队数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [web3, address]);

  // 复制邀请链接
  const copyReferralLink = async () => {
    if (!address) return;
    const referralCode = address.toLowerCase();
    const referralLink = `${window.location.origin}?code=${referralCode}`;

    try {
      await navigator.clipboard.writeText(referralLink);
      alert('复制成功！');
    } catch (err) {
      console.error('复制失败', err);
      // 备用方法
      try {
        const textArea = document.createElement('textarea');
        textArea.value = referralLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('复制成功！');
      } catch (err2) {
        console.error('备用复制方法也失败', err2);
        alert('复制失败，请手动复制');
      }
    }
  };

  // 当钱包连接时获取数据
  useEffect(() => {
    if (web3 && address) {
      fetchTeamData();
    }
  }, [web3, address, fetchTeamData]);

  return (
    <div className="space-y-6">
      {/* 团队信息 */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-6">团队信息</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <Card>
            <div className="text-xs text-text-muted mb-1">团队总人数</div>
            <div className="text-2xl font-bold text-text-primary">
              {loading ? '...' : teamStats.totalMembers}
            </div>
          </Card>

          <Card>
            <div className="text-xs text-text-muted mb-1">直推人数</div>
            <div className="text-2xl font-bold text-text-primary">
              {loading ? '...' : teamStats.directReferrals}
            </div>
          </Card>

          <Card>
            <div className="text-xs text-text-muted mb-1">团队业绩(V0)</div>
            <div className="text-2xl font-bold text-text-primary">
              {teamStats.teamPerformance}
            </div>
          </Card>

          <Card>
            <div className="text-xs text-text-muted mb-1">小区总业绩</div>
            <div className="text-2xl font-bold text-text-primary">
              {teamStats.smallTeamPerformance}
            </div>
          </Card>
        </div>

        {/* 邀请链接 */}
        {address && (
          <Card>
            <div className="text-sm text-text-primary mb-4">我的邀请链接</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-base font-mono text-text-primary break-all">
                {`${window.location.origin}?code=${address.toLowerCase().slice(0, 10)}...${address.toLowerCase().slice(-8)}`}
              </div>
              <button
                onClick={copyReferralLink}
                className="px-4 py-2 bg-primary/20 text-primary rounded-btn hover:bg-primary/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </Card>
        )}
      </section>

      {/* 推荐列表 */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-6">推荐列表</h2>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 text-sm text-text-primary">钱包地址</th>
                  <th className="text-right py-4 text-sm text-text-primary">团队业绩</th>
                  <th className="text-right py-4 text-sm text-text-primary">个人业绩</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center">
                      <span className="text-text-muted">加载中...</span>
                    </td>
                  </tr>
                ) : referralList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <svg className="w-24 h-24 text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-3 5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-base text-text-muted">No data</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  referralList.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-4 text-text-primary font-mono text-sm">
                        {formatAddress(item.address)}
                      </td>
                      <td className="py-4 text-right text-text-primary text-sm">
                        {item.teamPerformance}
                      </td>
                      <td className="py-4 text-right text-text-primary text-sm">
                        {item.personalPerformance}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
};
