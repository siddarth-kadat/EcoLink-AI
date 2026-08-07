import sys
import os

# Add project directory to python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal
from app.models.user import User
from app.models.ngo_profile import NGOProfile
from app.services.auth_service import pwd_context

def create_demo_users():
    db = SessionLocal()
    try:
        # Define demo users
        demo_users_data = [
            {
                "name": "Demo Restaurant",
                "email": "demo.restaurant@example.com",
                "password": "Password@123",
                "role": "Restaurant"
            },
            {
                "name": "Demo NGO",
                "email": "demo.ngo@example.com",
                "password": "Password@123",
                "role": "NGO"
            },
            {
                "name": "Demo Volunteer",
                "email": "demo.volunteer@example.com",
                "password": "Password@123",
                "role": "Volunteer"
            },
            {
                "name": "Demo Admin",
                "email": "demo.admin@example.com",
                "password": "Password@123",
                "role": "Admin"
            }
        ]

        # Iterate and create users
        for u_data in demo_users_data:
            existing_user = db.query(User).filter(User.email == u_data["email"]).first()
            if not existing_user:
                print(f"Creating user: {u_data['name']} ({u_data['email']})")
                hashed = pwd_context.hash(u_data["password"])
                new_user = User(
                    name=u_data["name"],
                    email=u_data["email"],
                    password=hashed,
                    role=u_data["role"]
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
            else:
                print(f"User already exists: {u_data['name']} ({u_data['email']})")

        # Fetch Demo NGO to link NGO Profile
        demo_ngo = db.query(User).filter(User.email == "demo.ngo@example.com").first()
        if demo_ngo:
            existing_profile = db.query(NGOProfile).filter(NGOProfile.user_id == demo_ngo.user_id).first()
            if not existing_profile:
                print(f"Creating NGO Profile for user_id {demo_ngo.user_id}...")
                new_profile = NGOProfile(
                    user_id=demo_ngo.user_id,
                    location="Hubballi",
                    latitude=15.3647,
                    longitude=75.1240,
                    capacity=150,
                    accepted_food_type="Cooked Food",
                    available_volunteers=20
                )
                db.add(new_profile)
                db.commit()
                print("NGO Profile created successfully.")
            else:
                print("NGO Profile already exists.")

    except Exception as e:
        db.rollback()
        print(f"Error occurred: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_users()