import AdminNavbar from "@/components/AdminNavbar";
import Navbar from "@/components/Navbar";
import React from "react";

const VideoCalling = () => {
  return (
    <>
    <AdminNavbar />
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="https://console-api-sig.zegocloud.com/s/uikit/QnqQrm"
        style={{ width: "100%", height: "100%", border: "none" }}
        allow="camera; microphone; fullscreen"
        title="Video Call"
      ></iframe>
    </div>
    </>
  );
};

export default VideoCalling;
