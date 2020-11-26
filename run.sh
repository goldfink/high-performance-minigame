killall forever
killall nodemon
killall node
forever start -l forever.log -o stdout.log -e error.log -c nodemon gameserver.js
