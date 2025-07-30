from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError


# NOTE: validators are NOT run when calling save()
def validate_aware_datetime(value):
    if timezone.is_naive(value):
        raise ValidationError('datetime object must be aware')


class EventType(models.TextChoices):
    UNKNOWN = 'UNKNOWN'

    GAME_START = 'GAME_START'
    GAME_END = 'GAME_END'

    INSPECT = 'INSPECT'
    TALK = 'TALK'

    BACKPACK_ADD = 'BACKPACK_ADD'
    BACKPACK_DISCARD = 'BACKPACK_DISCARD'

    ZONE_ENTER = 'ZONE_ENTER'
    ZONE_EXIT = 'ZONE_EXIT'

    LAB_ENTER = 'LAB_ENTER'
    LAB_TEST = 'LAB_TEST'
    LAB_EXIT = 'LAB_EXIT'

    SCRATCHPAD_OPEN = 'SCRATCHPAD_OPEN'
    SCRATCHPAD_UPDATE = 'SCRATCHPAD_UPDATE'
    SCRATCHPAD_CLOSE = 'SCRATCHPAD_CLOSE'

    KIOSK_OPEN = 'KIOSK_OPEN'
    KIOSK_VIEW = 'KIOSK_VIEW'
    KIOSK_CLOSE = 'KIOSK_CLOSE'

    ASSESSMENT_START = 'ASSESSMENT_START'
    ASSESSMENT_UPDATE = 'ASSESSMENT_UPDATE'
    ASSESSMENT_END = 'ASSESSMENT_END'

    GRAB_EVIDENCE = 'GRAB_EVIDENCE'
    INSPECT_EVIDENCE = 'INSPECT_EVIDENCE'
    RETURN_EVIDENCE = 'RETURN_EVIDENCE'
    PLACE_EVIDENCE_ON_GRID = 'PLACE_EVIDENCE_ON_GRID'
    MOVE_EVIDENCE_INVENTORY = 'MOVE_EVIDENCE_INVENTORY'

    SWAP_THEORIZER_INVENTORY = 'SWAP_THEORIZER_INVENTORY'


class Event(models.Model):

    user_id = models.IntegerField()
    datetime = models.DateTimeField(validators=[validate_aware_datetime])
    type = models.CharField(max_length=32, choices=EventType.choices)
    params = models.JSONField(default=dict, blank=True)
