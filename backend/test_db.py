import sys
import datetime
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal, engine
from app.models import User, Donation, Recommendation, Delivery

def run_tests():
    print("--- Starting EcoLink AI Database CRUD and Relationship Tests ---")
    db: Session = SessionLocal()
    
    try:
        # 1. CREATE Users
        print("\n[1/7] Creating test users...")
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

        # 2. CREATE Donation
        print("\n[2/7] Creating test donation...")
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

        # 3. CREATE Recommendation and Delivery
        print("\n[3/7] Creating recommendation and delivery records...")
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

        # 4. READ and verify relationships
        print("\n[4/7] Verifying relationship navigation...")
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
        print("PASS: All SQLAlchemy relationships navigated and validated correctly.")

        # 5. UPDATE operations
        print("\n[5/7] Testing Update operations...")
        donation.status = "Claimed"
        delivery.pickup_status = "Picked Up"
        delivery.pickup_time = datetime.datetime.utcnow()
        db.commit()
        
        # Re-fetch and check
        db.refresh(donation)
        db.refresh(delivery)
        assert donation.status == "Claimed"
        assert delivery.pickup_status == "Picked Up"
        assert delivery.pickup_time is not None
        print("PASS: Update operations completed successfully.")

        # 6. DELETE and check Cascade Behavior
        print("\n[6/7] Testing Cascade Delete constraints...")
        # Deleting restaurant user should cascade delete its donation, and that donation's recommendation and delivery
        db.delete(restaurant)
        db.commit()
        
        # Check that donation, recommendation, and delivery are deleted
        deleted_donation = db.query(Donation).filter(Donation.donation_id == donation.donation_id).first()
        deleted_rec = db.query(Recommendation).filter(Recommendation.recommendation_id == recommendation.recommendation_id).first()
        deleted_del = db.query(Delivery).filter(Delivery.delivery_id == delivery.delivery_id).first()
        
        assert deleted_donation is None, "Donation was not cascade deleted"
        assert deleted_rec is None, "Recommendation was not cascade deleted"
        assert deleted_del is None, "Delivery was not cascade deleted"
        print("PASS: Cascade deletion validated. Donation, Recommendation, and Delivery automatically deleted with User.")

        # 7. Clean up remaining test data
        print("\n[7/7] Cleaning up remaining test users...")
        db.delete(ngo)
        db.delete(volunteer)
        db.commit()
        
        print("PASS: Cleanup completed successfully.")
        print("\n--- ALL DATABASE CRUD & RELATIONSHIP TESTS PASSED ---")

    except Exception as e:
        db.rollback()
        print(f"\nFAIL: Test encountered an exception: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
