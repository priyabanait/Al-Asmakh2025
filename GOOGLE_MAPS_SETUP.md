# Google Maps Setup for Interactive Property Map

## Overview
The interactive property map feature requires a Google Maps API key to display property markers on the map.

## Setup Instructions

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for enhanced features)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Add API Key to Environment Variables
Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. Restart Development Server
After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## Features
- ✅ Interactive map centered on Qatar (Doha)
- ✅ Property markers with prices displayed as red rounded rectangles
- ✅ Click on property in list to highlight on map
- ✅ Click on map marker to show property details
- ✅ Hover over marker to see property info
- ✅ "More Details" button navigates to property details page
- ✅ Auto-fit bounds to show all properties
- ✅ Smooth animations and transitions

## Property Data Requirements
Properties must have the following fields for markers to appear:
- `latitude` or `lat` - Property latitude coordinate
- `longitude` or `lng` or `lon` - Property longitude coordinate
- `price` or `priceAmount` - Property price for marker label
- `title` or `titleEn` - Property title
- `image` or `images[0]` - Property image for info window
- `location` or `locationLevel1` - Property location text

## Fallback Behavior
If no API key is provided, the map will display a message prompting you to add the API key. The map will not function without a valid API key.

