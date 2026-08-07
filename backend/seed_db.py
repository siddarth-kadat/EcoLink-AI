import sys
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models import User, NGOProfile

# Realistic NGO Seed Data
SEED_NGOS = [
    {
        "name": "Hope Food Bank",
        "email": "hopebank@example.com",
        "password": "seededpassword123",  # In production, this would be hashed
        "role": "NGO",
        "profile": {
            "location": "123 Hope Lane, Bangalore",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "capacity": 300,
            "accepted_food_type": "Vegetarian,Vegan,Bakery,Dairy,Prepared Meals",
            "available_volunteers": 15
        }
    },
    {
        "name": "Green Harvest Kitchen",
        "email": "greenkitchen@example.com",
        "password": "seededpassword123",
        "role": "NGO",
        "profile": {
            "location": "789 Harvest Road, HSR Layout",
            "latitude": 12.9141,
            "longitude": 77.6410,
            "capacity": 100,
            "accepted_food_type": "Vegetarian,Vegan,Raw Produce",
            "available_volunteers": 4
        }
    },
    {
        "name": "Safe Haven Shelter",
        "email": "safehaven@example.com",
        "password": "seededpassword123",
        "role": "NGO",
        "profile": {
            "location": "321 Shelter Way, Koramangala",
            "latitude": 12.9279,
            "longitude": 77.6271,
            "capacity": 50,
            "accepted_food_type": "Vegetarian,Bakery,Non-Perishables",
            "available_volunteers": 2
        }
    },
    {
        "name": "Community Meals Alliance",
        "email": "communitymeals@example.com",
        "password": "seededpassword123",
        "role": "NGO",
        "profile": {
            "location": "567 Unity Street, Indiranagar",
            "latitude": 12.9345,
            "longitude": 77.6101,
            "capacity": 500,
            "accepted_food_type": "Vegetarian,Vegan,Bakery,Non-Vegetarian,Dairy,Prepared Meals",
            "available_volunteers": 30
        }
    },
    {
        "name": "Metro Food Rescue",
        "email": "metrorescue@example.com",
        "password": "seededpassword123",
        "role": "NGO",
        "profile": {
            "location": "901 Transit Blvd, Majestic",
            "latitude": 12.9783,
            "longitude": 77.5727,
            "capacity": 200,
            "accepted_food_type": "Bakery,Dairy,Prepared Meals,Beverages",
            "available_volunteers": 8
        }
    }
]

def seed_database():
    print("--- Starting Database Seeding ---")
    db: Session = SessionLocal()
    try:
        # Check and delete existing seeded NGOs to prevent unique constraint failures
        seeded_emails = [ngo["email"] for ngo in SEED_NGOS]
        existing_users = db.query(User).filter(User.email.in_(seeded_emails)).all()
        if existing_users:
            print(f"Removing {len(existing_users)} existing seeded users for idempotency...")
            for u in existing_users:
                db.delete(u)
            db.commit()

        # Seed users and profiles
        for ngo_data in SEED_NGOS:
            profile_data = ngo_data.pop("profile")
            
            # Create User
            user = User(**ngo_data)
            db.add(user)
            db.commit()  # commit to generate user_id
            db.refresh(user)
            
            # Create associated NGOProfile
            profile = NGOProfile(user_id=user.user_id, **profile_data)
            db.add(profile)
            db.commit()
            print(f"SUCCESS: Seeded {user.name} with Profile ID: {profile.ngo_profile_id}")

        print("\n--- DATABASE SEEDING COMPLETED SUCCESSFULLY ---")

    except Exception as e:
        db.rollback()
        print(f"\nERROR: Seeding failed: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
