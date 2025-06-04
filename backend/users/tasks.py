from django.core import management

from alive_dashboard import celery_app


@celery_app.task
def clearsessions():
    management.call_command("clearsessions")
