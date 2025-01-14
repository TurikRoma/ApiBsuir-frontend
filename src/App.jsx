import React from "react";
import { DataProviderContext } from "./context/DataProvider";
import AppLayout from "./components/AppLayout";
import { Routes, Route } from "react-router-dom";
import Schedule from "./components/Schedule/AppSchedule";
import Header from "./components/Header/AppHeader";

export default function App() {
  return (
    <DataProviderContext>
      <Routes>
        <Route path="/" element={<Header></Header>}></Route>
        <Route path="auditories/:id" element={<AppLayout></AppLayout>}></Route>
      </Routes>
    </DataProviderContext>
  );
}
