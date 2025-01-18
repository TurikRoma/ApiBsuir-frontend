import React from "react";
import { DataProviderContext } from "./context/DataProvider";
import AppLayout from "./components/AppLayout";
import { Routes, Route } from "react-router-dom";
import Schedule from "./components/Schedule/AppSchedule";
import Header from "./components/Header/AppHeader";
import Aside from "./components/Aside/AppAside";

export default function App() {
  return (
    <DataProviderContext>
      <Routes>
        <Route path="/" element={<Header></Header>}></Route>
        <Route path="auditories/:id" element={<AppLayout></AppLayout>}></Route>
        <Route
          path="auditories/corps/"
          element={
            <>
              <Header></Header>
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
