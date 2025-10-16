from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout

class Command(BaseCommand):
    help = 'Populate the SQLite database with test data'

    def handle(self, *args, **options):
        # Clear existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Sample users (super heroes)
        users_data = [
            {"name": "Superman", "email": "superman@dc.com", "team": "dc"},
            {"name": "Batman", "email": "batman@dc.com", "team": "dc"},
            {"name": "Wonder Woman", "email": "wonderwoman@dc.com", "team": "dc"},
            {"name": "Iron Man", "email": "ironman@marvel.com", "team": "marvel"},
            {"name": "Captain America", "email": "cap@marvel.com", "team": "marvel"},
            {"name": "Black Widow", "email": "widow@marvel.com", "team": "marvel"},
        ]

        for user_data in users_data:
            User.objects.create(**user_data)

        # Teams
        teams_data = [
            {"name": "marvel", "members": ["Iron Man", "Captain America", "Black Widow"]},
            {"name": "dc", "members": ["Superman", "Batman", "Wonder Woman"]},
        ]

        for team_data in teams_data:
            Team.objects.create(**team_data)

        # Activities
        activities_data = [
            {"user": "Superman", "activity": "Flying", "duration": 120},
            {"user": "Batman", "activity": "Martial Arts", "duration": 90},
            {"user": "Iron Man", "activity": "Flight Suit Training", "duration": 60},
        ]

        for activity_data in activities_data:
            Activity.objects.create(**activity_data)

        # Leaderboard
        leaderboard_data = [
            {"team": "dc", "points": 150},
            {"team": "marvel", "points": 120},
        ]

        for lb_data in leaderboard_data:
            Leaderboard.objects.create(**lb_data)

        # Workouts
        workouts_data = [
            {"name": "Superhero Strength Training", "suggested_for": ["Superman", "Batman", "Iron Man"]},
            {"name": "Agility Workout", "suggested_for": ["Wonder Woman", "Black Widow"]},
        ]

        for workout_data in workouts_data:
            Workout.objects.create(**workout_data)

        self.stdout.write(self.style.SUCCESS('Successfully populated SQLite database with test data'))
