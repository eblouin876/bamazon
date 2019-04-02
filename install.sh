# !/bin/bash

user=$1
pwd=$2

echo "let user = '$user';" >> query.js
echo "let pwd = '$pwd';" >> query.js

echo "DB_USER='$user'" >> .env
echo "DB_PASS='$pwd'" >> .env

node buildDb.js
node bamazon2.js