# !/bin/bash

user=$1
pwd=$2

echo "DB_USER='$user'" >> .env
echo "DB_PASS='$pwd'" >> .env

node buildDb.js
node bamazon2.js