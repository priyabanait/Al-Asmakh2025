"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyBS4N8g1D0VhjnOHwSMWRdz1JbTmEUg8Gw";

export default function InteractivePropertyMap({
  properties = [],
  selectedPropertyId = null,
  onPropertyClick = null,
  onMapReady = null
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowsRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);

  // Qatar center coordinates (Doha)
  const QATAR_CENTER = { lat: 25.2854, lng: 51.5310 };

  // Load Google Maps script
  useEffect(() => {
    if (typeof window === 'undefined' || window.google) {
      setMapLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      // If script exists, check if Google Maps is loaded
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        return;
      }
      // If script exists but not loaded yet, wait for it
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          setMapLoaded(true);
          clearInterval(checkGoogle);
        }
      }, 100);
      return () => clearInterval(checkGoogle);
    }

    // Use the hardcoded API key directly (ensure it's always used)
    const apiKey = GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key is missing');
      setMapLoaded(true);
      return;
    }


    const script = document.createElement('script');
    // Use the API key directly - make sure it's properly encoded
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps script loaded successfully');
      setMapLoaded(true);
    };
    script.onerror = (error) => {
      console.error('Failed to load Google Maps:', error);
      setMapLoaded(true); // Still try to initialize with fallback
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        // Don't remove as it might be used by other components
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google) return;

    // Initialize map centered on Qatar
    const map = new window.google.maps.Map(mapRef.current, {
      center: QATAR_CENTER,
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Notify parent when map tiles are loaded
    map.addListener('tilesloaded', () => {
      if (onMapReady) {
        onMapReady();
      }
    });

    // Fit bounds to show all properties if available
    if (properties.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasValidCoords = false;

      properties.forEach(property => {
        const lat = property.latitude || property.lat;
        const lng = property.longitude || property.lng || property.lon;

        if (lat && lng) {
          bounds.extend({ lat: parseFloat(lat), lng: parseFloat(lng) });
          hasValidCoords = true;
        }
      });

      if (hasValidCoords) {
        map.fitBounds(bounds);
        // Don't zoom in too much if only one property
        if (properties.length === 1) {
          map.setZoom(15);
        }
      }
    }
  }, [mapLoaded, properties.length, onMapReady]);

  // Create markers for properties
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || properties.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker) marker.setMap(null);
    });
    infoWindowsRef.current.forEach(infoWindow => {
      if (infoWindow) infoWindow.close();
    });
    markersRef.current = [];
    infoWindowsRef.current = [];

    // Helper function to create marker for a property
    const createMarkerForProperty = (property, position) => {

      // Create custom marker with price
      const price = property.price || property.priceAmount || 'N/A';
      const priceText = typeof price === 'number' ? price.toLocaleString() : price;

      // Create custom marker icon using SVG
      const markerIcon = {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="80" height="32" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="32" rx="6" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
            <text x="40" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" 
                  fill="white" text-anchor="middle" dominant-baseline="middle">
              ﷼ ${priceText}
            </text>
          </svg>
        `)}`,
        scaledSize: new window.google.maps.Size(80, 32),
        anchor: new window.google.maps.Point(40, 16),
      };

      // Create marker
      const marker = new window.google.maps.Marker({
        position: position,
        map: mapInstanceRef.current,
        icon: markerIcon,
        title: property.title || property.titleEn || 'Property',
        animation: property.id === selectedPropertyId ? window.google.maps.Animation.BOUNCE : null,
        zIndex: property.id === selectedPropertyId ? 1000 : 1,
      });

      // Create info window content
      const imageUrl = property.image || (property.images && property.images[0]) || "/placeholder-property.jpg";
      const propertyTitle = property.title || property.titleEn || 'Property';
      
      // Build address from locationLevel1 and locationLevel2
      const locationParts = [];
      if (property.locationLevel1) locationParts.push(property.locationLevel1);
      if (property.locationLevel2 && property.locationLevel2 !== property.locationLevel1) {
        locationParts.push(property.locationLevel2);
      }
      if (property.locationLevel3 && !locationParts.includes(property.locationLevel3)) {
        locationParts.push(property.locationLevel3);
      }
      const propertyLocation = locationParts.length > 0 
        ? locationParts.join(', ') 
        : (property.location || 'Location not specified');
      
      const propertyPrice = property.price || property.priceAmount || 'N/A';
      const formattedPrice = typeof propertyPrice === 'number'
        ? propertyPrice.toLocaleString()
        : propertyPrice;

      const infoContent = `
        <div style="
          width: 300px;
          max-width: 90vw;
          font-family: Arial, sans-serif;
        ">
          <div style="
            background-color: #333333;
            color: white;
            padding: 12px;
            font-weight: bold;
            font-size: 14px;
            border-radius: 4px 4px 0 0;
            position: relative;
          ">
            ${propertyTitle}
            <span 
              onclick="
                const infoWindow = window.currentInfoWindow_${property.id};
                if (infoWindow) infoWindow.close();
              "
              style="
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                font-weight: bold;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                line-height: 1;
              "
            >×</span>
          </div>
          <div style="padding: 0;">
            <img 
              src="${imageUrl}" 
              alt="${propertyTitle}"
              style="
                width: 100%;
                height: 150px;
                object-fit: cover;
                display: block;
              "
              onerror="this.src='/placeholder-property.jpg'"
            />
          </div>
          <div style="padding: 12px; background: white;">
            <div style="
              color: #333333;
              font-size: 12px;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span>📍</span>
              <span>${propertyLocation}</span>
            </div>
            <div style="
              color: #333333;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 12px;
            ">
              ﷼ ${formattedPrice}
            </div>
            <a 
              href="/propertydetails?id=${property.id}"
              onclick="event.stopPropagation(); window.location.href='/propertydetails?id=${property.id}'"
              style="
                display: block;
                background-color: #333333;
                color: white;
                text-align: center;
                padding: 10px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                font-size: 12px;
                margin-top: 8px;
              "
              onmouseover="this.style.backgroundColor='#555555'"
              onmouseout="this.style.backgroundColor='#333333'"
            >
              MORE DETAILS >
            </a>
          </div>
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
        maxWidth: 300,
      });

      // Store reference for close button
      if (typeof window !== 'undefined') {
        window[`currentInfoWindow_${property.id}`] = infoWindow;
      }

      // Show info window on marker click
      marker.addListener('click', () => {
        // Close all other info windows
        infoWindowsRef.current.forEach(iw => {
          if (iw && iw !== infoWindow) iw.close();
        });

        infoWindow.open(mapInstanceRef.current, marker);

        // Center map on marker
        mapInstanceRef.current.setCenter(position);
        mapInstanceRef.current.setZoom(15);

        // Call onPropertyClick if provided
        if (onPropertyClick) {
          onPropertyClick(property.id);
        }
      });

      // Show info window on hover (with delay) - shows price and address
      let hoverTimeout;
      marker.addListener('mouseover', () => {
        hoverTimeout = setTimeout(() => {
          infoWindow.open(mapInstanceRef.current, marker);
          setHoveredPropertyId(property.id);
        }, 300);
      });

      marker.addListener('mouseout', () => {
        clearTimeout(hoverTimeout);
        // Close info window on mouseout for better UX
        infoWindow.close();
        setHoveredPropertyId(null);
      });

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
    }; // End of createMarkerForProperty function

    // Create markers for each property
    properties.forEach((property) => {
      let lat = property.latitude || property.lat;
      let lng = property.longitude || property.lng || property.lon;

      // If no coordinates, try to geocode using locationLevel1 and locationLevel2
      if (!lat || !lng) {
        // Build address string from location levels
        const locationParts = [];
        if (property.locationLevel1) locationParts.push(property.locationLevel1);
        if (property.locationLevel2 && property.locationLevel2 !== property.locationLevel1) {
          locationParts.push(property.locationLevel2);
        }
        if (property.locationLevel3 && !locationParts.includes(property.locationLevel3)) {
          locationParts.push(property.locationLevel3);
        }
        
        if (locationParts.length > 0) {
          const address = locationParts.join(', ') + ', Qatar';
          // Use Google Geocoding API to get coordinates
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              const position = {
                lat: location.lat(),
                lng: location.lng()
              };
              createMarkerForProperty(property, position);
            } else {
              console.warn(`Geocoding failed for property ${property.id}: ${status}`);
            }
          });
          // Skip this iteration, will create marker in geocoding callback
          return;
        } else {
          // No location data available, skip this property
          console.warn(`Property ${property.id} has no coordinates or location data`);
          return;
        }
      }

      const position = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };

      createMarkerForProperty(property, position);
    });

    // Center on selected property
    if (selectedPropertyId) {
      const selectedProperty = properties.find(p => p.id === selectedPropertyId);
      if (selectedProperty) {
        const lat = selectedProperty.latitude || selectedProperty.lat;
        const lng = selectedProperty.longitude || selectedProperty.lng || selectedProperty.lon;
        if (lat && lng) {
          mapInstanceRef.current.setCenter({
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          });
          mapInstanceRef.current.setZoom(15);
        }
      }
    }
  }, [properties, selectedPropertyId, onPropertyClick]);

  // Show loading state
  if (!mapLoaded) {
    return (
      <div className="w-full h-full relative bg-gray-200 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mb-2"></div>
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  // Fallback if Google Maps API key is not available or failed to load
  if (!window.google || !window.google.maps) {
    return (
      <div className="w-full h-full relative bg-gray-200 flex items-center justify-center">
        <div className="text-center p-4 max-w-md">
          <p className="text-gray-700 font-semibold mb-2">Map Unavailable</p>
          <p className="text-gray-600 text-sm mb-4">
            Google Maps API key is required to display the interactive map.
          </p>
          <p className="text-gray-500 text-xs">
            Please add <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your environment variables.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            See GOOGLE_MAPS_SETUP.md for setup instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />

      {/* Custom styles for info windows */}
      <style jsx global>{`
        .gm-style-iw-d {
          overflow: hidden !important;
        }
        .gm-style-iw-c {
          padding: 0 !important;
          border-radius: 4px !important;
        }
        .gm-style-iw-t {
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}

