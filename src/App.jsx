import { Routes, Route, Link } from "react-router-dom";
import Signup from "./Signup";
import Login from "./login";
import Home from "./Home";
import UploadVideo from "./UploadVideo";
import DisplayVideos from "./displayVideos";
import ProfilePage from "./ProfilePage";

function App() {
  return (
    <>
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/UploadVideo" element={<UploadVideo />} />
        <Route path="/Protected" element={<UploadVideo />} />
        <Route path="/DisplayVideos" element={<DisplayVideos/>} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        
        
      </Routes>
    </>
  );
}

export default App;
