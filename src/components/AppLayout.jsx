import { useContext } from "react";
import DataContext from "../context/DataProvider";
import { Spin } from "antd";
import Header from "./Header/AppHeader";
import Schedule from "./Schedule/AppSchedule";

export default function AppLayout() {
  const { loading } = useContext(DataContext);

  if (loading) {
    return <Spin fullscreen="true" size="large"></Spin>;
  }
  return (
    <>
      <Header></Header>
      <Schedule></Schedule>
    </>
  );
}
