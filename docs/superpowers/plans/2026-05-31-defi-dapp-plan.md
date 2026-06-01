# DeFi DApp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零开始构建一个完整的 React DeFi DApp 应用，包含钱包连接、多语言支持、移动端适配等功能。

**Architecture:** 使用 Vite + React + TypeScript + TailwindCSS 构建，采用组件化设计，三栏布局（Header + Content + Footer），通过 Context 管理全局状态。

**Tech Stack:** Vite 5.x, React 18.x, TypeScript, TailwindCSS 3.x, React Router v6, Web3Modal v3, Wagmi v2, i18next

---

## 文件结构总览

### 要创建的文件

**配置文件：**
- `DeFi/package.json` - 项目依赖配置
- `DeFi/tsconfig.json` - TypeScript 配置
- `DeFi/vite.config.ts` - Vite 配置
- `DeFi/tailwind.config.js` - TailwindCSS 配置
- `DeFi/postcss.config.js` - PostCSS 配置
- `DeFi/index.html` - 入口 HTML

**源代码：**
- `DeFi/src/main.tsx` - 应用入口
- `DeFi/src/App.tsx` - 主应用组件
- `DeFi/src/index.css` - 全局样式
- `DeFi/src/providers/WalletProvider.tsx` - 钱包状态管理
- `DeFi/src/providers/LanguageProvider.tsx` - 语言状态管理
- `DeFi/src/hooks/useWallet.ts` - 钱包 Hook
- `DeFi/src/hooks/useLanguage.ts` - 语言 Hook
- `DeFi/src/components/layout/Header.tsx` - 顶部导航
- `DeFi/src/components/layout/Footer.tsx` - 底部导航
- `DeFi/src/components/layout/Layout.tsx` - 整体布局
- `DeFi/src/components/common/Button.tsx` - 通用按钮
- `DeFi/src/components/common/Card.tsx` - 通用卡片
- `DeFi/src/components/wallet/WalletConnect.tsx` - 钱包连接组件
- `DeFi/src/pages/Home.tsx` - 首页
- `DeFi/src/pages/Team.tsx` - 团队页面
- `DeFi/src/pages/Ecology.tsx` - 生态页面
- `DeFi/src/locales/zh.json` - 中文语言包
- `DeFi/src/locales/en.json` - 英文语言包
- `DeFi/src/utils/format.ts` - 格式化工具

---

## 任务分解

### Task 1: 初始化 Vite + React + TypeScript 项目

**Files:**
- Create: `DeFi/package.json`
- Create: `DeFi/tsconfig.json`
- Create: `DeFi/vite.config.ts`
- Create: `DeFi/index.html`
- Create: `DeFi/src/main.tsx`
- Create: `DeFi/src/App.tsx`
- Create: `DeFi/src/index.css`

- [ ] **Step 1: 创建项目目录结构**

```bash
cd /home/v3/workspace/dragon
mkdir -p DeFi/src/{components/{layout,common,wallet},pages,hooks,providers,locales,utils,assets}
mkdir -p DeFi/public/{images,icons}
```

- [ ] **Step 2: 创建 package.json**

```json
{
  "name": "defi-dapp",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "i18next": "^23.7.0",
    "react-i18next": "^14.0.0",
    "@web3modal/wagmi": "^4.0.0",
    "wagmi": "^2.5.0",
    "viem": "^2.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

- [ ] **Step 6: 创建 index.html**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>DeFi DApp</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: 创建 index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #0d1117;
  color: #f9fafb;
  min-height: 100vh;
}

/* 移动端固定宽度容器 */
.app-container {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #0d1117 0%, #1a1f2e 100%);
  position: relative;
}

/* 毛玻璃效果 */
.glass {
  background: rgba(22, 27, 34, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 渐变按钮 */
.btn-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.btn-gradient:hover {
  background: linear-gradient(135deg, #7c7ff2 0%, #a070f7 100%);
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.pulse {
  animation: pulse 2s infinite;
}
```

- [ ] **Step 8: 创建 main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 9: 创建初始 App.tsx**

```typescript
function App() {
  return (
    <div className="app-container">
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">DeFi DApp</h1>
        <p className="text-gray-400">项目初始化中...</p>
      </div>
    </div>
  )
}

export default App
```

- [ ] **Step 10: 提交代码**

```bash
cd /home/v3/workspace/dragon/DeFi
git init
git add .
git commit -m "feat: initialize Vite + React + TypeScript project"
```

---

### Task 2: 配置 TailwindCSS

**Files:**
- Create: `DeFi/tailwind.config.js`
- Create: `DeFi/postcss.config.js`
- Modify: `DeFi/src/index.css` (already created in Task 1)

- [ ] **Step 1: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0d1117',
        'bg-secondary': '#161b22',
        'bg-card': 'rgba(22, 27, 34, 0.8)',
        'primary': '#6366f1',
        'secondary': '#8b5cf6',
        'accent': '#06b6d4',
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'text-primary': '#f9fafb',
        'text-secondary': '#d1d5db',
        'text-muted': '#9ca3af',
      },
      borderRadius: {
        'btn': '12px',
        'card': '16px',
        'input': '10px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'btn': '0 4px 15px rgba(99, 102, 241, 0.4)',
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: 创建 postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: 提交代码**

```bash
cd /home/v3/workspace/dragon/DeFi
git add tailwind.config.js postcss.config.js
git commit -m "feat: configure TailwindCSS"
```

---

### Task 3: 设置多语言支持（i18next）

**Files:**
- Create: `DeFi/src/locales/zh.json`
- Create: `DeFi/src/locales/en.json`
- Create: `DeFi/src/providers/LanguageProvider.tsx`
- Create: `DeFi/src/hooks/useLanguage.ts`
- Modify: `DeFi/src/main.tsx`

- [ ] **Step 1: 创建中文语言包 zh.json**

```json
{
  "common": {
    "appName": "DeFi",
    "connectWallet": "连接钱包",
    "disconnect": "断开连接",
    "language": "语言",
    "chinese": "中文",
    "english": "English"
  },
  "nav": {
    "home": "首页",
    "team": "团队",
    "ecology": "生态"
  },
  "home": {
    "heroTitle": "DeFi 去中心化金融平台",
    "heroSubtitle": "安全、高效、透明的去中心化金融服务",
    "getStarted": "开始使用",
    "tvl": "总锁仓量",
    "users": "用户数",
    "volume": "交易额",
    "assets": "支持币种",
    "featuresTitle": "核心功能",
    "features": {
      "swap": {
        "title": "去中心化交易",
        "desc": "快速安全的代币兑换服务"
      },
      "earn": {
        "title": "收益挖矿",
        "desc": "质押资产获取高收益"
      },
      "lend": {
        "title": "质押借贷",
        "desc": "灵活的借贷市场"
      },
      "liquidity": {
        "title": "流动性挖矿",
        "desc": "提供流动性赚取手续费"
      }
    },
    "partners": "合作伙伴"
  },
  "team": {
    "title": "我们的团队",
    "subtitle": "由业界顶尖专家组成的专业团队",
    "advisors": "顾问团队",
    "members": [
      {
        "name": "张三",
        "role": "创始人 & CEO",
        "bio": "10年区块链行业经验，前以太坊核心开发者"
      },
      {
        "name": "李四",
        "role": "技术总监",
        "bio": "全栈工程师，专注于 DeFi 协议开发"
      },
      {
        "name": "王五",
        "role": "产品经理",
        "bio": "5年 DeFi 产品设计经验"
      },
      {
        "name": "赵六",
        "role": "运营总监",
        "bio": "社区建设和市场推广专家"
      }
    ]
  },
  "ecology": {
    "title": "DeFi 生态系统",
    "subtitle": "构建完整的去中心化金融生态",
    "apps": {
      "dex": {
        "title": "DEX 交易所",
        "desc": "去中心化代币交易平台"
      },
      "lending": {
        "title": "借贷协议",
        "desc": "去中心化借贷市场"
      },
      "nft": {
        "title": "NFT 市场",
        "desc": "数字艺术品交易平台"
      },
      "governance": {
        "title": "DAO 治理",
        "desc": "社区自治和投票系统"
      }
    },
    "roadmap": "发展路线图",
    "community": "加入社区"
  }
}
```

- [ ] **Step 2: 创建英文语言包 en.json**

```json
{
  "common": {
    "appName": "DeFi",
    "connectWallet": "Connect Wallet",
    "disconnect": "Disconnect",
    "language": "Language",
    "chinese": "中文",
    "english": "English"
  },
  "nav": {
    "home": "Home",
    "team": "Team",
    "ecology": "Ecology"
  },
  "home": {
    "heroTitle": "DeFi Decentralized Finance Platform",
    "heroSubtitle": "Secure, efficient, and transparent decentralized financial services",
    "getStarted": "Get Started",
    "tvl": "Total Value Locked",
    "users": "Users",
    "volume": "Trading Volume",
    "assets": "Assets",
    "featuresTitle": "Core Features",
    "features": {
      "swap": {
        "title": "Decentralized Swap",
        "desc": "Fast and secure token exchange"
      },
      "earn": {
        "title": "Yield Farming",
        "desc": "Stake assets for high returns"
      },
      "lend": {
        "title": "Staking & Lending",
        "desc": "Flexible lending market"
      },
      "liquidity": {
        "title": "Liquidity Mining",
        "desc": "Provide liquidity to earn fees"
      }
    },
    "partners": "Partners"
  },
  "team": {
    "title": "Our Team",
    "subtitle": "Professional team composed of industry experts",
    "advisors": "Advisors",
    "members": [
      {
        "name": "Zhang San",
        "role": "Founder & CEO",
        "bio": "10 years blockchain experience, former Ethereum core developer"
      },
      {
        "name": "Li Si",
        "role": "CTO",
        "bio": "Full-stack engineer, focused on DeFi protocol development"
      },
      {
        "name": "Wang Wu",
        "role": "Product Manager",
        "bio": "5 years DeFi product design experience"
      },
      {
        "name": "Zhao Liu",
        "role": "Operations Director",
        "bio": "Community building and marketing expert"
      }
    ]
  },
  "ecology": {
    "title": "DeFi Ecosystem",
    "subtitle": "Building a complete decentralized finance ecosystem",
    "apps": {
      "dex": {
        "title": "DEX Exchange",
        "desc": "Decentralized token trading platform"
      },
      "lending": {
        "title": "Lending Protocol",
        "desc": "Decentralized lending market"
      },
      "nft": {
        "title": "NFT Market",
        "desc": "Digital art trading platform"
      },
      "governance": {
        "title": "DAO Governance",
        "desc": "Community governance and voting system"
      }
    },
    "roadmap": "Roadmap",
    "community": "Join Community"
  }
}
```

- [ ] **Step 3: 创建 LanguageProvider.tsx**

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from '../locales/zh.json';
import en from '../locales/en.json';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 初始化 i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  });

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'zh';
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

- [ ] **Step 4: 创建 useLanguage.ts hook（简化版，实际在 Provider 中）**

```typescript
// 这个文件作为导出别名，实际 Hook 在 LanguageProvider 中定义
export { useLanguage } from '../providers/LanguageProvider';
```

- [ ] **Step 5: 修改 main.tsx 集成 LanguageProvider**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './providers/LanguageProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)
```

- [ ] **Step 6: 提交代码**

```bash
cd /home/v3/workspace/dragon/DeFi
git add src/locales/zh.json src/locales/en.json src/providers/LanguageProvider.tsx src/hooks/useLanguage.ts src/main.tsx
git commit -m "feat: setup i18next multi-language support"
```

---

### Task 4: 配置 Web3Modal + Wagmi 钱包连接

**Files:**
- Create: `DeFi/src/providers/WalletProvider.tsx`
- Create: `DeFi/src/hooks/useWallet.ts`
- Create: `DeFi/src/utils/format.ts`
- Modify: `DeFi/src/main.tsx`

- [ ] **Step 1: 创建 format.ts 工具函数**

```typescript
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
```

- [ ] **Step 2: 创建 WalletProvider.tsx**

```typescript
import React, { createContext, useContext, ReactNode } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider, useAccount, useDisconnect } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// WalletConnect Project ID - 可以在 https://cloud.walletconnect.com 获取
// 这里使用一个演示 ID，生产环境请替换
const projectId = 'a4b910f4f96e1a3e3b9e6a3f4a5b6c7d';

const metadata = {
  name: 'DeFi DApp',
  description: 'DeFi Decentralized Finance Platform',
  url: 'https://defi-dapp.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [mainnet, arbitrum, polygon] as const;

const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
});

const queryClient = new QueryClient();

interface WalletContextType {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  disconnect: () => void;
  openWalletModal: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderInnerProps {
  children: ReactNode;
}

const WalletProviderInner: React.FC<WalletProviderInnerProps> = ({ children }) => {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  const openWalletModal = () => {
    // Web3Modal 会自动处理
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        isDisconnected,
        disconnect,
        openWalletModal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProviderInner>{children}</WalletProviderInner>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// 导出 openWeb3Modal 函数
export const openWeb3Modal = () => {
  // @ts-ignore - Web3Modal 全局方法
  if (window?.$modal?.open) {
    // @ts-ignore
    window.$modal.open();
  }
};
```

- [ ] **Step 3: 创建 useWallet.ts hook（导出别名）**

```typescript
// 这个文件作为导出别名，实际 Hook 在 WalletProvider 中定义
export { useWallet, openWeb3Modal } from '../providers/WalletProvider';
```

- [ ] **Step 4: 修改 main.tsx 集成 WalletProvider**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './providers/LanguageProvider'
import { WalletProvider } from './providers/WalletProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <WalletProvider>
        <App />
      </WalletProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
```

- [ ] **Step 5: 修改 package.json 添加缺失的依赖**

```json
{
  "name": "defi-dapp",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "i18next": "^23.7.0",
    "react-i18next": "^14.0.0",
    "@web3modal/wagmi": "^4.0.0",
    "wagmi": "^2.5.0",
    "viem": "^2.7.0",
    "@tanstack/react-query": "^5.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

- [ ] **Step 6: 提交代码**

```bash
cd /home/v3/workspace/dragon/DeFi
git add src/utils/format.ts src/providers/WalletProvider.tsx src/hooks/useWallet.ts src/main.tsx package.json
git commit -m "feat: configure Web3Modal + Wagmi wallet connection"
```

---

### Task 5: 创建通用组件（Button、Card）

**Files:**
- Create: `DeFi/src/components/common/Button.tsx`
- Create: `DeFi/src/components/common/Card.tsx`

- [ ] **Step 1: 创建 Button.tsx**

```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-btn font-medium transition-all duration-200 active:scale-[0.98]';

  const variantClasses = {
    primary: 'btn-gradient text-white shadow-btn hover:shadow-lg hover:scale-[1.02]',
    secondary: 'bg-bg-secondary text-text-primary border border-gray-700 hover:border-gray-500',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

- [ ] **Step 2: 创建 Card.tsx**

```typescript
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  const baseClasses = 'bg-bg-card rounded-card border border-gray-800 shadow-card p-6';
  const hoverClasses = hover ? 'transition-all duration-200 hover:border-gray-600 hover:shadow-lg hover:-translate-y-1' : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};
```

- [ ] **Step 3: 提交代码**

```bash
cd /home/v3/workspace/dragon/DeFi
git add src/components/common/Button.tsx src/components/common/Card.tsx
git commit -m "feat: create common Button and Card components"
```

---

### Task 6: 创建布局组件（Header、Footer、Layout）

**Files:**
- Create: `DeFi/src/components/layout/Header.tsx`
- Create: `DeFi/src/components/layout/Footer.tsx`
- Create: `DeFi/src/components/layout/Layout.tsx`
- Create: `DeFi/src/components/wallet/WalletConnect.tsx`

- [ ] **Step 1: 创建 WalletConnect.tsx**

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWallet, openWeb3Modal } from '../../hooks/useWallet';
import { formatAddress } from '../../utils/format';
import { Button } from '../common/Button';

export const WalletConnect: React.FC = () => {
  const { t } = useTranslation();
  const { address, isConnected, disconnect } = useWallet();

  const handleConnect = () => {
    openWeb3Modal();
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
```

- [ ] **Step 2: 创建 Header.tsx**

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import { WalletConnect } from '../wallet/WalletConnect';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[430px] mx-auto">
        <div className="glass border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-lg font-bold text-text-primary">{t('common.appName')}</span>
          </div>

          {/* Language Toggle & Wallet */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors border border-gray-700 rounded-btn hover:border-gray-500"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>

            {/* Wallet Connect */}
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
};
```

- [ ] **Step 3: 创建 Footer.tsx**

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  key: string;
  path: string;
  label: string;
  icon: React.ReactNode;
}

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      key: 'home',
      path: '/home',
      label: t('nav.home'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      key: 'team',
      path: '/team',
      label: t('nav.team'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      key: 'ecology',
      path: '/ecology',
      label: t('nav.ecology'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-[430px] mx-auto">
        <div className="glass border-t border-gray-800 px-2 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-0.5"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
};
```

- [ ] **Step 4: 创建 Layout.tsx**

```typescript
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container min-h-screen">
      <Header />
      <main className="pt-[70px] pb-[90px] px-4 fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};
```

- [ ] **Step 5: 提交代码**

```bash
cd /home/v3/workspace/dragon/DeFi
git add src/components/wallet/WalletConnect.tsx src/components/layout/Header.tsx src/components/layout/Footer.tsx src/components/layout/Layout.tsx
git commit -m "feat: create layout components (Header, Footer, Layout)"
```

---

### Task 7: 创建页面组件（Home、Team、Ecology）

**Files:**
- Create: `DeFi/src/pages/Home.tsx`
- Create: `DeFi/src/pages/Team.tsx`
- Create: `DeFi/src/pages/Ecology.tsx`

- [ ] **Step 1: 创建 Home.tsx**

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { openWeb3Modal } from '../hooks/useWallet';

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <Card className="text-center">
    <div className="text-accent mb-2">{icon}</div>
    <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
    <div className="text-sm text-text-muted">{label}</div>
  </Card>
);

const FeatureCard: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({
  title,
  desc,
  icon,
}) => (
  <Card>
    <div className="w-12 h-12 rounded-lg btn-gradient flex items-center justify-center mb-4">
      <span className="text-white text-xl">{icon}</span>
    </div>
    <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
    <p className="text-text-muted text-sm">{desc}</p>
  </Card>
);

export const Home: React.FC = () => {
  const { t } = useTranslation();

  const handleGetStarted = () => {
    openWeb3Modal();
  };

  const stats = [
    { label: t('home.tvl'), value: '$1.2B', icon: '💰' },
    { label: t('home.users'), value: '125K', icon: '👥' },
    { label: t('home.volume'), value: '$5.8B', icon: '📊' },
    { label: t('home.assets'), value: '50+', icon: '💎' },
  ];

  const features = [
    {
      title: t('home.features.swap.title'),
      desc: t('home.features.swap.desc'),
      icon: '🔄',
    },
    {
      title: t('home.features.earn.title'),
      desc: t('home.features.earn.desc'),
      icon: '🌾',
    },
    {
      title: t('home.features.lend.title'),
      desc: t('home.features.lend.desc'),
      icon: '💵',
    },
    {
      title: t('home.features.liquidity.title'),
      desc: t('home.features.liquidity.desc'),
      icon: '🌊',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="relative">
          {/* Decorative gradient circles */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-4 relative">
          {t('home.heroTitle')}
        </h1>
        <p className="text-text-muted mb-8 max-w-sm mx-auto relative">
          {t('home.heroSubtitle')}
        </p>

        <Button onClick={handleGetStarted} size="lg" className="relative">
          {t('home.getStarted')}
        </Button>
      </div>

      {/* Stats Section */}
      <section>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-6">{t('home.featuresTitle')}</h2>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-6">{t('home.partners')}</h2>
        <Card>
          <div className="grid grid-cols-3 gap-4">
            {['Partner A', 'Partner B', 'Partner C', 'Partner D', 'Partner E', 'Partner F'].map((partner, index) => (
              <div key={index} className="bg-bg-secondary rounded-lg p-4 text-center">
                <div className="text-text-muted text-sm">{partner}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
```

- [ ] **Step 2: 创建 Team.tsx**

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/common/Card';

const TeamMemberCard: React.FC<{ name: string; role: string; bio: string }> = ({
  name,
  role,
  bio,
}) => (
  <Card>
    <div className="flex flex-col items-center text-center">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
        <span className="text-2xl text-white font-bold">{name.charAt(0)}</span>
      </div>

      {/* Name & Role */}
      <h3 className="text-lg font-semibold text-text-primary">{name}</h3>
      <p className="text-primary text-sm mb-3">{role}</p>
      <p className="text-text-muted text-sm">{bio}</p>

      {/* Social Links */}
      <div className="flex gap-3 mt-4">
        <button className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </button>
      </div>
    </div>
  </Card>
);

export const Team: React.FC = () => {
  const { t } = useTranslation();

  const teamMembers = t('team.members', { returnObjects: true }) as Array<{
    name: string;
    role: string;
    bio: string;
  }>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-text-primary mb-2">{t('team.title')}</h1>
        <p className="text-text-muted">{t('team.subtitle')}</p>
      </div>

      {/* Team Members */}
      <section>
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} {...member} />
          ))}
        </div>
      </section>

      {/* Advisors */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-6">{t('team.advisors')}</h2>
        <Card>
          <div className="text-center text-text-muted py-8">
            <p>Coming Soon...</p>
          </div>
        </Card>
      </section>
    </div>
  );
};
```

- [ ] **Step 3: 创建 Ecology.tsx**

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const EcoAppCard: React.FC<{ title: string; desc: string; icon: string }> = ({
  title,
  desc,
  icon,
}) => (
  <Card>
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shrink-0">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
        <p className="text-text-muted text-sm mb-3">{desc}</p>
        <Button variant="outline" size="sm">
          Explore
        </Button>
      </div>
    </div>
  </Card>
);

const RoadmapItem: React.FC<{ phase: string; title: string; items: string[]; active?: boolean }> = ({
  phase,
  title,
  items,
  active = false,
}) => (
  <div className={`relative pl-8 pb-8 border-l-2 ${active ? 'border-primary' : 'border-gray-700'}`}>
    <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${active ? 'bg-primary' : 'bg-gray-700'}`}></div>
    <div className="mb-2">
      <span className={`text-xs font-semibold px-2 py-1 rounded ${active ? 'bg-primary/20 text-primary' : 'bg-bg-secondary text-text-muted'}`}>
        {phase}
      </span>
    </div>
    <h3 className="text-lg font-semibold text-text-primary mb-3">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-text-muted text-sm flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary' : 'bg-gray-600'}`}></span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export const Ecology: React.FC = () => {
  const { t } = useTranslation();

  const ecoApps = [
    {
      title: t('ecology.apps.dex.title'),
      desc: t('ecology.apps.dex.desc'),
      icon: '🔄',
    },
    {
      title: t('ecology.apps.lending.title'),
      desc: t('ecology.apps.lending.desc'),
      icon: '💳',
    },
    {
      title: t('ecology.apps.nft.title'),
      desc: t('ecology.apps.nft.desc'),
      icon: '🎨',
    },
    {
      title: t('ecology.apps.governance.title'),
      desc: t('ecology.apps.governance.desc'),
      icon: '🗳️',
    },
  ];

  const roadmap = [
    {
      phase: 'Phase 1',
      title: 'Foundation',
      items: ['DApp Launch', 'Core Features', 'Security Audit'],
      active: true,
    },
    {
      phase: 'Phase 2',
      title: 'Expansion',
      items: ['Lending Protocol', 'NFT Market', 'Governance'],
      active: false,
    },
    {
      phase: 'Phase 3',
      title: 'Ecosystem',
      items: ['Cross-chain', 'Partnerships', 'Community Grants'],
      active: false,
    },
  ];

  const socialLinks = [
    { name: 'Discord', icon: '💬' },
    { name: 'Twitter', icon: '🐦' },
    { name: 'Telegram', icon: '✉️' },
    { name: 'GitHub', icon: '💻' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-text-primary mb-2">{t('ecology.title')}</h1>
        <p className="text-text-muted">{t('ecology.subtitle')}</p>
      </div>

      {/* Eco Apps */}
      <section>
        <div className="space-y-4">
          {ecoApps.map((app, index) => (
            <EcoAppCard key={index} {...app} />
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-6">{t('ecology.roadmap')}</h2>
        <Card>
          <div className="pt-4">
            {roadmap.map((item, index) => (
              <RoadmapItem key={index} {...item} />
            ))}
          </div>
        </Card>
      </section>

      {/* Community */}
      <section>
        <h2 className="text-xl font-bold text-text-primary mb-6">{t('ecology.community')}</h2>
        <Card>
          <div className="grid grid-cols-2 gap-3">
            {socialLinks.map((link, index) => (
              <button
                key={index}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-secondary rounded-btn hover:bg-gray-700 transition-colors"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-text-primary">{link.name}</span>
              </button>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
```

- [ ] **Step 4: 提交代码**

```bash
cd /home/v3/workspace/dragon/DeFi
git add src/pages/Home.tsx src/pages/Team.tsx src/pages/Ecology.tsx
git commit -m "feat: create page components (Home, Team, Ecology)"
```

---

### Task 8: 设置 React Router 并集成所有组件

**Files:**
- Modify: `DeFi/src/App.tsx`

- [ ] **Step 1: 更新 App.tsx 集成路由和布局**

```typescript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Team } from './pages/Team';
import { Ecology } from './pages/Ecology';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/ecology" element={<Ecology />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 2: 提交代码**

```bash
cd /home/v3/workspace/dragon/DeFi
git add src/App.tsx
git commit -m "feat: setup React Router and integrate all components"
```

---

### Task 9: 安装依赖并测试项目运行

**Files:**
- 无新文件，测试现有项目

- [ ] **Step 1: 安装项目依赖**

```bash
cd /home/v3/workspace/dragon/DeFi
npm install
```

- [ ] **Step 2: 运行 TypeScript 类型检查**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 尝试构建项目（可选）**

```bash
npm run build
```

- [ ] **Step 4: 创建 .gitignore 文件**

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

- [ ] **Step 5: 最终提交**

```bash
cd /home/v3/workspace/dragon/DeFi
echo -e "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\nnode_modules\ndist\ndist-ssr\n*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?" > .gitignore
git add .gitignore
git commit -m "feat: add .gitignore and complete project setup"
```

---

## 计划完成检查清单

- [x] Task 1 - 项目初始化
- [x] Task 2 - TailwindCSS 配置
- [x] Task 3 - 多语言支持
- [x] Task 4 - 钱包连接配置
- [x] Task 5 - 通用组件
- [x] Task 6 - 布局组件
- [x] Task 7 - 页面组件
- [x] Task 8 - 路由集成
- [x] Task 9 - 安装测试

所有任务已定义完毕，包含完整的代码实现步骤。
