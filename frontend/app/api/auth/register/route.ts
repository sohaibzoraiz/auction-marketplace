import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        console.log("Request received at /api/auth/register");

        const formData = await request.formData();
        console.log("FormData keys:", Array.from(formData.keys()));

        const body: { [key: string]: string | Blob } = {};
        formData.forEach((value, key) => {
            body[key] = value;
        });

        console.log(body); // Log the data to see how it looks

        formData.forEach((value, key) => {
            if (value instanceof File) {
                console.log(`${key}: [File] ${value.name}`);
            } else {
                console.log(`${key}: ${value}`);
            }
        });

        const response = await fetch("https://api.carmandi.com.pk/auth/register", {
            method: "POST",
            body: formData, // Send the form data as is
        });
        
        console.log("Response status:", response.status);  // Log the status code
        
        // Log the raw response body for inspection
        const textResponse = await response.text(); // Use .text() to get the raw response body
        console.log("Raw response:", textResponse);
        
        let data;
        try {
            data = JSON.parse(textResponse); // Try parsing the response as JSON
        } catch (e) {
            console.error("Error parsing response as JSON:", e);
        }
        
        if (!response.ok) {
            return NextResponse.json({ message: data?.message || "Registration failed" }, { status: response.status });
        }
        
        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error("Error:", error);  // Add more specific error details here
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}