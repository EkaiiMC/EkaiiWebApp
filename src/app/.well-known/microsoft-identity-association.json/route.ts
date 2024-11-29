import {NextResponse} from "next/server";

export async function GET() {
  return NextResponse.json({
    "associatedApplications": [
      {
        "applicationId": process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      }
    ]
  })
}