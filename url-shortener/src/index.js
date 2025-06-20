import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDAf8HzDar_dt0ycpDp4PN09XQWMgTKwSs",
  authDomain: "url-shortener-v1.firebaseapp.com",
  databaseURL: "https://url-shortener-v1-default-rtdb.firebaseio.com",
  projectId: "url-shortener-v1",
  storageBucket: "url-shortener-v1.firebasestorage.app",
  messagingSenderId: "218205237850",
  appId: "1:218205237850:web:33ae7a1bbe74d92a8fde63",
  measurementId: "G-T7MWX9EM0S"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
