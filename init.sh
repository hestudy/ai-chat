#!/bin/sh
# init.sh

# 这里写你想在启动前执行的命令
echo "Running initialization tasks..."
# 比如：数据库迁移、配置文件生成等

pnpm run migrate

# 执行传入的命令
exec "$@"