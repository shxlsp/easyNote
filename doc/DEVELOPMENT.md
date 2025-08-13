# EasyNote 研发使用说明文档

## 项目概述

EasyNote 是一款基于 Electron + React + TypeScript 技术栈开发的跨平台桌面笔记应用。项目采用现代化的前端开发架构，支持富文本编辑、本地数据存储、多窗口管理等功能。

## 技术栈

### 核心技术
- **Electron**: 跨平台桌面应用框架
- **React 18**: 前端UI框架
- **TypeScript**: 类型安全的JavaScript超集
- **Webpack 5**: 模块打包工具
- **Better-SQLite3**: 本地数据库存储

### UI与样式
- **Ant Design**: UI组件库
- **Styled-Components**: CSS-in-JS样式解决方案
- **Less**: CSS预处理器

### 富文本编辑
- **Slate.js**: 可定制的富文本编辑器框架
- **Slate-React**: Slate的React绑定
- **Slate-History**: 编辑历史管理

### 工具库
- **Lodash-ES**: 实用工具库
- **Axios**: HTTP客户端
- **NanoID**: 唯一ID生成器
- **EventEmitter3**: 事件管理
- **Electron-Store**: 配置存储

## 项目结构

```
EasyNote/
├── src/                          # 源代码目录
│   ├── main/                     # Electron主进程代码
│   │   ├── index.ts             # 主进程入口文件
│   │   ├── menu.ts              # 应用菜单配置
│   │   ├── tray.ts              # 系统托盘管理
│   │   ├── controller/          # 控制器层
│   │   ├── model/               # 数据模型层
│   │   │   ├── broswerWindow/   # 窗口管理
│   │   │   ├── userInfo/        # 用户信息管理
│   │   │   └── store.ts         # 数据存储
│   │   ├── service/             # 服务层
│   │   │   ├── database.ts      # 数据库服务
│   │   │   ├── token.ts         # 令牌管理
│   │   │   └── easyNoteWinPosition.ts # 窗口位置管理
│   │   ├── preloads/            # 预加载脚本
│   │   ├── types/               # 类型定义
│   │   └── utils/               # 工具函数
│   ├── easyNote/                # 主应用渲染进程
│   │   ├── index.html           # HTML模板
│   │   ├── index.tsx            # 渲染进程入口
│   │   └── src/                 # 渲染进程源码
│   │       ├── component/       # React组件
│   │       │   ├── MainPage/    # 主页面组件
│   │       │   ├── List/        # 笔记列表组件
│   │       │   ├── Detail/      # 笔记详情组件
│   │       │   ├── FloatingWindow/ # 浮动窗口组件
│   │       │   └── SlateRenderer/  # 富文本渲染器
│   │       ├── hooks/           # 自定义Hooks
│   │       └── utils/           # 工具函数
│   ├── sqliteWeb/               # SQLite Web管理界面
│   ├── common/                  # 公共代码
│   │   ├── types/               # 公共类型定义
│   │   ├── events/              # 事件定义
│   │   └── utils/               # 公共工具
├── webpack/                      # Webpack配置
│   ├── webpack.config.electron.js # Electron主进程构建配置
│   ├── webpack.config.react.js    # React渲染进程构建配置
│   └── utils/                      # 构建工具
├── scripts/                      # 构建脚本
├── resources/                    # 资源文件
├── test/                         # 测试文件
├── doc/                          # 文档目录
└── dist/                         # 构建输出目录
```

## 开发环境搭建

### 系统要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0
- Python 3.x (用于编译native模块)

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd EasyNote

# 安装依赖
npm install
# 或
yarn install

# 重建native模块 (如果需要)
npm run rebuild
```

### 开发模式启动

```bash
# 启动开发模式 (同时启动Webpack和Electron)
npm run startWebpack

# 在另一个终端启动Electron
npm run startElectron
```

### 单独启动各个模块

```bash
# 只启动React渲染进程开发服务器
npm run webpackDevReact

# 只启动Electron主进程构建
npm run webpackDevElectron
```

## 构建与打包

### 开发构建
```bash
# 构建所有模块
npm run buildWebpack

# 单独构建React渲染进程
npm run webpackBuildReact

# 单独构建Electron主进程
npm run webpackBuildElectron
```

### 生产打包
```bash
# 构建并打包所有平台
npm run build

# 只打包macOS
npm run buildMac

# 只打包Windows
npm run packageWin

# 只打包macOS
npm run packageMac
```

## 核心架构说明

### 主进程架构 (Main Process)

主进程采用分层架构设计：

1. **Controller层**: 处理IPC通信和业务逻辑调度
2. **Service层**: 提供具体的业务服务实现
3. **Model层**: 数据模型和窗口管理
4. **Utils层**: 工具函数和辅助方法

### 渲染进程架构 (Renderer Process)

渲染进程使用React组件化架构：

1. **组件层**: 可复用的UI组件
2. **Hooks层**: 自定义业务逻辑钩子
3. **Utils层**: 前端工具函数

### 进程间通信 (IPC)

项目使用Electron的IPC机制进行主进程和渲染进程间的通信：

- **主进程 → 渲染进程**: 通过`webContents.send()`发送消息
- **渲染进程 → 主进程**: 通过`ipcRenderer.invoke()`调用主进程方法
- **预加载脚本**: 提供安全的API桥接

### 数据存储

- **SQLite数据库**: 使用better-sqlite3存储笔记数据
- **Electron-Store**: 存储应用配置和用户偏好
- **本地文件系统**: 存储附件和临时文件

## 开发规范

### 代码规范

项目使用ESLint + Prettier进行代码规范检查：

```bash
# 运行代码检查
npm run lint

# TypeScript类型检查
npm run ts
```

### Git提交规范

项目使用Husky进行Git钩子管理，提交前会自动运行代码检查。

### 文件命名规范

- **组件文件**: 使用PascalCase，如`MainPage.tsx`
- **工具文件**: 使用camelCase，如`windowUtils.ts`
- **类型文件**: 使用camelCase，如`userInfo.ts`
- **常量文件**: 使用camelCase，如`constant.js`

### 组件开发规范

1. **函数组件**: 优先使用函数组件和Hooks
2. **TypeScript**: 所有组件必须有完整的类型定义
3. **样式隔离**: 使用styled-components进行样式管理
4. **状态管理**: 使用React Hooks进行状态管理

## 调试指南

### 主进程调试

```bash
# 启动带调试的Electron
npm run startElectron -- --inspect=9229
```

然后在Chrome中打开`chrome://inspect`进行调试。

### 渲染进程调试

在Electron应用中按`F12`打开开发者工具，或在代码中使用：

```javascript
// 打开开发者工具
webContents.openDevTools();
```

### 日志系统

项目内置了日志系统，位于`src/main/utils/log.ts`：

```typescript
import { log } from '@/main/utils/log';

log.info('信息日志');
log.error('错误日志');
log.debug('调试日志');
```

## 常见问题解决

### 1. Native模块编译失败

```bash
# 重新编译native模块
npm run rebuild

# 或者清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

### 2. Electron启动失败

检查是否正确构建了主进程代码：

```bash
npm run webpackBuildElectron
npm run startElectron
```

### 3. 数据库连接问题

确保better-sqlite3正确安装和编译：

```bash
npm rebuild better-sqlite3
```

### 4. 热重载不工作

确保webpack-dev-server正常运行：

```bash
npm run webpackDevReact
```

## 性能优化建议

### 1. 构建优化
- 使用webpack的代码分割功能
- 启用Tree Shaking去除未使用代码
- 使用生产模式构建

### 2. 运行时优化
- 合理使用React.memo避免不必要的重渲染
- 使用useMemo和useCallback优化计算和函数
- 避免在渲染函数中创建新对象

### 3. 内存管理
- 及时清理事件监听器
- 避免内存泄漏
- 合理管理窗口生命周期

## 扩展开发

### 添加新功能

1. **主进程功能**: 在`src/main/controller`中添加新的控制器
2. **渲染进程功能**: 在`src/easyNote/src/component`中添加新组件
3. **IPC通信**: 在`src/common/events`中定义新的事件类型

### 添加新窗口

1. 在`src/main/model/broswerWindow`中创建新的窗口类
2. 在`src`目录下创建对应的渲染进程代码
3. 更新webpack配置添加新的入口点

### 数据库扩展

1. 在`src/main/service/database.ts`中添加新的数据表操作
2. 在`src/common/types`中定义相应的类型
3. 更新相关的业务逻辑

## 版本管理

项目使用语义化版本控制：

```bash
# 更新版本号
npm run version
```

版本管理脚本位于`scripts/version-manager.js`。

## 测试

```bash
# 运行测试
npm test

# API测试
node test/api-test.js
```

## 部署发布

### 构建发布版本

```bash
# 完整构建和打包
npm run build
```

### 发布检查清单

- [ ] 代码通过所有测试
- [ ] 版本号已更新
- [ ] 更新日志已完善
- [ ] 构建无错误和警告
- [ ] 在目标平台测试通过

## 贡献指南

1. Fork项目到个人仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -am 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 创建Pull Request

## 技术支持

如遇到开发问题，请：

1. 查看本文档的常见问题部分
2. 检查项目的Issue列表
3. 创建新的Issue描述问题

---

**Happy Coding! 🚀**