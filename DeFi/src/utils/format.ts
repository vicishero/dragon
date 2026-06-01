/**
 * 格式化钱包地址，显示前6位和后4位
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * 格式化数字，添加千位分隔符
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
