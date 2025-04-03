import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Parse the form data from the request
        const formData = await request.formData();

        // Convert form data into an object for logging (optional, but useful for debugging)
        const body: { [key: string]: string | Blob } = {};
        formData.forEach((value, key) => {
            body[key] = value;
        });

        console.log(body); // Log the data to see how it looks

        // Proxy registration request to your backend API
        const response = await fetch("https://api.carmandi.com.pk/auth/register", {
            method: "POST",
            body: formData, // Send the form data as is, no need to stringify
        });

        // Get response data
        const data = await response.json(); // ✅ Await response.json()

        // Check the backend response status
        if (!response.ok) {
            return NextResponse.json({ message: data.message || "Registration failed" }, { status: response.status });
        }

        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
