import { NextResponse } from 'next/server';

// Backend API base URL
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://4.213.213.99';

export async function GET(request) {
    try {
        // Get query parameters from request
        const { searchParams } = new URL(request.url);

        // Build query string
        const queryString = searchParams.toString();

        // Build backend URL - nginx will rewrite /api/properties to /api/v1/properties
        const backendUrl = `${BACKEND_URL}/api/properties${queryString ? `?${queryString}` : ''}`;

        // Make server-side fetch to backend (no CORS issues)
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            // No credentials needed for public API
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

        // Return response with proper headers
        return NextResponse.json(responseData, {
            status: response.status,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Properties proxy error:', error);
        return NextResponse.json(
            {
                error: 'Proxy request failed',
                message: error.message,
                properties: [],
                pagination: { total: 0, page: 1, limit: 10, pages: 0 }
            },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS preflight (though not needed for same-origin)
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

