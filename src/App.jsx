import { useState } from "react";
import Signup from "./assets/component/login & signup/signup";
import Login from "./assets/component/login & signup/login";
import Dashboard from "./assets/component/main/dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <div className="relative h-screen w-full bg-amber-100">
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
