import React from "react";
import { DataProviderContext } from "./context/DataProvider";
import AppLayout from "./components/AppLayout";

export default function App() {
  return (
    <DataProviderContext>
      <AppLayout></AppLayout>
    </DataProviderContext>
  );
}
