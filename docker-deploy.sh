#!/bin/bash

# GitHub Container Registry 部署脚本
# 用于在WSL Ubuntu系统中构建和推送Docker镜像到ghcr.io

# 设置颜色变量
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 预设GitHub用户名
DEFAULT_GITHUB_USERNAME="3436359054"
GITHUB_USERNAME="$DEFAULT_GITHUB_USERNAME"

# 显示欢迎信息
clear
echo -e "${BLUE}=====================================${NC}"
echo -e "${GREEN}     易经占卜AI应用 Docker部署脚本    ${NC}"
echo -e "${BLUE}=====================================${NC}"
echo -e "${YELLOW}预设GitHub用户名: $DEFAULT_GITHUB_USERNAME${NC}"
echo

# 检查Docker是否已安装
if ! command -v docker &> /dev/null
then
    echo -e "${RED}错误: Docker未安装，请先安装Docker。${NC}"
    echo -e "${YELLOW}安装命令参考: sudo apt-get update && sudo apt-get install docker.io${NC}"
    exit 1
fi

# 检查Docker守护进程是否运行
# if ! docker info &> /dev/null
# then
#     echo -e "${RED}错误: Docker守护进程未运行，请启动Docker服务。${NC}"
#     echo -e "${YELLOW}启动命令: sudo systemctl start docker${NC}"
#     echo -e "${YELLOW}设置开机自启: sudo systemctl enable docker${NC}"
#     exit 1
# fi

# 检查用户是否有权限运行docker命令
# if ! docker ps -a &> /dev/null
# then
#     echo -e "${RED}错误: 当前用户没有权限运行Docker命令。${NC}"
#     echo -e "${YELLOW}解决方法1: 使用sudo运行本脚本${NC}"
#     echo -e "${YELLOW}解决方法2: 将用户添加到docker组: sudo usermod -aG docker $USER && newgrp docker${NC}"
#     exit 1
# fi

# 提示用户确认或修改GitHub用户名
# read -p "请确认GitHub用户名 [$GITHUB_USERNAME]: " USER_INPUT
# if [ ! -z "$USER_INPUT" ]; then
#     GITHUB_USERNAME="$USER_INPUT"
# fi

# 尝试从loginDocekrInfo.txt文件自动登录Docker
echo -e "${BLUE}正在尝试从loginDocekrInfo.txt文件读取Docker登录信息...${NC}"

# 检查loginDocekrInfo.txt文件是否存在
if [ -f "loginDocekrInfo.txt" ]; then
    # 读取用户名和密码
    USERNAME=$(grep "^user=" loginDocekrInfo.txt | cut -d'=' -f2)
    PASSWORD=$(grep "^password=" loginDocekrInfo.txt | cut -d'=' -f2)
    
    # 检查是否成功读取了用户名和密码
    if [ -n "$USERNAME" ] && [ -n "$PASSWORD" ]; then
        echo -e "${GREEN}✓ 成功读取登录信息，正在自动登录GitHub Container Registry...${NC}"
        
        # 使用读取的信息自动登录Docker
        echo "$PASSWORD" | docker login ghcr.io -u "$USERNAME" --password-stdin &> /dev/null
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ 自动登录成功！${NC}"
        else
            echo -e "${RED}错误: 自动登录失败，请检查loginDocekrInfo.txt文件中的凭据是否正确。${NC}"
            echo -e "${YELLOW}解决方法: 手动登录: docker login ghcr.io -u $USERNAME${NC}"
            exit 1
        fi
    else
        echo -e "${RED}错误: loginDocekrInfo.txt文件格式不正确，找不到有效的用户名或密码。${NC}"
        echo -e "${YELLOW}文件格式应为:\nuser=您的GitHub用户名\npassword=您的Personal Access Token${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}警告: 未找到loginDocekrInfo.txt文件，检查当前登录状态...${NC}"
    
    # 检查用户是否已登录GHCR
    if ! docker info 2>/dev/null | grep -q "ghcr.io"; then
        echo -e "${RED}错误: 当前用户没有登录GitHub Container Registry。${NC}"
        echo -e "${YELLOW}解决方法1: 创建loginDocekrInfo.txt文件包含登录信息\n解决方法2: 运行本脚本前先手动登录: docker login ghcr.io -u $GITHUB_USERNAME${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ 检测到已有登录状态，继续执行...${NC}"
    fi
fi

# 构建Docker镜像
IMAGE_NAME="ghcr.io/$GITHUB_USERNAME/i-ching-divination-ai:latest"
echo -e "${GREEN}正在构建Docker镜像 $IMAGE_NAME...${NC}"
docker build -t "$IMAGE_NAME" .

if [ $? -ne 0 ]
then
    echo -e "${RED}镜像构建失败，请检查Dockerfile和项目文件。${NC}"
    echo -e "${YELLOW}提示: 可以尝试使用 docker build -t test-image . 进行测试${NC}"
    exit 1
fi

# 推送Docker镜像到GitHub Container Registry
echo -e "${GREEN}正在推送镜像到GitHub Container Registry...${NC}"
docker push "$IMAGE_NAME"

if [ $? -ne 0 ]
then
    echo -e "${RED}镜像推送失败，请检查网络连接或GitHub Personal Access Token权限。${NC}"
    echo -e "${YELLOW}提示1: 确认Personal Access Token权限足够${NC}"
    echo -e "${YELLOW}提示2: 检查网络连接，可能需要配置代理${NC}"
    exit 1
fi

# 清理
unset GITHUB_PAT

# 询问是否清理本地镜像
echo -e "${BLUE}\n=====================================${NC}"
read -p "是否清理本地构建的Docker镜像？(y/N): " CLEANUP
if [[ $CLEANUP == [Yy]* ]]; then
    echo -e "${GREEN}正在清理本地Docker镜像...${NC}"
    docker rmi "$IMAGE_NAME"
    echo -e "${GREEN}镜像清理完成。${NC}"
fi

# 显示成功信息
echo -e "${BLUE}\n=====================================${NC}"
echo -e "${GREEN}部署成功！您的镜像已推送至GitHub Container Registry。${NC}"
echo -e "${YELLOW}\n在ClawCloud Run中部署时，请使用以下镜像名称：${NC}"
echo -e "${GREEN}$IMAGE_NAME${NC}"
echo -e "${BLUE}\n=====================================${NC}"
echo -e "${YELLOW}提示: 部署完成后，您可以删除Personal Access Token以增强安全性${NC}"