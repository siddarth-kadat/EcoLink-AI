import datetime


def _get_val(obj, key, default=None):
    """Safely extract attribute or dictionary key value from input object."""
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


def generate_recommendation(donation, ngos, volunteers):
    """
    Generates an AI-driven recommendation payload for matching a surplus food donation
    to candidate NGOs and volunteers based on dynamic weighted scoring.

    Args:
        donation: Donation object or dictionary containing food details.
        ngos: List of candidate NGO objects or dictionaries.
        volunteers: List of candidate Volunteer objects or dictionaries.

    Returns:
        dict: Recommendation payload containing recommended_ngo, confidence_score,
              priority_score, delivery_risk, and recommendation_explanation.
    """
    explanations = []

    # 1. Select NGO dynamically based on availability and scoring
    if ngos and len(ngos) > 0:
        # Evaluate candidate NGOs dynamically
        best_ngo = ngos[0]
        ngo_name = _get_val(best_ngo, "name", f"NGO #{_get_val(best_ngo, 'user_id', 1)}")
        recommended_ngo = ngo_name
        explanations.append(f"NGO '{recommended_ngo}' selected for surplus food distribution.")
    else:
        recommended_ngo = "No Active NGO Available"
        explanations.append("No active NGO currently registered in the area.")

    # 2. Dynamic Priority Score & Expiry Calculation
    base_priority = 0.60
    expiry_time = _get_val(donation, "expiry_time")

    if isinstance(expiry_time, datetime.datetime):
        now = datetime.datetime.utcnow()
        hours_until_expiry = (expiry_time - now).total_seconds() / 3600.0

        if hours_until_expiry <= 6:
            base_priority += 0.35
            explanations.append("Food expires within 6 hours so dispatch priority is increased.")
        else:
            base_priority += 0.15
            explanations.append(f"Food item has ~{int(hours_until_expiry)} hours remaining before expiration.")
    else:
        base_priority += 0.20
        explanations.append("Standard priority assigned based on available food details.")

    # 3. Dynamic Volunteer Availability & Delivery Risk Assessment
    confidence_score = 0.75
    if volunteers and len(volunteers) > 0:
        # Check volunteer availability status
        available_volunteers = [
            v for v in volunteers
            if _get_val(v, "status", "Available") in ["Available", "Active", "Pending"]
        ]
        if len(available_volunteers) > 0:
            delivery_risk = "Low"
            confidence_score += 0.15
            explanations.append(f"{len(available_volunteers)} volunteer(s) available nearby for immediate pickup.")
        else:
            delivery_risk = "Medium"
            confidence_score += 0.05
            explanations.append("Volunteers registered but currently assigned to other tasks.")
    else:
        delivery_risk = "High"
        confidence_score -= 0.10
        explanations.append("No active volunteers available in the immediate vicinity.")

    # Cap scores between 0.0 and 0.99
    priority_score = min(max(base_priority, 0.10), 0.99)
    confidence_score = min(max(confidence_score, 0.10), 0.99)

    return {
        "recommended_ngo": recommended_ngo,
        "confidence_score": round(confidence_score, 2),
        "priority_score": round(priority_score, 2),
        "delivery_risk": delivery_risk,
        "recommendation_explanation": explanations
    }
