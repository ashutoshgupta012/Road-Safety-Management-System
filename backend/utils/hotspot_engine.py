import math
from typing import List, Dict, Any

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points in kilometers."""
    R = 6371.0 # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def compute_hotspots(accidents: List[Dict[str, Any]], cluster_threshold_km: float = 0.6) -> List[Dict[str, Any]]:
    """
    Cluster accident records geographically to detect high-frequency accident hotspots.
    Urban junction threshold: 0.6 km (600 meters) around intersections.
    Computes risk score: (Accidents * 10) + (Fatalities * 35) + (Injuries * 15).
    """
    if not accidents:
        return []

    clusters: List[Dict[str, Any]] = []

    for acc in accidents:
        lat = acc["latitude"]
        lng = acc["longitude"]
        matched_cluster = None

        # Check if accident falls into an existing cluster within threshold
        for cluster in clusters:
            dist = haversine_distance_km(lat, lng, cluster["center_lat"], cluster["center_lng"])
            if acc["location_name"].lower().strip() == cluster["location_name"].lower().strip() or dist <= cluster_threshold_km:
                matched_cluster = cluster
                break

        if matched_cluster:
            matched_cluster["accidents"].append(acc)
            # Recompute centroid
            all_lats = [a["latitude"] for a in matched_cluster["accidents"]]
            all_lngs = [a["longitude"] for a in matched_cluster["accidents"]]
            matched_cluster["center_lat"] = sum(all_lats) / len(all_lats)
            matched_cluster["center_lng"] = sum(all_lngs) / len(all_lngs)
        else:
            clusters.append({
                "location_name": acc["location_name"],
                "center_lat": lat,
                "center_lng": lng,
                "accidents": [acc]
            })

    # Filter and rank clusters that have 2 or more accidents, or severe single events
    hotspot_results = []
    for c in clusters:
        total_accidents = len(c["accidents"])
        fatal_count = sum(a.get("casualties_count", 0) for a in c["accidents"])
        injury_count = sum(a.get("injuries_count", 0) for a in c["accidents"])
        
        # Risk score calculation
        risk_score = (total_accidents * 10) + (fatal_count * 35) + (injury_count * 15)
        
        # Determine risk classification
        if risk_score >= 60 or fatal_count >= 1:
            risk_level = "CRITICAL"
            color = "#ef4444" # Red
        elif risk_score >= 30 or total_accidents >= 2:
            risk_level = "HIGH"
            color = "#f97316" # Orange
        elif risk_score >= 15:
            risk_level = "MODERATE"
            color = "#eab308" # Yellow
        else:
            risk_level = "LOW"
            color = "#3b82f6" # Blue

        # Aggregate causes
        causes = {}
        for a in c["accidents"]:
            cause = a.get("possible_cause") or "Unknown"
            causes[cause] = causes.get(cause, 0) + 1
        top_cause = max(causes, key=causes.get) if causes else "Multiple Factors"

        # Action recommendation engine
        recommendation = "Standard traffic monitoring."
        if "Over-speeding" in causes:
            recommendation = "Deploy radar speed cameras, reduce speed limit, and place rumble strips."
        elif "Pothole / Road Defect" in causes or "Slippery" in causes:
            recommendation = "Urgent road surface resurfacing, drainage clearance, and hazard signage."
        elif "Signal Jump" in causes:
            recommendation = "Install automated red-light enforcement cameras and increase signal clearance intervals."
        elif "Weather / Low Visibility" in causes or "Night / Dark" in str(c["accidents"]):
            recommendation = "Install high-mast LED solar lighting, retro-reflective lane studs (cats-eyes), and fog flashers."
        elif fatal_count > 0:
            recommendation = "MoRTH Blackspot protocol: Engineering inspection, crash barrier installation, and dedicated FOB."

        hotspot_results.append({
            "id": len(hotspot_results) + 1,
            "location_name": c["location_name"],
            "latitude": round(c["center_lat"], 5),
            "longitude": round(c["center_lng"], 5),
            "total_accidents": total_accidents,
            "fatal_count": fatal_count,
            "injury_count": injury_count,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "color": color,
            "primary_cause": top_cause,
            "recommended_action": recommendation,
            "accident_ids": [a["id"] for a in c["accidents"]]
        })

    # Sort descending by risk score
    hotspot_results.sort(key=lambda x: x["risk_score"], reverse=True)
    return hotspot_results
