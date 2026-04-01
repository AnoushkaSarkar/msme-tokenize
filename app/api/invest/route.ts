import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { wallet, msmeId, amount } = await req.json();

    // ✅ 1. Validation
    if (!wallet || !msmeId || !amount) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // ✅ 2. Get MSME
    const msmeRef = doc(db, "msmes", msmeId);
    const msmeSnap = await getDoc(msmeRef);

    if (!msmeSnap.exists()) {
      return NextResponse.json(
        { error: "MSME not found" },
        { status: 404 }
      );
    }

    const msmeData = msmeSnap.data();

    // ✅ 3. Rules
    if (amount < 1000) {
      return NextResponse.json(
        { error: "Minimum investment is ₹1000" },
        { status: 400 }
      );
    }

    if (msmeData.fundedAmount >= msmeData.targetAmount) {
      return NextResponse.json(
        { error: "Funding already completed" },
        { status: 400 }
      );
    }

    if (msmeData.fundedAmount + amount > msmeData.targetAmount) {
      return NextResponse.json(
        { error: "Investment exceeds target amount" },
        { status: 400 }
      );
    }

    // ✅ 4. Ownership
    const ownership =
      (amount / msmeData.targetAmount) * msmeData.equityOffered;

    // ✅ 5. Tokens (NEW 🔥)
    const tokens = ownership * 100;

    // ✅ 6. Update MSME
    const newFunding = (msmeData.fundedAmount || 0) + amount;

    await updateDoc(msmeRef, {
      fundedAmount: newFunding,
    });

    // ✅ 7. Investor update
    const investorRef = doc(db, "investors", wallet);
    const investorSnap = await getDoc(investorRef);

    let totalInvested = amount;
    let totalOwnership = ownership;
    let totalTokens = tokens;

    if (investorSnap.exists()) {
      const data = investorSnap.data();

      totalInvested = (data.totalInvested || 0) + amount;
      totalOwnership = (data.totalOwnership || 0) + ownership;
      totalTokens = (data.totalTokens || 0) + tokens;

      await updateDoc(investorRef, {
        totalInvested,
        totalOwnership,
        totalTokens,
      });
    } else {
      await setDoc(investorRef, {
        walletAddress: wallet,
        totalInvested,
        totalOwnership,
        totalTokens,
      });
    }

    // ✅ 8. Transaction log
    await addDoc(collection(db, "transactions"), {
      wallet,
      msmeId,
      amount,
      ownership,
      tokens,
      createdAt: new Date(),
    });

    // ✅ 9. Response
    return NextResponse.json({
      message: "Investment successful",
      ownershipGained: ownership,
      tokensReceived: tokens,
    });

  } catch (error) {
    console.error("INVEST ERROR:", error);

    return NextResponse.json(
      { error: "Investment failed" },
      { status: 500 }
    );
  }
}