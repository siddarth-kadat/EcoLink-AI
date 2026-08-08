import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issues with Vite/Webpack builds
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LeafletMap = ({ pickupLoc, deliveryLoc, courierStatus }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    // Hubballi default coordinates
    const pickupCoords = [15.3647, 75.1240];
    const deliveryCoords = [15.3720, 75.1380];
    
    let courierCoords = [...pickupCoords];
    if (courierStatus === 'Delivered') {
        courierCoords = [...deliveryCoords];
    } else if (courierStatus === 'Picked Up') {
        courierCoords = [(pickupCoords[0] + deliveryCoords[0]) / 2, (pickupCoords[1] + deliveryCoords[1]) / 2];
    }

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize map
        mapRef.current = L.map(mapContainerRef.current, {
            center: [(pickupCoords[0] + deliveryCoords[0]) / 2, (pickupCoords[1] + deliveryCoords[1]) / 2],
            zoom: 13,
            zoomControl: false,
            attributionControl: false
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);

        // Add Zoom Control at top-right
        L.control.zoom({ position: 'topright' }).addTo(mapRef.current);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        // Custom Icons
        const restaurantIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #EF6C00; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; font-weight: bold; font-size: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.15)">R</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const ngoIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #064E3B; color: white; width: 42px; height: 30px; border-radius: 15px; display: flex; align-items: center; justify-content: center; border: 2px solid white; font-weight: bold; font-size: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.15)">NGO</div>`,
            iconSize: [42, 30],
            iconAnchor: [21, 15]
        });

        const courierIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #0B1026; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.25)">🏍️</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        // Add Markers
        const m1 = L.marker(pickupCoords, { icon: restaurantIcon }).addTo(mapRef.current)
            .bindPopup(`<b>Pickup Location</b><br/>${pickupLoc || 'Restaurant partner'}`);
        
        const m2 = L.marker(deliveryCoords, { icon: ngoIcon }).addTo(mapRef.current)
            .bindPopup(`<b>NGO Destination</b><br/>${deliveryLoc || 'Community shelter'}`);

        markersRef.current.push(m1, m2);

        // Add courier marker if task is Claimed/Picked Up/In progress
        if (courierStatus !== 'Available' && courierStatus !== 'Pending') {
            const m3 = L.marker(courierCoords, { icon: courierIcon }).addTo(mapRef.current)
                .bindPopup(`<b>Courier Position</b><br/>Status: ${courierStatus}`);
            markersRef.current.push(m3);
        }

        // Draw Polyline route connecting them
        const routeLine = L.polyline([pickupCoords, deliveryCoords], {
            color: '#4F7DF3',
            weight: 4,
            dashArray: '5, 8',
            opacity: 0.8
        }).addTo(mapRef.current);
        markersRef.current.push(routeLine);

        // Auto fit bounds to show all markers
        const group = L.featureGroup([m1, m2]);
        mapRef.current.fitBounds(group.getBounds().pad(0.25));

    }, [pickupLoc, deliveryLoc, courierStatus]);

    return (
        <div 
            ref={mapContainerRef} 
            className="w-full h-full rounded-2xl relative z-10 overflow-hidden border border-slate-200/50 bg-slate-50"
            style={{ minHeight: '320px' }}
        />
    );
};

export default LeafletMap;
