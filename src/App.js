import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import UploadUI from "./UploadUI";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100svh",
        // alignItems:"center"
      }}
    >
      <h1 style={{ textAlign: "center", color: "#fff" }}>Audio Cleaner</h1>

      <UploadUI />
      <p style={{ textAlign: "center", color: "#fff" }}>MADE WITH ❤️ BY 🍊</p>
    </div>
  );
}

export default App;
