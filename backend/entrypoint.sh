#!/usr/bin/env bash
sleep 1
cd code
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
exec "$@"