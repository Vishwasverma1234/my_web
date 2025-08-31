import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. User might not be logged in.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/videos/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyVideos();
  }, []);

  if (loading) return <p>Loading your videos...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📹 My Uploaded Videos</h2>

      {videos.length === 0 ? (
        <p>You haven't uploaded any videos yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {videos.map((video) => (
            <div
              key={video._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{video.title}</h3>
              <p>{video.description}</p>

              <video width="400" controls>
                <source src={video.videoUrl} type={video.mimeType || "video/mp4"} />
                Your browser does not support the video tag.
              </video>

              <p style={{ fontSize: "12px", color: "gray" }}>
                Uploaded on {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
