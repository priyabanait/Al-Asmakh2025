import { NextResponse } from 'next/server';

// Backend API base URL
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://4.213.213.99';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { error: 'Property ID is required' },
                { status: 400 }
            );
        }

        // Build backend URL - nginx will rewrite /api/properties to /api/v1/properties
        const backendUrl = `${BACKEND_URL}/api/properties/${id}`;

        // Make server-side fetch to backend (no CORS issues)
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store', // Always fetch fresh data
        });

        // Get response data
        const contentType = response.headers.get('content-type');
        let responseData;

        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            const text = await response.text();
            try {
                responseData = JSON.parse(text);
            } catch (e) {
                responseData = { error: 'Invalid JSON response', text };
            }
        }

        // Return response
        return NextResponse.json(responseData, {
            status: response.status,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Property by ID proxy error:', error);
        return NextResponse.json(
            { error: 'Proxy request failed', message: error.message },
            { status: 500 }
        );
    }
}

