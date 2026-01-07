# 签名密钥库说明

## 目录说明

此目录用于存放Release版本的签名密钥库文件（.jks或.keystore文件）。

## 创建签名密钥库

### 方法1: 使用Android Studio

1. 打开Android Studio
2. 点击菜单 `Build` -> `Generate Signed Bundle / APK`
3. 选择 `APK`
4. 点击 `Create new...` 创建新的密钥库
5. 填写密钥库信息：
   - Key store path: 选择此目录（`keystore/primary-release.jks`）
   - Password: 设置密钥库密码
   - Key alias: 设置密钥别名（如：primary_key）
   - Key password: 设置密钥密码
   - Validity: 设置有效期（建议25年）
   - Certificate information: 填写证书信息
6. 点击 `OK` 创建密钥库

### 方法2: 使用命令行

```bash
keytool -genkey -v -keystore keystore/primary-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias primary_key
```

执行命令后会提示输入：
- 密钥库密码
- 密钥密码
- 姓名、组织等信息

## 配置签名信息

创建密钥库后，在 `gradle.properties` 文件中配置签名信息：

```properties
RELEASE_STORE_FILE=keystore/primary-release.jks
RELEASE_STORE_PASSWORD=your_store_password
RELEASE_KEY_ALIAS=primary_key
RELEASE_KEY_PASSWORD=your_key_password
```

**注意**: 
- `gradle.properties` 文件会被Git忽略（如果配置了.gitignore）
- 生产环境请妥善保管密钥库文件和密码
- 不要将密钥库文件和密码提交到版本控制系统

## 安全建议

1. **备份密钥库**: 密钥库文件丢失后无法更新应用，请务必备份
2. **密码安全**: 使用强密码，并妥善保管
3. **版本控制**: 不要将密钥库文件和密码提交到Git
4. **权限控制**: 限制密钥库文件的访问权限

## 构建Release APK

配置完成后，可以使用以下命令构建Release APK：

```bash
# Windows
build_release.bat

# Linux/Mac
./gradlew assembleRelease
```

APK输出位置：
```
app/build/outputs/apk/release/app-release.apk
```

## 如果没有配置签名

如果没有配置签名信息，Release构建会使用Debug签名（仅用于测试，不能发布到应用商店）。
