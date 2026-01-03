# API Configuration - Updated 2025-01-01

## ✅ Changes Made

1. **Production URL Updated**: Changed from `http://40.81.255.90` to `http://4.213.213.99`
2. **Dynamic API Calls**: Removed hardcoded dummy data, now uses API by default
3. **Manual Data Fallback**: Added fallback mechanism for testing when backend is down
4. **Environment Variables**: Made configuration via `.env.local` file

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API URL
# Production: http://4.213.213.99
# Local: http://localhost:3002
NEXT_PUBLIC_API_URL=http://4.213.213.99

# Use dummy data instead of API (set to 'true' for testing when backend is down)
# When false, API will be used. If API fails, it will fallback to manual data from localStorage
NEXT_PUBLIC_USE_DUMMY_DATA=false
```

## 📡 API Endpoints

The frontend now calls:
- **Properties API**: `http://4.213.213.99/api/properties`
- **Health Check**: `http://4.213.213.99/api/properties/health`

The nginx gateway automatically rewrites `/api/properties` to `/api/v1/properties` for the Spring Boot backend.

## 🧪 Manual Data Injection (For Testing)

When the backend is down and you want to test the UI with real data:

### Method 1: Using Browser Console

1. Get data from API:
   ```bash
   curl http://4.213.213.99/api/properties > data.json
   ```

2. Open browser console and run:
   ```javascript
   // Copy the data from data.json
   const data = {
     properties: [...], // Your properties array
     pagination: {...}  // Your pagination object
   };
   
   localStorage.setItem('manual_properties_data', JSON.stringify(data));
   console.log('✅ Manual data set! Refresh the page.');
   ```

3. Refresh the page - the app will use the manual data automatically

### Method 2: Using Helper Function

```javascript
import { setManualPropertiesData } from './utils/manualDataHelper';

const data = {
  properties: [...],
  pagination: { total: 6, page: 1, limit: 10, pages: 1 }
};

setManualPropertiesData(data);
```

### Clear Manual Data

```javascript
import { clearManualPropertiesData } from './utils/manualDataHelper';
clearManualPropertiesData();
```

Or in browser console:
```javascript
localStorage.removeItem('manual_properties_data');
```

## 🔄 How It Works

1. **Default**: Uses API from `http://4.213.213.99/api/properties`
2. **If API fails**: Automatically falls back to manual data from `localStorage` (if available)
3. **If both fail**: Shows error message

## ✅ Verification

Test the API is working:
```bash
curl http://4.213.213.99/api/properties
```

You should see JSON response with properties array and pagination object.

## 📝 Notes

- The old hardcoded `DUMMY_PROPERTIES` array is still in the code but only used if `NEXT_PUBLIC_USE_DUMMY_DATA=true`
- Manual data in localStorage takes precedence over dummy data when API fails
- All API calls go through the Next.js proxy when on HTTPS (Vercel) to avoid mixed content issues

