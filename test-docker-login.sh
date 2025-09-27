#!/bin/bash

# WSL中Docker登录状态测试脚本

# 设置颜色变量
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示欢迎信息
clear
echo -e "${BLUE}=====================================${NC}"
echo -e "${GREEN}     WSL Docker登录状态测试工具     ${NC}"
echo -e "${BLUE}=====================================${NC}"

# 检查Docker是否已安装
if ! command -v docker &> /dev/null
then
    echo -e "${RED}错误: Docker未安装，请先安装Docker。${NC}"
    exit 1
fi

# 显示当前Docker信息
echo -e "\n${YELLOW}检查当前Docker版本信息:${NC}"
docker --version

echo -e "\n${YELLOW}检查GHCR登录状态:${NC}"
if docker info 2>/dev/null | grep -q "ghcr.io"
 then
    echo -e "${GREEN}✓ 已登录到GitHub Container Registry${NC}"
    echo -e "${BLUE}注意: 此登录状态仅在当前终端会话有效${NC}"
 else
    echo -e "${RED}✗ 未登录到GitHub Container Registry${NC}"
    echo -e "${YELLOW}请运行: docker login ghcr.io -u <您的GitHub用户名>${NC}"
fi

echo -e "\n${YELLOW}WSL环境中Docker登录的说明:${NC}"
echo -e "1. ${BLUE}登录状态不持久化:${NC} WSL中的Docker登录凭证不会在终端会话间保持"
 echo -e "2. ${BLUE}每次打开新终端:${NC} 通常需要重新登录docker才能推送镜像"
 echo -e "3. ${BLUE}凭证存储位置:${NC} Docker凭证存储在用户会话中，而非系统全局"

echo -e "\n${GREEN}测试完成。${NC}"