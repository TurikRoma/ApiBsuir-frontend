import { Typography, Tabs, AutoComplete } from "antd";
import "./Header.css";
import { useContext } from "react";
import DataContext from "../../context/DataProvider";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchSchedule } from "../../redux/slices/schedules";

export default function Header() {
  const {
    changeTypeSearch,
    changeOptions,
    setInputValue,
    typeSearch,
    options,
    inputValue,
    FindAuditories,
  } = useContext(DataContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChange = (key) => {
    if (key == 1) {
      changeTypeSearch("auditorie");
      navigate(`/`, { replace: true });
    } else {
      changeTypeSearch("auditorie(corps)");
      navigate(`/auditories/corps/`, { replace: true });
    }
    changeOptions([]);
    setInputValue("");
  };
  function onChangeInput(event) {
    setInputValue(event);
    let sorteredList = FindAuditories(event);
    changeOptions(sorteredList);
  }
  async function searchAuditorie(event) {
    if (event.target.value.length > 2 && event.key === "Enter") {
      navigate(`/auditories/${event.target.value}`, { replace: true });
      dispatch(fetchSchedule(event.target.value));
    }
  }

  async function onSelect(event) {
    navigate(`/auditories/${event}`, { replace: true });
    dispatch(fetchSchedule(event));
  }

  let TabsArr = ["По аудитории", "По аудитории (Корпус)"];

  return (
    <>
      <header className="header">
        <Typography.Title level={2} className="Title">
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
      <AutoComplete
        className="search-input"
        onChange={onChangeInput}
        options={options}
        value={inputValue}
        onKeyDown={searchAuditorie}
        onSelect={onSelect}
        style={{
          width: 200,
        }}
        placeholder={"Номер аудитории"}
      />
    </>
  );
}
