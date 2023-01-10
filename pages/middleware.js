import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'


export async function middleware(req) {

    // Token will exist if the user is authenticated
    const token = await getToken({ req, secret: process.env.JWT_SECRET })

    const { pathname } = req.nextUrl();


    //Allow the request if the following conditions are met:
    // 1. Its a request for next-auth session and provider fetching
    // 2. The token exists

    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }

    //Redirect to login page if the token does not exist AND are requesting a protected route

    if (!token && pathname !== "/login") {
        return NextResponse.redirect("/login");
    }


}

