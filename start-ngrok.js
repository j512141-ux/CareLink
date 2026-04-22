/**
 * 使用 ngrok 将本地服务器暴露到互联网
 * 这样任何人都可以从任何网络访问该应用，只需打开生成的公网 URL
 */

const ngrok = require('ngrok');
const { spawn } = require('child_process');
const path = require('path');

async function startApp() {
    try {
        // 1. 启动本地服务器
        console.log('正在启动本地服务器...');
        const server = spawn(process.execPath, [path.join(__dirname, 'serve.mjs')], {
            cwd: __dirname,
            stdio: 'inherit'
        });

        // 2. 等待一下，让服务器启动
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. 使用 ngrok 暴露到互联网
        console.log('\n正在连接到 ngrok 隧道...\n');
        
        // 需要先设置 authtoken（从 https://dashboard.ngrok.com/auth/your-authtoken 获取）
        // await ngrok.authtoken(process.env.NGROK_AUTHTOKEN || 'your_authtoken_here');
        
        const url = await ngrok.connect(3000);
        
        console.log('\n========================================');
        console.log('应用现在可以在互联网上访问！');
        console.log('========================================');
        console.log(`公网地址: ${url}`);
        console.log('');
        console.log('任何人都可以用这个地址访问你的应用，');
        console.log('无需在同一个网络中！');
        console.log('');
        console.log('按 Ctrl+C 停止服务');
        console.log('========================================\n');

        // 捕获 Ctrl+C 信号
        process.on('SIGINT', async () => {
            console.log('\n\n正在关闭...');
            await ngrok.disconnect();
            await ngrok.kill();
            server.kill();
            process.exit(0);
        });

    } catch (error) {
        console.error('错误:', error.message);
        console.log('\n提示: 需要先安装 ngrok');
        console.log('运行: npm install ngrok');
        process.exit(1);
    }
}

startApp();
