import React from "react";
import { DataProviderContext } from "./context/DataProvider";
import { Routes, Route } from "react-router-dom";
import Schedule from "./components/Schedule/AppSchedule";
import Header from "./components/Header/AppHeader";
import Aside from "./components/Aside/AppAside";

export default function App() {
  return (
    <DataProviderContext>
      <Header></Header>
      <Routes>
        <Route path="/" element={<></>}></Route>
        <Route path="auditories/:id" element={<Schedule></Schedule>}></Route>
        <Route
          path="auditories/corps/"
          element={
            <>
              <main className="main-container">
                <Schedule></Schedule>
                <Aside></Aside>
              </main>
            </>
          }
        ></Route>
        <Route
          path="auditories/corps/:id"
          element={
            <>
              <main className="main-container">
                <Schedule></Schedule>
                <Aside></Aside>
              </main>
            </>
          }
        ></Route>
      </Routes>
    </DataProviderContext>
  );
}
