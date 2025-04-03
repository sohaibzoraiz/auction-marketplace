import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Parse form data if files are being uploaded
        const formData = await request.formData();
        
        // Convert form data into an object (you can modify this according to your data structure)
        const body: { [key: string]: string | Blob } = {};
        formData.forEach((value, key) => {
            body[key] = value;
        });

        console.log(body); // Log to see if the data is structured correctly

        // Proxy registration request to your backend API
        const response = await fetch("https://api.carmandi.com.pk/auth/register", {
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            body: formData, // Send the form data as it is, no need to stringify
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
