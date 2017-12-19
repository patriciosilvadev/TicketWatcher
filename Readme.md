# チケットウォッチャーとは？

Redmineからチケットを取得して表示します

## インストール

1. RedmineのからAPI KEYを取得する

2. node8をインストール

3. コンソールでコマンドを実行
~~~
git clone https://github.com/multios12/TicketWatcher.git
cd TicketWatcher
set REDMINE_URI=http://localhost:3000
set TICKETS_PATH=./data
mkdir ./data
npm install
node ./bin/www
~~~
