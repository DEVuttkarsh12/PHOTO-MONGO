import React, { useState } from "react";
import axios from "axios";

const CLOUDINARY_CLOUD_NAME = "duhfb7td7"; // your cloud name here
const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset";

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // const handleUpload = () => {
  //   if (!selectedImage) {
  //     alert("Please select an image first!");
  //     return;
  //   }

  //   setUploading(true);

  //   const formData = new FormData();
  //   formData.append("file", selectedImage);
  //   formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  //   axios
  //     .post(
  //       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
  //       formData
  //     )
  //     .then((res) => {
  //       console.log("Upload successful! Image URL:", res.data.secure_url);
  //       alert("Image uploaded successfully!");
  //       setUploading(false);
  //     })
  //     .catch((err) => {
  //       console.error(
  //         "Upload failed:",
  //         err.response?.data || err.message || err
  //       );
  //       alert("Upload failed! Check console for details.");
  //       setUploading(false);
  //     });
  // };

  const handleUpload = () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    axios
      .post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      )
      .then((res) => {
        const imageUrl = res.data.secure_url;
        console.log("Upload successful! Image URL:", imageUrl);
        alert("Image uploaded successfully!");
        setUploading(false);

        // 🔥 SEND URL TO BACKEND TO SAVE IN MONGODB
        axios
          .post("http://localhost:5000/upload", { imageURL: imageUrl })
          .then(() => {
            console.log("Image URL saved to MongoDB!");
          })
          .catch((err) => {
            console.error("Failed to save URL to DB:", err.message);
            alert("Upload succeeded, but saving to DB failed!");
          });
      })
      .catch((err) => {
        console.error(
          "Upload failed:",
          err.response?.data || err.message || err
        );
        alert("Upload failed! Check console for details.");
        setUploading(false);
      });
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto", textAlign: "center" }}>
      <h2>Image Uploader</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {previewUrl && (
        <div style={{ marginTop: 20 }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: 200, height: "auto", borderRadius: 8 }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: 16,
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}

export default ImageUploader;
