import { Typography, Tabs } from "antd";
import "./Header.css";
import { useContext } from "react";
import DataContext from "../../context/DataProvider";

export default function Header() {
  const { changeTypeSearch, changeOptions, setInputValue } =
    useContext(DataContext);

  const onChange = (key) => {
    if (key == 1) changeTypeSearch("auditorie");
    else changeTypeSearch("employ");
    changeOptions([]);
    setInputValue("");
  };

  let TabsArr = ["По аудитории"];

  return (
    <>
      <header className="header">
        <Typography.Title level={2}>
          Расписание занятий в Бгуир
        </Typography.Title>
        <Tabs
          onChange={onChange}
          type="card"
          items={TabsArr.map((tab, i) => {
            const id = String(i + 1);
            return {
              label: tab,
              key: id,
            };
          })}
        />
      </header>
      <hr />
    </>
  );
}
