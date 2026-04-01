"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file); // ✅ IMPORTANT

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("UPLOAD RESULT:", data);
      setResult(data);

    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload to IPFS</h1>

      {/* File Input */}
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <br /><br />

      {/* Upload Button */}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      <br /><br />

      {/* Result Display */}
      {result && (
        <div>
          <h3>Result:</h3>

          {result.cid && (
            <>
              <p><strong>CID:</strong> {result.cid}</p>
              <p>
                <strong>URL:</strong>{" "}
                <a href={result.url} target="_blank">
                  {result.url}
                </a>
              </p>

              {/* Preview if image */}
              <img
                src={result.url}
                alt="Uploaded"
                style={{ maxWidth: "300px", marginTop: "10px" }}
              />
            </>
          )}

          {result.error && (
            <p style={{ color: "red" }}>{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}