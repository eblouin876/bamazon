# !/bin/bash

npm install

read  -p "MySQL Username: "  user
read -sp "MySQL Password:  " pwd

echo "DB_USER='$user'" > .env
echo "DB_PASS='$pwd'" >> .env

node buildDb.js
node bamazon2.js