#!/bin/sh

LOG_FILE=/app/frontend_access.log
DATABASE_FILE="/data/numbers.txt"

echo "Backend started. Logging frontend requests to $LOG_FILE"

while true; do
  # Simulating request logging
  if [ -f "$DATABASE_FILE" ]; then
    while IFS= read -r line
    do
      echo "$(date): Frontend requested access with number $line" >> $LOG_FILE
    done < "$DATABASE_FILE"
  fi
  sleep 10  # simulate backend activity
done
