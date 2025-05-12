# RSS转换服务

这是一个用于将[Memos](https://github.com/usememos/memos/issues)的RSS订阅转换为自定义JSON格式的Node.js服务。主要用于将Memos的RSS输出转换为[个人博客](https://blog.helong.online)的数据结构。

## 功能特点

- 将RSS日期转换为适配格式
- 提取和处理标签（#tag格式）
- 支持多图片展示

## 安装

1. 克隆仓库：

```bash
git clone [仓库地址]
cd Talking-Server
```

2. 安装依赖：

```bash
npm install
```

## 使用方法

### 开发模式

```bash
npm run dev
```

### 生产模式

```bash
npm start
```

服务器将在 http://localhost:3000 启动。

## API接口

### GET /api/talks

从指定的RSS源获取并转换数据。

**请求示例：**
```
GET http://localhost:3000/api/talks
```

**响应格式：**
```json
[
  {
    "date": "2025-05-12 16:37:42",
    "tags": ["测试", "我的"],
    "content": "Test2<p class=\"vh-img-flex\"><img src=\"http://example.com/image1.png\"><img src=\"http://example.com/image2.png\"></p>"
  }
]
```

## 配置

当前RSS源地址配置为：`http://localhost:5230/u/admin/rss.xml`

## 依赖

- express: Web服务器框架
- axios: HTTP客户端
- xml2js: XML解析
- moment: 日期处理
- cheerio: HTML解析
- cors: 跨域资源共享
- nodemon: 开发环境自动重启（开发依赖）
