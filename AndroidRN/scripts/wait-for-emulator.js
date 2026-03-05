#!/usr/bin/env node
/**
 * 等待 Android 模拟器/设备就绪后执行 react-native run-android
 * 用法: node scripts/wait-for-emulator.js [--no-packager]
 */

const { execSync, spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const noPackager = process.argv.includes('--no-packager');

function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', ...opts });
}

function waitForDevice() {
  console.log('Waiting for emulator/device...');
  run('adb wait-for-device');
  console.log('Device connected, waiting for boot...');
  for (let i = 0; i < 120; i++) {
    try {
      const out = run('adb shell getprop sys.boot_completed');
      if ((out || '').trim() === '1') {
        console.log('Boot completed.');
        return;
      }
    } catch (_) {}
    const syncWait = (ms) => { const t = Date.now(); while (Date.now() - t < ms) {} };
    syncWait(2000);
  }
  throw new Error('Emulator boot timeout');
}

waitForDevice();

const args = ['react-native', 'run-android'];
if (noPackager) args.push('--no-packager');

const child = spawn('npx', args, {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});
child.on('exit', (code) => process.exit(code != null ? code : 0));
