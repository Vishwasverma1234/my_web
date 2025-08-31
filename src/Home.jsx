import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa"; // ✅ Hamburger icon
import "./index.css";
import login from "./login";
import { useNavigate } from "react-router-dom";


function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ state for sidebar toggle
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/videos"); // Your backend route
        const data = await res.json();
        setVideos(data.items || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-50 to-yellow-50 flex">
      {/* ✅ Side Menu */}
      <aside
        className={`${sidebarOpen ? "w-60" : "w-0"
          } h-screen bg-gray-900 text-white fixed left-0 top-0 pt-6 flex flex-col shadow-lg z-40 transition-all duration-300 overflow-hidden`}
      >
        <nav className="flex-1 p-4 space-y-3">
          <Link
            to="/login"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            login
          </Link>
          <Link
            to="/profile"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Profile
          </Link>
          <Link
            to="/messages"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Messages
          </Link>
          <Link
            to="/UploadVideo"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Upload Video
          </Link>
        </nav>
      </aside>

      {/* ✅ Main Content (navbar + videos) */}
      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-0"
          }`}
      >
        {/* Navbar */}
        <nav
          className={`fixed top-0 ${sidebarOpen ? "left-60 w-[calc(100%-15rem)]" : "left-0 w-full"
            } bg-sky-200 text-black shadow-md z-50 transition-all duration-300`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            {/* ✅ Sidebar toggle button stays in navbar (always visible) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="custom-btn text-2xl text-gray-700 hover:text-black mr-4"
            >
              <FaBars />
            </button>

            {/* Brand */}
            <a className="text-xl font-bold" href="#">
              <button className="custom-btn" > Navbar  </button>
            </a>

            {/* Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="hover:text-sky-600 transition duration-300">
                <button className="custom-btn" >  Home    </button>
              </a>

              <a href="#" className="hover:text-sky-600 transition duration-300">

                <button className="custom-btn" >  Link    </button>
              </a>


              {/* Dropdown */}
              <div className="relative group" >
                <button className="hover:text-sky-600 transition duration-300 custom-btn ">
                  Link ▾
                </button>
                <ul className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg hidden group-hover:block">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Action
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Another action
                    </a>
                  </li>
                  <li>
                    <hr className="border-gray-300" />
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Something else here
                    </a>
                  </li>
                </ul>
              </div>

              {/* Upload Button */}
              <Link to="/UploadVideo" className="ml-80">
                <button className="custom-btn">+ Create</button>
              </Link>
            </div>

            {/* Search Form */}
            <form className="hidden md:flex items-center space-x-2">
              <input
                className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                type="submit"
                className=" custom-btn px-4 py-2 rounded-lg border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition duration-300"
              >
                Search
              </button>
            </form>
          </div>
        </nav>

        {/* ✅ Main page content */}
        <div className="pt-24 max-w-6xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-gray-800 my-4 text-center">
            Welcome to Home Page
          </h1>
          <p className="text-center text-gray-600 mb-6">You are logged in 🎉</p>

          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            Upload your videos
          </h1>
          <nav className="flex gap-4 mb-8">
            <Link to="/DisplayVideos">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md">
                Display Videos
              </button>
            </Link>
            <Link to="/UploadVideo">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md">
                Uploads
              </button>
            </Link>
          </nav>

          <hr className="my-6 border-gray-300" />

          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Public Videos
          </h2>
          {loading ? (
            <p className="text-gray-600 text-center">Loading videos...</p>
          ) : videos.length === 0 ? (
            <p className="text-gray-600 text-center">No videos found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
                >
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{video.description}</p>
                    {video.uploadedBy?.username && (
                      <small className="text-gray-500">
                        By: <button onClick={() => navigate(`/profile/${video.uploadedBy._id}`)}>
                          {video.uploadedBy.username}
                        </button>

                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
