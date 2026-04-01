import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    // ✅ Accept Blob instead of strict File
    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    console.log("FILE RECEIVED:", file);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const response = await fetch("https://api.nft.storage/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NFT_STORAGE_API_KEY}`,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });

    const data = await response.json();

    console.log("NFT RESPONSE:", data);

    if (!data.ok) {
      return NextResponse.json(
        { error: "NFT upload failed", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      cid: data.value.cid,
      url: `https://ipfs.io/ipfs/${data.value.cid}`,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}