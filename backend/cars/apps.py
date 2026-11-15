# cars/apps.py
from django.apps import AppConfig
from django.db import OperationalError, ProgrammingError
from django.db.models.signals import post_migrate


def _update_staff_group(sender, **kwargs):
    """After each migrate, make sure the staff group has its current permissions."""
    from .staff import ensure_staff_group

    try:
        ensure_staff_group()
    except (OperationalError, ProgrammingError):
        pass  # tables are not ready yet (e.g. a partial migrate)


class CarsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "cars"

    def ready(self):
        post_migrate.connect(_update_staff_group, sender=self)