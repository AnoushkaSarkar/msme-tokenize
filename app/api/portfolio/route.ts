import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet required" },
        { status: 400 }
      );
    }

    // ✅ 1. Get investor
    const investorRef = doc(db, "investors", wallet);
    const investorSnap = await getDoc(investorRef);

    if (!investorSnap.exists()) {
      return NextResponse.json({
        totalInvested: 0,
        investments: [],
      });
    }

    const investorData = investorSnap.data();

    // ✅ 2. Get transactions
    const q = query(
      collection(db, "transactions"),
      where("wallet", "==", wallet)
    );

    const snapshot = await getDocs(q);

    const investments: any[] = [];

    // ✅ 3. Fetch MSME details for each transaction
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      const msmeRef = doc(db, "msmes", data.msmeId);
      const msmeSnap = await getDoc(msmeRef);

      investments.push({
        ...data,
        msme: msmeSnap.exists() ? msmeSnap.data() : null,
      });
    }

    // ✅ 4. Return response
    return NextResponse.json({
      totalInvested: investorData.totalInvested || 0,
      investments,
    });

  } catch (error) {
    console.error("PORTFOLIO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}