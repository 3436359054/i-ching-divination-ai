# 易经占卜AI应用 - Docker部署说明

## 为什么需要这个脚本
这个脚本用于在WSL Ubuntu环境中构建和推送Docker镜像到GitHub Container Registry (GHCR)。

## 如何正确使用

**重要提示：请在WSL Ubuntu环境中运行此脚本，不要在Windows PowerShell或CMD中运行。Windows PowerShell中不支持chmod命令，必须在WSL环境中执行。**

### 步骤1：进入WSL环境
在Windows终端中运行：
```
wsl
```

### 步骤2：导航到项目目录
```
cd /mnt/d/workspace/other/i-ching-divination-ai
```

### 步骤3：自动登录设置（仅需配置一次）
确保已创建`loginDocekrInfo.txt`文件，包含以下内容：
```
user=3436359054
password=您的GitHub Personal Access Token
```

> 提示：此文件已添加到`.gitignore`和`.dockerignore`中，不会被上传到代码仓库或包含在Docker镜像中。

### 步骤4：给脚本添加执行权限
```
chmod +x docker-deploy.sh
echo "注意：chmod命令只能在WSL环境中使用，在Windows PowerShell中不可用"
```

### 步骤5：运行脚本
```
./docker-deploy.sh
```

## 重要说明：关于WSL中的Docker登录状态

**自动登录功能说明：**
- 我们已实现从`loginDocekrInfo.txt`文件自动读取凭据并登录Docker的功能
- 即使WSL环境中的Docker登录凭证不会在终端会话之间持久化存储，脚本也会自动处理登录过程
- 这解决了之前需要每次打开新终端都手动登录的问题

## 登录状态测试工具

我们提供了一个简单的测试脚本来检查当前的Docker登录状态：

```bash
chmod +x test-docker-login.sh
./test-docker-login.sh
```

## 脚本功能
- 检查Docker是否安装
- 检查GHCR登录状态
- 构建Docker镜像
- 推送镜像到GitHub Container Registry
- 提供选项清理本地镜像

## 注意事项
1. 请确保您的WSL环境中已安装Docker
2. 请确保您已登录到GitHub Container Registry (`docker login ghcr.io -u 3436359054`)
3. 如果您遇到权限问题，请使用sudo运行脚本或确保您的用户已添加到docker组

## 常见问题解决
- **认证失败错误**: 确保`loginDocekrInfo.txt`文件中的用户名和Personal Access Token正确，且Token具有足够权限
- **权限不足**: 检查GitHub Personal Access Token是否有`write:packages`权限
- **连接问题**: 检查网络连接，必要时配置代理
- **loginDocekrInfo.txt格式错误**: 确保文件格式为`user=您的GitHub用户名`和`password=您的Personal Access Token`

如果您有任何问题，请随时联系支持。