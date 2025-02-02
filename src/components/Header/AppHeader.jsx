import { Typography, Tabs, AutoComplete, Spin } from "antd";
import "./Header.css";
import { useContext, useEffect } from "react";
import DataContext from "../../context/DataProvider";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changeTypeSearchAction,
  fetchSchedule,
  setSorteredAuditoriesList,
} from "../../redux/slices/schedules";

export default function Header() {
  const {
    changeTypeSearch,
    changeOptions,
    setInputValue,
    options,
    inputValue,
    FindAuditories,
    AuditoriesList,
    typeSearch,
    loading,
  } = useContext(DataContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { corpsList } = useSelector((state) => state.corps);

  let TabsArr = ["По аудитории", "По аудитории (Корпус)"];

  useEffect(() => {
    getAuditoriesListByCorps(corpsList);
  }, [corpsList]);

  const onChange = (key) => {
    if (key == 1) {
      changeTypeSearch("auditorie");
      dispatch(changeTypeSearchAction());
      navigate(`/`, { replace: true });
    } else {
      getAuditoriesListByCorps([1]);
      changeTypeSearch("auditorie(corps)");
      dispatch(changeTypeSearchAction());
      navigate(`/auditories/corps/`, { replace: true });
    }
    setInputValue("");
  };

  function getAuditoriesListByCorps(corps) {
    let sorteredList = [];
    corps.map((corp) => {
      AuditoriesList.forEach((auditorie) => {
        if (auditorie.slice(-2) == `-${corp}`) {
          sorteredList.push(auditorie);
        }
      });
    });

    dispatch(setSorteredAuditoriesList(sorteredList));
    sorteredList = sorteredList.map((auditorie) => {
      return { value: auditorie };
    });
    changeOptions(sorteredList);
  }

  function onChangeInput(event) {
    setInputValue(event);
    let sorteredList = FindAuditories(event);
    changeOptions(sorteredList);
  }

  async function searchAuditorie(event) {
    console.log(typeSearch);
    if (event.key === "Enter") {
      let auditorie = options[0].value;
      setInputValue(auditorie);
      if (typeSearch == "auditorie") {
        navigate(`/auditories/${auditorie}`, { replace: true });
        dispatch(fetchSchedule(auditorie));
      } else {
        navigate(`/auditories/corps/${auditorie}`, { replace: true });
        dispatch(fetchSchedule(auditorie));
      }
    }
  }

  async function onSelect(event) {
    if (typeSearch == "auditorie") {
      navigate(`/auditories/${event}`, { replace: true });
      dispatch(fetchSchedule(event));
    } else {
      navigate(`/auditories/corps/${event}`, { replace: true });
      dispatch(fetchSchedule(event));
    }
  }
  return (
    <>
      <Spin fullscreen spinning={loading}></Spin>
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
