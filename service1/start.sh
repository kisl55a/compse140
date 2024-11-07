#!/bin/sh

while true; do
  echo "Starting server..."
  node index.js &

  wait

  echo "Server paused for 2 seconds..."
  sleep 2
done
