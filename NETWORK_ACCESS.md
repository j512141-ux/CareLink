# 跨网络访问说明

要让任何地方的人都能访问你的应用（不限于同一网络），可以使用以下方法：

## 方法 1: 使用 ngrok（推荐最简单）

### 步骤：

1. **安装 ngrok**
   - 访问 https://ngrok.com/download
   - 下载并解压到本项目文件夹中
   - 或使用 Chocolatey: `choco install ngrok`

2. **获取 AuthToken（可选但推荐）**
   - 访问 https://dashboard.ngrok.com/auth/your-authtoken
   - 复制你的 authtoken
   - 运行: `ngrok authtoken <your_token>`

3. **启动应用**
   ```bash
   # 先启动服务器（在一个终端）
   node serve.mjs
   
   # 在另一个终端，运行 ngrok
   ngrok http 3000
   ```

4. **获取公网地址**
   - ngrok 会显示类似这样的 URL：
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3000
   ```
   - 任何人都可以通过 `https://abc123.ngrok.io` 访问你的应用！

### 优点：
- ✅ 完全免费（有免费层）
- ✅ 无需公网 IP
- ✅ 不需要复杂配置
- ✅ URL 可以随时生成和撤销

---

## 方法 2: 使用自动化脚本

如果你已安装 ngrok，可以创建一个 batch 文件自动启动：

**start-app.bat**
```batch
@echo off
cd %~dp0
echo 正在启动应用...
echo.
echo 终端1: 启动服务器
start cmd /k "node serve.mjs"
echo.
echo 请在另一个终端运行: ngrok http 3000
echo.
pause
```

---

## 方法 3: 使用公网 IP（如果有静态 IP）

如果你的网络有静态公网 IP：

1. 修改 serve.mjs，改为监听外部 IP
2. 配置防火墙允许 3000 端口
3. 其他人可以通过 `http://your-public-ip:3000` 访问

> 这种方法需要 ISP 提供公网 IP，一般家庭网络不支持

---

## 推荐：使用 ngrok

对于你的需求，**ngrok 是最简单的方案**：
1. 下载 ngrok
2. 运行 `ngrok http 3000`
3. 分享生成的 URL 给其他人

就这么简单！任何人都可以通过这个 URL 访问你的应用。
