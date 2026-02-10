# 五子棋游戏 (Gomoku Game)

一个基于 Node.js 的 Web 版五子棋游戏，支持人机对战。

## 功能特点

- 15x15 标准五子棋棋盘
- 人机对战模式
- 智能 AI 对手
- 悔棋功能
- 重新开始
- 实时显示游戏状态
- 最后一步高亮显示

## 安装运行

1. 安装依赖：
```bash
npm install
```

2. 启动服务器：
```bash
npm start
```

3. 在浏览器中访问：
```
http://localhost:3000
```

## 游戏规则

- 玩家执黑子（先行），AI 执白子
- 双方轮流在棋盘上下子
- 先形成五子连线（横、竖、斜）者获胜
- 可以点击"悔棋"按钮撤销最近的移动（会同时撤销玩家和 AI 的各一步棋）

## 项目结构

```
gomoku-game/
├── server.js           # Express 服务器
├── gameEngine.js       # 游戏引擎（棋盘、落子、胜负判断）
├── ai.js              # AI 算法（基于评分系统）
├── package.json       # 项目配置
└── public/
    ├── index.html     # 主页面
    ├── style.css      # 样式文件
    └── game.js        # 前端逻辑
```

## 技术栈

- 后端：Node.js + Express
- 前端：HTML5 Canvas + CSS3 + JavaScript
- AI 算法：基于模式识别的评分系统
