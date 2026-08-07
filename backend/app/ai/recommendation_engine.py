import datetime
# pyrefly: ignore [missing-import]
from geopy.geocoders import Nominatim
# pyrefly: ignore [missing-import]
from haversine import haversine, Unit

# Initialize OpenStreetMap Nominatim geolocator instance
geolocator = Nominatim(user_agent="ecolink_ai_recommendation_engine", timeout=5)


def _get_val(obj, key, default=None):
    """Safely extract attribute or dictionary key value from input object."""
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


def _geocode_location(location_str):
    """
    Geocodes a pickup location string into (latitude, longitude) using OpenStreetMap Nominatim.
    Fails gracefully returning None if geocoding fails or times out.
    """
    if not location_str or not isinstance(location_str, str):
        return None
    try:
        location = geolocator.geocode(location_str)
        if location:
            return (float(location.latitude), float(location.longitude))
    except Exception:
        pass
    return None


def _parse_quantity(qty_raw):
    """Parse numeric quantity from string or integer."""
    if isinstance(qty_raw, int):
        return qty_raw
    if isinstance(qty_raw, str):
        digits = "".join([c for c in qty_raw if c.isdigit()])
        if digits:
            return int(digits)
    return 10


def generate_recommendation(donation, ngos, volunteers):
    """
    Evaluates candidate NGOs using dynamic weighted scoring:
      - Distance / Location:        40% (using geopy & haversine)
      - Food Type Compatibility:    25%
      - Capacity:                   15%
      - Volunteer Availability:     10%
      - Expiry Priority:            10%

    Returns Top 2 recommendations ranked by score.
    """
    candidate_scores = []

    # Extract donation attributes
    donation_food = str(_get_val(donation, "food_type", "")).strip().lower()
    donation_qty = _parse_quantity(_get_val(donation, "quantity", 10))
    expiry_time = _get_val(donation, "expiry_time")
    pickup_location_str = str(_get_val(donation, "pickup_location", ""))

    # Geocode donation pickup_location dynamically
    pickup_coords = _geocode_location(pickup_location_str)

    # Expiry Priority (10% weight)
    expiry_score = 0.05
    priority_score = 0.70
    expiry_explanation = "Standard expiration window."

    if isinstance(expiry_time, datetime.datetime):
        now = datetime.datetime.utcnow()
        hours_until_expiry = (expiry_time - now).total_seconds() / 3600.0

        if hours_until_expiry <= 6:
            expiry_score = 0.10
            priority_score = 0.95
            expiry_explanation = "Food expires soon so priority is increased."
        elif hours_until_expiry <= 12:
            expiry_score = 0.08
            priority_score = 0.85
            expiry_explanation = f"Food expires within {int(hours_until_expiry)} hours."

    # Evaluate each candidate NGO
    for ngo in ngos:
        ngo_name = _get_val(ngo, "name", "Community Food Bank")
        profile = _get_val(ngo, "ngo_profile")
        explanations = []

        ngo_location = _get_val(profile, "location", "City Center") if profile else "City Center"

        # 1. Real Distance Calculation (40% weight)
        ngo_lat = _get_val(profile, "latitude") if profile else None
        ngo_lon = _get_val(profile, "longitude") if profile else None

        if pickup_coords and ngo_lat is not None and ngo_lon is not None:
            ngo_coords = (float(ngo_lat), float(ngo_lon))
            dist_km = haversine(pickup_coords, ngo_coords, unit=Unit.KILOMETERS)
            dist_rounded = round(dist_km, 2)

            if dist_km <= 2.0:
                dist_score = 0.40
                explanations.append(f"NGO '{ngo_name}' is closest to pickup location ({dist_rounded} km away).")
            elif dist_km <= 5.0:
                dist_score = 0.32
                explanations.append(f"NGO '{ngo_name}' is near pickup location ({dist_rounded} km away).")
            elif dist_km <= 15.0:
                dist_score = 0.22
                explanations.append(f"NGO '{ngo_name}' is {dist_rounded} km away from pickup location.")
            else:
                dist_score = 0.10
                explanations.append(f"NGO '{ngo_name}' is located in {ngo_location} ({dist_rounded} km away).")
        else:
            # Graceful fallback if geocoding fails or coordinates missing
            dist_score = 0.25
            explanations.append(f"NGO '{ngo_name}' is located in {ngo_location}.")

        # 2. Food Type Compatibility Score (25% weight)
        accepted_raw = str(_get_val(profile, "accepted_food_type", "Vegetarian,Prepared Meals")) if profile else "Vegetarian"
        accepted_types = [t.strip().lower() for t in accepted_raw.split(",")]

        if any(t in donation_food or donation_food in t for t in accepted_types):
            food_score = 0.25
            explanations.append(f"NGO accepts this food category ({donation_food.title()}).")
        else:
            food_score = 0.08
            explanations.append("NGO handles general food redistribution.")

        # 3. Capacity Score (15% weight)
        capacity = int(_get_val(profile, "capacity", 100)) if profile else 100
        if capacity >= donation_qty:
            capacity_score = 0.15
            explanations.append(f"NGO has sufficient storage capacity ({capacity} items).")
        else:
            capacity_score = 0.05
            explanations.append(f"NGO storage capacity ({capacity} items) is partially filled.")

        # 4. Volunteer Availability Score (10% weight)
        ngo_vols = int(_get_val(profile, "available_volunteers", 0)) if profile else 0
        if ngo_vols >= 10:
            vol_score = 0.10
            explanations.append(f"Multiple volunteers ({ngo_vols}) are available.")
        elif ngo_vols > 0:
            vol_score = 0.07
            explanations.append(f"{ngo_vols} volunteer(s) available.")
        else:
            vol_score = 0.02
            explanations.append("Limited volunteer availability.")

        # Expiry explanation
        explanations.append(expiry_explanation)

        # Total weighted score
        total_score = dist_score + food_score + capacity_score + vol_score + expiry_score
        confidence_score = round(min(max(total_score, 0.50), 0.99), 2)

        # Delivery Risk
        if vol_score >= 0.07:
            delivery_risk = "Low"
        elif vol_score >= 0.04:
            delivery_risk = "Medium"
        else:
            delivery_risk = "High"

        candidate_scores.append({
            "ngo_obj": ngo,
            "ngo_name": ngo_name,
            "confidence_score": confidence_score,
            "priority_score": round(priority_score, 2),
            "delivery_risk": delivery_risk,
            "recommendation_explanation": explanations,
            "_total_score": total_score
        })

    candidate_scores.sort(key=lambda x: x["_total_score"], reverse=True)
    top_candidates = candidate_scores[:2]

    formatted_recommendations = []
    for cand in top_candidates:
        formatted_recommendations.append({
            "ngo": cand["ngo_name"],
            "confidence_score": cand["confidence_score"],
            "priority_score": cand["priority_score"],
            "delivery_risk": cand["delivery_risk"],
            "recommendation_explanation": cand["recommendation_explanation"],
            "_ngo_obj": cand["ngo_obj"]
        })

    return {
        "recommendations": formatted_recommendations
    }
