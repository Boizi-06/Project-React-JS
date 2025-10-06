import React, { useState } from "react";

const MultipleUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    setFiles(newFiles);

    // Tạo preview cho ảnh
    const previewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  // Upload ảnh lên Cloudinary
  const handleUpload = async () => {
    const formDataList = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "boizi2006"); // thay bằng preset của bạn
      return formData;
    });

    try {
      const uploadPromises = formDataList.map((formData) =>
        fetch("https://api.cloudinary.com/v1_1/dnjubw5ta/image/upload", {
          method: "POST",
          body: formData,
        }).then((res) => res.json())
      );

      const results = await Promise.all(uploadPromises);
      console.log("Upload success:", results);
      alert("Upload thành công!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload thất bại!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>
        Hãy tạo một ứng dụng có thể upload nhiều ảnh lên cloudinary cùng 1 lúc
      </h3>

      <input type="file" multiple onChange={handleFileChange} />
      <span style={{ marginLeft: 10 }}>{files.length} files</span>
      <button onClick={handleUpload} style={{ marginLeft: 10 }}>
        Upload
      </button>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        {previews.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`preview-${idx}`}
            style={{ width: 150, height: 150, objectFit: "cover" }}
          />
        ))}
      </div>
    </div>
  );
};

export default MultipleUpload;
