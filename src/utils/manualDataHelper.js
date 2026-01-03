/**
 * Helper utility for manual data injection when backend is down
 * 
 * Usage:
 * 1. Get data from API: curl http://4.213.213.99/api/properties > data.json
 * 2. In browser console, run:
 *    import { setManualPropertiesData } from './utils/manualDataHelper';
 *    const data = { properties: [...], pagination: {...} }; // from data.json
 *    setManualPropertiesData(data);
 * 
 * Or directly in browser console:
 * localStorage.setItem('manual_properties_data', JSON.stringify({ properties: [...], pagination: {...} }));
 */

/**
 * Set manual properties data for testing when backend is down
 * @param {Object} data - Data object with properties array and pagination
 * @param {Array} data.properties - Array of property objects
 * @param {Object} data.pagination - Pagination object
 */
export const setManualPropertiesData = (data) => {
    if (typeof window === 'undefined') {
        console.error('setManualPropertiesData can only be called in browser');
        return;
    }
    
    try {
        const dataString = JSON.stringify(data);
        localStorage.setItem('manual_properties_data', dataString);
        console.log('✅ Manual properties data set successfully');
        console.log(`   Properties: ${data.properties?.length || 0}`);
        console.log(`   Total: ${data.pagination?.total || 0}`);
    } catch (error) {
        console.error('Error setting manual data:', error);
    }
};

/**
 * Get manual properties data
 * @returns {Object|null} Manual data object or null if not set
 */
export const getManualPropertiesData = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    
    try {
        const dataString = localStorage.getItem('manual_properties_data');
        if (dataString) {
            return JSON.parse(dataString);
        }
    } catch (error) {
        console.error('Error getting manual data:', error);
    }
    
    return null;
};

/**
 * Clear manual properties data
 */
export const clearManualPropertiesData = () => {
    if (typeof window === 'undefined') {
        return;
    }
    
    localStorage.removeItem('manual_properties_data');
    console.log('✅ Manual properties data cleared');
};

/**
 * Check if manual data is available
 * @returns {boolean} True if manual data exists
 */
export const hasManualPropertiesData = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    
    return localStorage.getItem('manual_properties_data') !== null;
};
