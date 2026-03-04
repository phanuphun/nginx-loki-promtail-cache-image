#!/bin/sh
set -e

# แทนค่าจาก env ลง config template -> config จริง
envsubst '$KONG_URL $VENDING_CODE' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g "daemon off;"