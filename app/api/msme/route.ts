import { db } from "../../../lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// ✅ GET all MSMEs
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "msmes"));

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("MSME GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch MSMEs" },
      { status: 500 }
    );
  }
}

// ✅ POST new MSME
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const docRef = await addDoc(collection(db, "msmes"), {
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error("MSME POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create MSME" },
      { status: 500 }
    );
  }
}