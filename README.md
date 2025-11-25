# Chat Frontend (Vue 3 + TypeScript + Vite)

这是一个使用 Vue 3 + TypeScript + Vite 的聊天室前端样例，包含登录/注册、房间创建与加入、以及 WebSocket 基础框架。

**运行**

```bash
cd /Users/faken233/code/chat-front
npm install
npm run dev
```

默认端口为 `5173`。

**说明**
- 所有后端接口以 `VITE_API_BASE` 为前缀，通过 `.env` 配置。
- WebSocket 地址以 `VITE_WS_BASE` 配置；当前实现会在连接时带上 `?token=...` 参数。
- 鉴权使用 JWT，登录后将 token 存入 `localStorage.AUTH_TOKEN`，并在请求头 `Authorization: Bearer <token>` 中携带。
- WebSocket 收到消息后的具体业务分发逻辑留空（按需求自行实现）。

**接口对照**
使用了提供的 `openapi.json` 中的接口路径，例如：
- `POST /user/login` 登录
- `POST /user/register` 注册
- `POST /room/create` 创建房间
- `POST /room/join?roomId=...` 加入房间
- `POST /message/public` 发送公聊消息（示例）

**技术栈**
- Vue 3 (Composition API + `<script setup>`)
- TypeScript
- Vue Router 4
- Axios
- Vite


## 拓展点
1. 文件上传, 大文件断点续传
2. 无感刷新token
3. 脏话过滤(库或者AI?)
