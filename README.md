> 正在高速开发迭代中，目前并不稳定，欢迎体验和反馈

# AI Chat

✨ 完全自己掌握的 llm chat 应用

# 特点

- 😮 多用户体系
- ☁️ 完全云同步
- 🛠️ 工具调用
- 🧩 dalle 图片生成
- 🚄 完全开源，docker 部署
- 😍 更多特性正在开发中

# 路线图

- [] 🔍web 搜索
- [] 👁️vision 模型
- [] 📕rag 对话
- [] 🙌 更多模型支持

# 运行

体验一下

```shell

docker run -d --name ai-chat -p 3000:3000 -v $PWD/data:/app/prisma/data -e OPENAI_API_KEY=xxx -e OPENAI_API_BASE_URL=xxx -e MODEL=gpt-3.5-turbo ghcr.io/hestudy/ai-chat:latest

```

# 部署

部署环境请走 ssl 证书保护下的域名，以保护你的 cookie

```shell

docker run -d --name ai-chat -p 3000:3000 -v $PWD/data:/app/prisma/data -e OPENAI_API_KEY=xxx -e OPENAI_API_BASE_URL=xxx -e MODEL=gpt-3.5-turbo -e COOKIE_SECURE=true -e DOMAIN=你的部署域名 ghcr.io/hestudy/ai-chat:latest

```
