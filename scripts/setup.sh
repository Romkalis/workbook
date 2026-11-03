#!/bin/sh
# Первичная настройка проекта: git + зависимости. Запускать из корня: sh scripts/setup.sh
set -e
cd "$(dirname "$0")/.."

if [ ! -d .git ]; then
  git init -b main
fi

npm install

git add -A
git commit -m "Initial commit: учебник на Next.js, три лекции" || true

echo ""
echo "Готово. Запуск: npm run dev  ->  http://localhost:3000"
