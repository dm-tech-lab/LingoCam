#!/usr/bin/env bash
# exit on error
set -o errexit

pipenv install

python manage.py collectstatic --no-input

python manage.py migrate

python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists() or __import__('subprocess').check_call(['python', 'manage.py', 'createsuperuser', '--no-input'])"