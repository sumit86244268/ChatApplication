import React, { useEffect, useState, useRef } from "react";
import './App.css'
import { Route, Router, BrowserRouter, Routes, Navigate } from "react-router-dom";
import AppRender from './assets/JSXFolder/AppRender';
import Login from './assets/JSXFolder/Login/Login';
import { connectWebSocket } from "../src/assets/JSFolder/websocket";

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          user ? <AppRender user={user} setUser={setUser} userDetails={userDetails} /> : <Navigate to="/login" />
        } />
        <Route path="/Home" element={
          user ? <AppRender user={user} setUser={setUser} userDetails={userDetails} /> : <Navigate to="/login" />
        } />
        <Route path="/Login" element={<Login setUser={setUser} setUserDetails={setUserDetails} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
