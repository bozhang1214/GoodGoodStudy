#!/usr/bin/env node
/**
 * 先启动 Metro，等其就绪后再执行 react-native run-android --no-packager
 * 解决 "Unable to load script" 红屏（需先有 Metro 再启动应用）
 */
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const METRO_PORT = 8081;
const MAX_WAIT_MS = 60000;
const POLL_MS = 500;

function checkMetro() {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${METRO_PORT}/status`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => { req.destroy(); resolve(false); });
  });
}

function waitForMetro() {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const run = () => {
      if (Date.now() - start > MAX_WAIT_MS) {
        reject(new Error('Metro 启动超时，请手动在另一终端运行: npm start'));
        return;
      }
      checkMetro().then((ok) => {
        if (ok) {
          console.log('Metro 已就绪 (port ' + METRO_PORT + ')，正在启动应用...');
          resolve();
          return;
        }
        setTimeout(run, POLL_MS);
      });
    };
    run();
  });
}

let metroProc = null;

function startMetro() {
  return new Promise((resolve) => {
    console.log('正在启动 Metro...');
    const child = spawn('npx', ['react-native', 'start'], {
      cwd: rootDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      detached: process.platform !== 'win32',
    });
    metroProc = child;
    child.stdout.on('data', (d) => process.stdout.write(d));
    child.stderr.on('data', (d) => process.stderr.write(d));
    child.on('error', (err) => {
      console.error('启动 Metro 失败:', err.message);
      resolve(false);
    });
    setTimeout(resolve, 2000);
  });
}

(async () => {
  const alreadyUp = await checkMetro();
  if (alreadyUp) {
    console.log('检测到 Metro 已在运行，直接启动应用。');
  } else {
    await startMetro();
    await waitForMetro();
  }
  const child = spawn('npx', ['react-native', 'run-android', '--no-packager'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });
  child.on('exit', (code) => {
    if (code !== 0 && code != null) process.exit(code);
    console.log('应用已安装。Metro 仍在运行，可在模拟器中打开应用。按 Ctrl+C 关闭 Metro。');
  });
})();
