"use client";

import ImageUploader from "@/app/components/admin/ImageUploader";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";


export default function UploadTestPage() {

  const [images, setImages] = useState([]);

  const handleUploadSuccess = async (image) => {
    console.log("✅ Uploaded image:", image);

    setImages((prev) => [...prev, image]);

    try {
      const res = await axios.post("/api/v1/admin/images/save", {
        public_id: image.public_id,
        secure_url: image.secure_url
      }, {
        withCredentials: true
      });

      console.log("✅ Backend response:", res.data);
      alert("Image uploaded & sent to backend successfully");

    } catch (err) {
       console.error("❌ Backend error:", err);
       alert("Failed to send image to backend");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-semibold mb-4">Cloudinary Upload Test</h1>

      <ImageUploader onUploadSuccess={handleUploadSuccess} />

      <div className="mt-6 grid grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <Image
            width={300}
            height={300}
            key={idx}
            src={img.secure_url}
            alt="uploaded"
            className="rounded-md border"
          />
        ))}
      </div>
    </div>
  );
}