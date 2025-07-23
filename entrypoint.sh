#!/bin/sh
set -e  # Exit on first failure

echo "Replacing environment variables in config.json"
if envsubst < /usr/share/nginx/html/config.template.json > /usr/share/nginx/html/config.json; then
    echo "Environment variables replaced successfully."
else
    echo "Error replacing environment variables!" >&2
    exit 1
fi

exec "$@"

