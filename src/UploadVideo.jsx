import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!video) {
      alert("Please select a video file");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("video", video);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/videos/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-200 via-pink-100 to-yellow-100 p-4">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
          Upload Your Video
        </h2>

        <form onSubmit={handleUpload} className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
          ></textarea>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            required
            className="w-full text-gray-700 border border-gray-300 p-3 rounded-2xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-2xl hover:from-purple-600 hover:to-blue-500 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Upload
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-gray-700 font-medium">{message}</p>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline hover:text-blue-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
