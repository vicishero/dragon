---
name: defi-dapp-design
description: DeFi DApp 完整设计文档
metadata:
  type: project
  date: 2026-05-31
---

# DeFi DApp 设计文档

## 项目概述

从零开发一个基于 React 的 DeFi DApp 应用，采用现代前端技术栈，实现钱包连接、多语言支持、移动端适配等功能。

## 技术选型

### 核心技术栈
- **构建工具：** Vite 5.x
- **框架：** React 18.x + TypeScript
- **样式：** TailwindCSS 3.x + PostCSS + Autoprefixer
- **路由：** React Router v6
- **钱包连接：** Web3Modal v3 + Wagmi v2 + Viem
- **国际化：** i18next + react-i18next
- **状态管理：** React Context + Hooks（轻量级）

### 选择理由
- Vite 提供更快的开发体验和构建速度
- TypeScript 增强代码质量和开发体验
- TailwindCSS 实现快速样式开发
- Web3Modal 是业界标准的多钱包连接方案
- i18next 提供成熟的国际化支持

## 目录结构

```
DeFi/
├── public/                 # 静态资源
│   ├── images/         # 图片资源
│   └── icons/          # 图标资源
├── src/
│   ├── assets/           # 资源文件
│   ├── components/      # 公共组件
│   │   ├── layout/     # 布局组件
│   │   │   ├── Header.tsx       # 顶部导航
│   │   │   ├── Footer.tsx       # 底部导航
│   │   │   └── Layout.tsx       # 整体布局
│   │   ├── common/     # 通用组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   └── wallet/     # 钱包相关组件
│   │       └── WalletConnect.tsx
│   ├── hooks/          # 自定义 Hooks
│   │   ├── useWallet.ts
│   │   └── useLanguage.ts
│   ├── pages/          # 页面组件
│   │   ├── Home.tsx
│   │   ├── Team.tsx
│   │   └── Ecology.tsx
│   ├── locales/        # 语言包
│   │   ├── zh.json
│   │   └── en.json
│   ├── utils/          # 工具函数
│   │   ├── wallet.ts
│   │   └── format.ts
│   ├── providers/      # Context Providers
│   │   ├── WalletProvider.tsx
│   │   └── LanguageProvider.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## UI 视觉设计规范

### 视觉风格
采用现代 DeFi 深色主题风格：

- **背景色：**
  - 主背景：`#0d1117`
  - 次级背景：`#161b22`
  - 卡片背景：`rgba(22, 27, 34, 0.8)`

- **主色调：**
  - 主渐变：`#6366f1 → #8b5cf6`（蓝紫色）
  - 辅助色 1：`#06b6d4`（青色）
  - 辅助色 2：`#10b981`（绿色）
  - 警告色：`#f59e0b`（橙色）
  - 错误色：`#ef4444`（红色）

- **文字颜色：**
  - 主文字：`#f9fafb`（白色）
  - 次级文字：`#d1d5db`（浅灰）
  - 辅助文字：`#9ca3af`（中灰）

### 移动端布局规范
- **最大宽度：** 430px
- **显示方式：** 左右居中，margin: 0 auto
- **背景：** 深色背景，主体容器居中
- **安全区域：** 顶部 padding: 60px，底部 padding: 80px

### 组件风格规范

#### 按钮
- 圆角：12px
- 高度：44px
- 主按钮：渐变背景 + 阴影
- 次要按钮：边框 + 半透明背景
- Hover 效果：轻微放大 + 阴影增强
- 点击效果：缩放 0.98

#### 卡片
- 圆角：16px
- 背景：半透明深色 + 模糊效果
- 边框：1px 半透明白色边框
- 阴影：柔和的深色阴影
- Padding：16-24px

#### 输入框
- 圆角：10px
- 高度：44px
- 背景：深色背景
- 边框：默认浅灰，focus 时主色高亮
- Padding：水平 16px

#### 导航栏
- Header：固定顶部，高度 60px，毛玻璃效果
- Footer：固定底部，高度 70px，毛玻璃效果

## 核心功能设计

### 1. 布局结构（三栏式）

#### Header（顶部导航栏）
布局从左至右：
- **左侧：** Logo 图标 + "DeFi" 文字
- **中间/右侧：** 语言切换下拉选择组件
- **最右侧：** 钱包连接功能区域
  - 未连接：显示"连接钱包"按钮
  - 已连接：显示钱包地址（截断显示），点击可断开

#### Footer（底部导航栏）
- 三个导航入口，均分宽度
- 导航项：首页、团队、生态
- 激活状态：颜色高亮、图标变色、下划线指示
- 固定底部，毛玻璃效果

#### Content（主内容区）
- 路由切换区域
- 顶部留出 Header 空间（padding-top: 70px）
- 底部留出 Footer 空间（padding-bottom: 80px）

### 2. 钱包连接功能

#### 技术实现
- Web3Modal v3 + Wagmi v2 + Viem
- 配置支持 MetaMask、Coinbase Wallet 等主流 EVM 钱包

#### 功能流程
1. 用户点击顶部"连接钱包"按钮
2. 唤起 Web3Modal 钱包选择弹窗
3. 用户选择钱包并授权连接
4. 顶部按钮切换为展示已连接钱包地址
5. 点击钱包地址区域，支持断开钱包连接

#### 基础校验
- 检测钱包是否已安装
- 验证网络为 EVM 兼容链
- 异常情况用户提示

### 3. 多语言功能

#### 技术实现
- i18next + react-i18next
- 语言包独立文件管理

#### 功能特性
- 支持中文/英文两套语言包
- 顶部导航栏语言切换组件
- 语言选择状态 localStorage 持久化
- 刷新页面不重置语言选择
- 所有静态文案通过 t() 函数从语言包获取

### 4. 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/home` | Home | 首页 |
| `/team` | Team | 团队页面 |
| `/ecology` | Ecology | 生态页面 |
| `*` | 重定向到 /home | 默认路由 |

## 页面内容设计

### 首页（Home）

#### 1. Hero 区域
- 大标题："DeFi 去中心化金融平台"
- 副标题：简洁的平台介绍
- CTA 按钮："开始使用"或"连接钱包"
- 背景：渐变装饰元素

#### 2. 数据统计卡片（4个）
- TVL（总锁仓量）：$XXXM
- 用户数：XXXK
- 交易额：$XXXM
- 支持币种：XX+

#### 3. 功能特点卡片（4个）
- 去中心化交易
- 收益挖矿
- 质押借贷
- 流动性挖矿
- 每个卡片包含：图标、标题、描述

#### 4. 合作伙伴区域
- 支持的项目/合作伙伴 Logo 展示

### 团队页面（Team）

#### 1. 页面标题
- "我们的团队"
- 团队介绍描述

#### 2. 团队成员卡片（网格布局 2x2）
每个成员卡片包含：
- 头像（圆形）
- 姓名
- 职位
- 简介
- 社交媒体链接（GitHub、Twitter、LinkedIn）

#### 3. 顾问团队
- 顾问介绍区域

### 生态页面（Ecology）

#### 1. 页面标题
- "DeFi 生态系统"
- 生态介绍描述

#### 2. 生态应用卡片（网格布局）
- DEX（去中心化交易所）
- Lending（借贷协议）
- NFT Market（NFT 市场）
- Governance（治理）
- 每个卡片包含：图标、标题、描述、链接按钮

#### 3. 路线图时间线
- 发展历程时间轴展示

#### 4. 社区链接
- Discord、Twitter、Telegram、GitHub 链接

## 交互效果规范

### 页面切换
- 路由切换时淡入淡出效果
- 底部导航项切换时平滑过渡

### 按钮交互
- Hover：轻微放大（scale 1.02）+ 阴影增强
- 点击：缩放（scale 0.98）
- 禁用状态：透明度降低，不可点击

### 卡片交互
- Hover：轻微上浮 + 阴影增强 + 边框高亮

### 滚动
- 平滑滚动效果
- 内容区域可正常滚动
- 固定 Header 和 Footer 不随内容滚动

### 动画
- 渐入动画：页面加载时元素渐入
- 滑动动画：卡片从下方滑入
- 悬停动画：细腻的状态过渡

## 数据流设计

### Wallet Context
- 管理钱包连接状态
- 提供钱包地址、连接状态、连接/断开方法
- 持久化连接状态到 localStorage

### Language Context
- 管理当前语言选择
- 提供切换语言方法
- 持久化语言选择到 localStorage

## 错误处理

### 钱包连接错误
- 钱包未安装提示
- 用户拒绝连接提示
- 网络不匹配提示
- 友好的错误信息展示

### 通用错误
- 网络异常提示
- 操作失败提示

## 开发规范

### 代码规范
- 使用 TypeScript 类型定义
- 变量命名语义化
- 关键逻辑增加中文注释
- ESLint + Prettier 代码格式化

### Git 提交规范
- feat: 新功能
- fix: 修复
- style: 样式调整
- refactor: 重构
- docs: 文档

### 组件编写规范
- 函数组件 + Hooks
- 组件属性使用 TypeScript interface 定义
- 样式使用 TailwindCSS 类名
- 内部状态使用 useState/useReducer

## 成功标准

- [ ] 项目可正常 npm install 安装依赖
- [ ] 项目可正常 npm run dev 启动开发服务器
- [ ] 项目可正常 npm run build 构建生产版本
- [ ] 三个页面路由正常切换
- [ ] 顶部导航和底部导航正常显示和交互
- [ ] 钱包连接功能正常工作
- [ ] 多语言切换功能正常工作
- [ ] 移动端布局正确，PC 端居中显示
- [ ] 所有交互效果正常
- [ ] 无控制台报错

