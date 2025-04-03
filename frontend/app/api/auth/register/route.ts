import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Parse JSON body
        const body = await request.json();

        // Proxy registration request to your backend API
        const response = await fetch("https://api.carmandi.com.pk/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        // Get response data
        const data = await response.json(); // ✅ Await response.json()

        // Check backend response status
        if (!response.ok) {
            return NextResponse.json({ message: data.message || "Registration failed" }, { status: response.status });
        }

        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
// Note: Ensure that the URL in the fetch call matches your backend endpoint for registration.
// This code handles the registration process by forwarding the request to the backend API and returning the response.
// It also includes error handling for both network and server errors.
// Make sure to test this endpoint thoroughly to ensure it works as expected in your application.
// You can also add additional validation or processing of the request body before sending it to the backend if needed.
// This code is designed to be used in a Next.js API route, which allows you to create serverless functions.