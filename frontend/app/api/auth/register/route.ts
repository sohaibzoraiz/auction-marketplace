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
