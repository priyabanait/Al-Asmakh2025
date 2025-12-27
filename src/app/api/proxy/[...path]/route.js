import { NextResponse } from 'next/server';

// Backend API base URL
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://40.81.255.90';

export async function GET(request, { params }) {
    return handleRequest(request, params, 'GET');
}

export async function POST(request, { params }) {
    return handleRequest(request, params, 'POST');
}

export async function PUT(request, { params }) {
    return handleRequest(request, params, 'PUT');
}

export async function DELETE(request, { params }) {
    return handleRequest(request, params, 'DELETE');
}

export async function PATCH(request, { params }) {
    return handleRequest(request, params, 'PATCH');
}

async function handleRequest(request, params, method) {
    try {
        // Reconstruct the path
        const path = params.path ? params.path.join('/') : '';
        const url = new URL(request.url);
        const queryString = url.search;

        // Build the backend URL
        const backendUrl = `${BACKEND_URL}/${path}${queryString}`;

        // Get request headers
        const headers = new Headers();

        // Forward important headers (excluding host and origin)
        const forwardHeaders = ['authorization', 'content-type', 'accept', 'user-agent'];
        request.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (forwardHeaders.includes(lowerKey) || lowerKey.startsWith('x-')) {
                headers.set(key, value);
            }
        });

        // Prepare request options
        const options = {
            method,
            headers,
        };

        // Add body for POST, PUT, PATCH
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            try {
                const body = await request.text();
                if (body) {
                    options.body = body;
                }
            } catch (e) {
                // No body or error reading body
            }
        }

        // Make request to backend
        const response = await fetch(backendUrl, options);

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
                responseData = text;
            }
        }

        // Return response with CORS headers
        return NextResponse.json(responseData, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true',
            },
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Proxy request failed', message: error.message },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
        },
    });
}

