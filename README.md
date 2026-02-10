# 五子棋游戏 (Gomoku Game)

<div align="center">
  <h3>一个基于 Node.js 的 Web 版五子棋游戏，支持人机对战</h3>
  <p>
    <strong>15x15 标准棋盘 | 智能 AI | 悔棋功能 | 实时状态</strong>
  </p>
</div>

![Gomoku](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 功能特点

- **15x15 标准五子棋棋盘** - 经典棋盘布局，Canvas 绘制
- **人机对战模式** - 玩家执黑先行，AI 执白后手
- **智能 AI 对手** - 基于模式识别的评分算法
- **悔棋功能** - 可撤销最近一步（同时撤销玩家和 AI 的各一步）
- **重新开始** - 随时重置游戏
- **实时显示游戏状态** - 显示当前回合、胜负信息
- **最后一步高亮显示** - 清晰标识 AI 的落子位置

## 项目截图

> 🎮 游戏界面展示

![游戏截图](screenshot.png)

## 在线体验

访问部署地址体验游戏（如果有部署的话）

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

### 后端
- **Node.js** - JavaScript 运行环境
- **Express** - Web 服务器框架

### 前端
- **HTML5 Canvas** - 棋盘和棋子绘制
- **CSS3** - 响应式布局和样式
- **原生 JavaScript** - 游戏交互逻辑

### AI 算法
- **模式识别评分系统** - 基于棋型评估的贪心算法
- **优化的搜索策略** - 仅评估有邻居的位置，提高性能
- **攻防平衡** - 同时考虑进攻和防守策略

## AI 算法详解

本项目的 AI 使用基于模式识别的评分系统：

### 评分规则

| 棋型 | 说明 | 分数 |
|------|------|------|
| 五连 (XXXXX) | 直接获胜 | 100,000 |
| 活四 (_XXXX_) | 两端开放 | 10,000 |
| 冲四 (XXXX_) | 一端被堵 | 1,000 |
| 活三 (_XXX_) | 两端开放 | 1,000 |
| 眠三 (XXX_) | 一端被堵 | 100 |
| 活二 (_XX_) | 两端开放 | 100 |
| 眠二 (XX_) | 一端被堵 | 10 |

### 算法特点

1. **开局策略** - 首步自动落子天元（棋盘中心）
2. **邻域搜索** - 仅评估距离现有棋子 2 格内的位置
3. **攻防兼备** - 进攻权重 1.1，防守权重 1.0
4. **四个方向** - 同时评估横、竖、左斜、右斜

## 开发计划

- [ ] 添加难度选择（简单/中等/困难）
- [ ] 添加双人对战模式
- [ ] 添加游戏历史记录
- [ ] 添加音效和动画
- [ ] 添加移动端适配优化
- [ ] 添加 Minimax 算法实现更强的 AI

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 作者

**chenchucheng**

## 致谢

五子棋游戏规则和经典棋型评分算法参考了相关开源项目。

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
