from app.schemas.donation import CreateDonationRequest

def create_donation(donation: CreateDonationRequest):
    return {
        "id": 1,
        "food_type": donation.food_type,
        "quantity": donation.quantity,
        "expiry_time": donation.expiry_time,
        "pickup_location": donation.pickup_location,
        "status": "Pending"
    }
