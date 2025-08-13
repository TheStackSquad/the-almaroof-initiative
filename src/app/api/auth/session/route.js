// //src/app/api/auth/session/route.js
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyAuthToken } from "@/lib/authService/token";
// import { supabase } from "@/utils/supabase/supaClient";

// export async function GET(request) {
//   try {
//     const cookieStore = await cookies();
//     const authToken = cookieStore.get("authToken");

//     if (!authToken || !authToken.value) {
//       console.warn("No authentication token found in cookies.");
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const decodedToken = verifyAuthToken(authToken.value);
//     const userId = decodedToken.userId;

//     const { data: user, error: dbError } = await supabase
//       .from("users")
//       .select("*")
//       .eq("id", userId)
//       .single();

//     if (dbError || !user) {
//       console.error("Database error or user not found:", dbError);
//       return NextResponse.json(
//         { message: "User not found or database error" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ user }, { status: 200 });
//   } catch (error) {
//     console.error("🚨 JWT verification failed:", error.message);

//     // Also await cookies() in the catch block
//     const cookieStore = await cookies();
//     cookieStore.delete("authToken");

//     return NextResponse.json(
//       { message: "Unauthorized: Invalid or expired token" },
//       { status: 401 }
//     );
//   }
// }