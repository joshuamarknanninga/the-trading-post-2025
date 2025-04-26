# backend/utils/map_helpers.py

import math

def calculate_distance(lat1: float, lon1: float,
                       lat2: float, lon2: float,
                       unit: str = 'km') -> float:
    """
    Calculate the great-circle distance between two points
    on the Earth specified by latitude/longitude using the Haversine formula.

    Args:
        lat1 (float): Latitude of the first point in decimal degrees.
        lon1 (float): Longitude of the first point in decimal degrees.
        lat2 (float): Latitude of the second point in decimal degrees.
        lon2 (float): Longitude of the second point in decimal degrees.
        unit (str): 'km' for kilometers or 'mi' for miles. Defaults to 'km'.

    Returns:
        float: Distance between the two points in the specified unit.
    """
    # convert decimal degrees to radians
    φ1, λ1, φ2, λ2 = map(math.radians, (lat1, lon1, lat2, lon2))

    # haversine formula
    dφ = φ2 - φ1
    dλ = λ2 - λ1
    a = math.sin(dφ / 2)**2 + math.cos(φ1) * math.cos(φ2) * math.sin(dλ / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Earth radius
    radius_km = 6371.0
    distance_km = radius_km * c

    if unit == 'mi':
        # Convert kilometers to miles
        return distance_km * 0.621371
    return distance_km
