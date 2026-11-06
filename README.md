# RedFox Hub 抖音账号搜索演示

## 1. 环境要求

- Node.js 18+
- 已安装项目依赖：`express`、`axios`
- RedFox Hub API Key

## 2. 配置 API Key

PowerShell 当前终端执行：

```powershell
$env:REDFOX_API_KEY="你的真实API_KEY"
```

注意：关闭当前终端后，该临时环境变量会失效。不要把 API Key 写进 `public/index.html` 或提交到 GitHub。

## 3. 启动

```bash
npm start
```

浏览器访问：

http://localhost:3000

## 4. 接口说明

### POST /api/douyin/search

请求体：

```json
{
  "keyword": "前端开发",
  "offset": 0,
  "sortType": "_0"
}
```

本地服务端将请求转发到 RedFox Hub：

`https://redfox.hk/story/api/dyData/searchUser`

并将上游真实 JSON 响应返回给浏览器。

### GET /api/health

检查本地服务是否启动：

`http://localhost:3000/api/health`

## 5. 安全说明

API Key 仅在 Node.js 服务端读取，通过请求头发送给 RedFox Hub。浏览器只请求本地 `/api/douyin/search`，不会接触密钥。

如果部署到公网，请增加登录鉴权、调用频率限制、日志脱敏和 HTTPS。
