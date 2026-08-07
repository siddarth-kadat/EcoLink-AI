from app.ai.recommendation_engine import generate_recommendation


def get_recommendation(donation):
    """
    Service function to retrieve an AI recommendation for a given food donation.

    Note: In future iterations, NGO and volunteer data will be dynamically
    queried from PostgreSQL database models.
    """
    # Dummy NGO dataset
    ngos = [
        {"id": 1, "name": "Hope Shelter Foundation", "location": "Downtown", "capacity": 150},
        {"id": 2, "name": "City Food Rescue", "location": "Uptown", "capacity": 300},
        {"id": 3, "name": "Green Earth Outreach", "location": "Suburbs", "capacity": 100},
    ]

    # Dummy Volunteer dataset
    volunteers = [
        {"id": 1, "name": "Alex Johnson", "status": "Available", "vehicle": "Van"},
        {"id": 2, "name": "Maria Garcia", "status": "Available", "vehicle": "Car"},
        {"id": 3, "name": "David Smith", "status": "Busy", "vehicle": "Bike"},
    ]

    # Call AI recommendation engine
    recommendation = generate_recommendation(
        donation=donation,
        ngos=ngos,
        volunteers=volunteers
    )

    return recommendation
