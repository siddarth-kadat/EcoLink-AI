import sys
import datetime
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal, engine
from app.models import User, Donation, Recommendation, Delivery, NGOProfile

def run_tests():
    print("--- Starting EcoLink AI Database CRUD and Relationship Tests ---")
    db: Session = SessionLocal()
    
    try:
        # 1. CREATE Users
        print("\n[1/9] Creating test users...")
        restaurant = User(
            name="Pizza Place",
            email="pizza@example.com",
            password="hashedpassword123",
            role="Restaurant"
        )
        ngo = User(
            name="Food For All",
            email="ngo@example.com",
            password="hashedpassword123",
            role="NGO"
        )
        volunteer = User(
            name="John Doe",
            email="john@example.com",
            password="hashedpassword123",
            role="Volunteer"
        )
        db.add_all([restaurant, ngo, volunteer])
        db.commit()
        db.refresh(restaurant)
        db.refresh(ngo)
        db.refresh(volunteer)
        print(f"PASS: Users created. Restaurant ID: {restaurant.user_id}, NGO ID: {ngo.user_id}, Volunteer ID: {volunteer.user_id}")

        # 2. CREATE NGOProfile
        print("\n[2/9] Creating NGO profile...")
        ngo_profile = NGOProfile(
            user_id=ngo.user_id,
            location="456 Hope Ave, Cityville",
            latitude=12.9716,
            longitude=77.5946,
            capacity=100,
            accepted_food_type="Vegetarian,Vegan,Bakery",
            available_volunteers=5
        )
        db.add(ngo_profile)
        db.commit()
        db.refresh(ngo_profile)
        print(f"PASS: NGOProfile created. Profile ID: {ngo_profile.ngo_profile_id}")

        # 3. CREATE Donation
        print("\n[3/9] Creating test donation...")
        expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=4)
        donation = Donation(
            restaurant_id=restaurant.user_id,
            food_type="Margherita Pizza",
            quantity="5 boxes",
            expiry_time=expiry,
            pickup_location="123 Pizza St, Cityville",
            status="Available"
        )
        db.add(donation)
        db.commit()
        db.refresh(donation)
        print(f"PASS: Donation created. Donation ID: {donation.donation_id}")

        # 4. CREATE Recommendation and Delivery
        print("\n[4/9] Creating recommendation and delivery records...")
        recommendation = Recommendation(
            donation_id=donation.donation_id,
            ngo_id=ngo.user_id,
            confidence_score=0.95,
            priority_score=0.88,
            delivery_risk="Low",
            recommendation_explanation="Pizza Place is close to Food For All and the food is high-demand."
        )
        delivery = Delivery(
            donation_id=donation.donation_id,
            volunteer_id=volunteer.user_id,
            pickup_status="Pending",
            delivery_status="Pending"
        )
        db.add_all([recommendation, delivery])
        db.commit()
        db.refresh(recommendation)
        db.refresh(delivery)
        print(f"PASS: Recommendation ID {recommendation.recommendation_id} and Delivery ID {delivery.delivery_id} created.")

        # 5. READ and verify relationships
        print("\n[5/9] Verifying relationship navigation...")
        # Restaurant -> Donations
        db.refresh(restaurant)
        assert len(restaurant.donations) == 1
        assert restaurant.donations[0].food_type == "Margherita Pizza"
        
        # Donation -> Restaurant
        assert donation.restaurant.name == "Pizza Place"
        
        # Donation -> Recommendation & Delivery (1-to-1)
        assert donation.recommendation.confidence_score == 0.95
        assert donation.delivery.volunteer.name == "John Doe"
        
        # Volunteer -> Deliveries
        db.refresh(volunteer)
        assert len(volunteer.deliveries) == 1
        assert volunteer.deliveries[0].donation_id == donation.donation_id
        
        # NGO -> Recommendations
        db.refresh(ngo)
        assert len(ngo.recommendations) == 1
        assert ngo.recommendations[0].delivery_risk == "Low"

        # NGO <-> NGOProfile (1-to-1 Bidirectional)
        assert ngo.ngo_profile is not None
        assert ngo.ngo_profile.location == "456 Hope Ave, Cityville"
        assert ngo_profile.user.name == "Food For All"
        
        print("PASS: All SQLAlchemy relationships mapped and navigated correctly (including NGOProfile).")

        # 6. UPDATE NGOProfile Fields
        print("\n[6/9] Testing Update operations on NGOProfile fields...")
        # Update Capacity
        ngo_profile.capacity = 150
        # Update Accepted Food Types
        ngo_profile.accepted_food_type = "Vegetarian,Vegan,Bakery,Dairy"
        # Update Available Volunteers
        ngo_profile.available_volunteers = 10
        # General Donation and Delivery updates
        donation.status = "Claimed"
        delivery.pickup_status = "Picked Up"
        delivery.pickup_time = datetime.datetime.utcnow()
        db.commit()
        
        # Re-fetch and check
        db.refresh(ngo_profile)
        db.refresh(donation)
        db.refresh(delivery)
        
        assert ngo_profile.capacity == 150, "Capacity update failed"
        assert ngo_profile.accepted_food_type == "Vegetarian,Vegan,Bakery,Dairy", "Food type update failed"
        assert ngo_profile.available_volunteers == 10, "Volunteer update failed"
        assert donation.status == "Claimed"
        assert delivery.pickup_status == "Picked Up"
        assert delivery.pickup_time is not None
        print("PASS: NGOProfile and status updates verified successfully.")

        # 7. DELETE NGOProfile and verify User remains intact
        print("\n[7/9] Testing Delete operation on NGOProfile...")
        profile_id_to_check = ngo_profile.ngo_profile_id
        db.delete(ngo_profile)
        db.commit()
        
        deleted_profile = db.query(NGOProfile).filter(NGOProfile.ngo_profile_id == profile_id_to_check).first()
        parent_user = db.query(User).filter(User.user_id == ngo.user_id).first()
        
        assert deleted_profile is None, "NGOProfile delete failed"
        assert parent_user is not None, "Parent NGO user was incorrectly deleted when profile was deleted"
        print("PASS: NGOProfile deleted successfully. Parent NGO User record remains intact.")

        # 8. Re-add Profile to check Cascade delete when User is deleted
        print("\n[8/9] Testing Cascade Delete of NGOProfile when parent User is deleted...")
        new_profile = NGOProfile(
            user_id=ngo.user_id,
            location="456 Hope Ave, Cityville",
            latitude=12.9716,
            longitude=77.5946,
            capacity=100,
            accepted_food_type="Vegetarian,Vegan",
            available_volunteers=5
        )
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        
        new_profile_id = new_profile.ngo_profile_id
        
        # Delete NGO User
        db.delete(ngo)
        db.commit()
        
        deleted_ngo_user = db.query(User).filter(User.user_id == ngo.user_id).first()
        deleted_ngo_profile = db.query(NGOProfile).filter(NGOProfile.ngo_profile_id == new_profile_id).first()
        
        assert deleted_ngo_user is None
        assert deleted_ngo_profile is None, "NGOProfile was not cascade deleted with User"
        print("PASS: Cascade deletion validated. NGOProfile automatically deleted when parent User is deleted.")

        # 9. Clean up remaining test data
        print("\n[9/9] Cleaning up remaining Restaurant and Volunteer records...")
        # Deleting restaurant user should cascade delete its donation, and that donation's recommendation and delivery
        db.delete(restaurant)
        db.delete(volunteer)
        db.commit()
        
        # Check that donation, recommendation, and delivery are deleted
        deleted_donation = db.query(Donation).filter(Donation.donation_id == donation.donation_id).first()
        deleted_rec = db.query(Recommendation).filter(Recommendation.recommendation_id == recommendation.recommendation_id).first()
        deleted_del = db.query(Delivery).filter(Delivery.delivery_id == delivery.delivery_id).first()
        
        assert deleted_donation is None, "Donation was not cascade deleted"
        assert deleted_rec is None, "Recommendation was not cascade deleted"
        assert deleted_del is None, "Delivery was not cascade deleted"
        print("PASS: Cascade deletion on donations validated. Cleanup completed successfully.")
        print("\n--- ALL DATABASE CRUD & RELATIONSHIP TESTS PASSED ---")

    except Exception as e:
        db.rollback()
        print(f"\nFAIL: Test encountered an exception: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
