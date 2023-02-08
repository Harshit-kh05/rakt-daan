import { Route, Routes } from "react-router-dom";
import "./assets/css/nucleo-icons.css";
import "./assets/css/scss/blk-design-system-react.scss";
import "./assets/css/demo.css";
import Landing from "./views/Landing";
import Login from "./views/Login";
import Register from "./views/Register";

import { useEffect, useState } from "react";
import BloodbankHome from "./views/BloodbankHome";
import BloodCollection from "./views/BloodCollection";
import UpdateStatus from "./views/UpdateStatus";
import HospitalHome from "./views/HospitalHome";

import { ThirdwebProvider, ChainId, useSDK } from "@thirdweb-dev/react";
import { useContract } from "@thirdweb-dev/react";

import GlobalState from "./context/GlobalState";

import "./App.scss";

function App() {
  const sdk = useSDK();

  return (
    <GlobalState>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bloodbank-home" element={<BloodbankHome />} />
        <Route path="/hospital-home" element={<HospitalHome />} />
        <Route path="/blood-collection" element={<BloodCollection />} />
        <Route path="/update-status" element={<UpdateStatus />} />
      </Routes>
    </GlobalState>
  );
}

export default App;
