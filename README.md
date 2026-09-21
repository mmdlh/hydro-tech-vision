# AquaSphere Command

## 执行指令
立即实现该项目的核心功能与页面结构。使用内部规划，不要再向用户展示实施方案等待确认。

## 用户需求与规范
打造一个现代、炫酷、高科技感的**智慧水厂综合管控平台**，具备以下特性：

### 1. 视觉风格与交互设计
- **深色科技风**：深邃背景（以深蓝/深青黑色为底色，如 #0a1128 / #06101e），搭配智能水厂科技光影纹理或背景。
- **色彩体系**：高亮青色（Cyan #00f2fe / #00e5ff）、科技蓝（#1890ff / #2563eb）、荧光绿（正常状态 #10b981）、警示橙红（告警状态）。数据具有立体感与霓虹发光质感。
- **毛玻璃卡片（Glassmorphism）**：半透明背景（backdrop-blur-md, bg-white/5 或 bg-slate-900/60），搭配细微的流动渐变高光边框（border-cyan-500/20 ~ border-blue-500/30），以及 hover 浮起微光特效。
- **顶部固定导航栏**：
  - 左侧：智慧水厂主标题 + 实时时钟 + 运行状态指示灯
  - 右侧：8个一级菜单图标导航项 + 全屏切换 + 报警快捷通知徽标 + 用户信息

### 2. 八大一级菜单模块（各页面布局差异明显、信息高密度）
1. **水厂综合大屏（总览）**：核心KPI卡片（日供水量、进出水水质达标率、能耗吨水单耗、当前水压）、制水工艺流程简化立体视图、供水量多轴趋势图、全厂告警雷达分布。
2. **水质在线监测**：多监测点位（原水、沉淀池、滤后水、出厂水）水质指标对比矩阵、浊度/余氯/pH/溶解氧24小时多折线波动趋势、水质综合达标雷达图、异常指标告警记录表。
3. **制水工艺监控**：加药混合池、絮凝沉淀池、V型滤池、清水池多阶段工艺状态流转、阀门/水泵运行状态指示、加药剂量与沉淀效率柱状比对图。
4. **管网输配调度**：城市供水管网拓扑与分区压力监测、加压泵房流量与扬程监控柱线混合图、重点节点压力波动预警表。
5. **机电设备资产**：主要水泵电机健康度评分仪表盘、振动/温度实时频谱与趋势、设备维保周期倒计时看板、设备故障工单状态列表。
6. **能耗与碳排放**：全厂用电分区环形饼图、吨水综合能耗柱状图、峰平谷用电时段优化分析、碳排放指标达标进度条。
7. **预警与应急指挥**：红/橙/黄多级警报看板、实时告警流水表格（支持筛选与一键调度）、应急预案流转及排班人员通讯录。
8. **综合运营报表**：月度/季度供水报表、产销差率统计图表、自定义日期跨度筛选与数据导出（CSV/Excel）模拟交互。

### 3. 图表与组件规范（特别注意）
- 采用 ECharts 或优质现代化图表库，图表色调呼应科技蓝青风格。
- **图表规范**：折线图（包括折线柱状混合图）的图例必须统一置于图表顶部（如 `legend: { top: 10, ... }`），并配合合理的 `grid: { top: 40, ... }` 间距，严禁图例与图表绘图区或标题发生重叠。
- 数据卡片搭配发光数字（数字翻牌动效）与微型走势图（Sparkline），整体富有视觉冲击力与层次感。

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://hydro-tech-vision.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cc805d90-fa93-42b6-bd93-ad64195aba54).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
