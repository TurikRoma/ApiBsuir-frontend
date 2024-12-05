import "./Schedule.css";
import { AutoComplete, List } from "antd";
import { useContext, useEffect, useState } from "react";
import DataContext from "../../context/DataProvider";
import { TeamOutlined } from "@ant-design/icons";

export default function Schedule() {
  const {
    auditoriesSchedule,
    typeSearch,
    FindAuditories,
    changeOptions,
    options,
    AuditoriesList,
    inputValue,
    setInputValue,
  } = useContext(DataContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([]);
  }, [typeSearch]);

  const startDate = new Date("2024-9-1");
  const endDate = new Date("2024-12-29");

  let currentDate = new Date();

  let WeekOptions = { weekday: "long" };

  function getIndexWeek(date, schedule) {
    const start = new Date(startDate);
    const diffInDays = Math.floor((date - start) / (1000 * 60 * 60 * 24));
    let weekIndex = Math.floor(diffInDays / 7) + 1;
    while (weekIndex > 3) {
      weekIndex -= 4;
    }

    return weekIndex;
  }

  function onChange(event) {
    let sorteredList = FindAuditories(event);
    changeOptions(sorteredList);
    setInputValue(event);
    if (event.length > 2) {
      let inputValue = event;
      let searchData = "";
      let data = [];

      typeSearch == "auditorie"
        ? (searchData = auditoriesSchedule[inputValue])
        : null;
      if (typeSearch == "auditorie") {
        while (currentDate <= endDate) {
          if (
            currentDate.getDay() !== 0 &&
            AuditoriesList.includes(inputValue)
          ) {
            let dayName = new Intl.DateTimeFormat("ru-RU", WeekOptions).format(
              currentDate
            );
            dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
            let indexWeek = getIndexWeek(currentDate) + 1;
            let month = currentDate.toLocaleString("ru-RU", {
              month: "long",
            });
            month = month.charAt(0).toUpperCase() + month.slice(1);
            const day = currentDate.getDate();

            if (searchData[`${indexWeek}week`][dayName] == undefined) continue;
            let daySchedule = searchData[`${indexWeek}week`][dayName];

            if (daySchedule.length != 0) {
              data = data.concat({
                type: "Head",
                WeekIndex: indexWeek,
                NameDay: dayName,
                Month: month,
                Day: day,
              });
            }

            for (let i = 0; i < daySchedule.length; i++) {
              let schedule = daySchedule[i];
              data = data.concat({ type: "Main", content: schedule });
            }
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      console.log(data);
      setData(data);
    }
    if (event.length == 0) {
      setData([]);
      changeOptions([]);
    }
  }
  return (
    <>
      <AutoComplete
        className="search-input"
        onChange={onChange}
        options={options}
        value={inputValue}
        style={{
          width: 200,
        }}
        placeholder={
          typeSearch == "auditorie" ? "Номер аудитории" : "ФИО преподавателя"
        }
      />

      <List
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item className="schedule-item">
            {item.type == "Head" && (
              <div className="header-schedule">
                {item.searchType != "auditorie" && (
                  <>
                    <h1>
                      {item.Day}, {item.Month} {item.NameDay}
                    </h1>
                    <h2>{item.WeekIndex}week</h2>
                  </>
                )}
              </div>
            )}
            {item.type == "Main" && (
              <>
                <div className="main-content">
                  <h2>
                    {item.content.subject} ({item.content.lessonType}){" "}
                    {item.content.subGroup != null &&
                      item.content.subGroup != "1,2 " && (
                        <>
                          <TeamOutlined />
                          {item.content.subGroup}
                        </>
                      )}
                  </h2>
                  {item.searchType == "auditorie" && (
                    <p>{item.content.studentGroups}</p>
                  )}
                  {item.searchType != "auditorie" && (
                    <p>{[...item.content.studentGroups].join(", ")}</p>
                  )}

                  <p>{item.content.employ}</p>
                  <p></p>
                </div>
                <div className="aside-content">
                  <h2>{item.content.startLesson}</h2>
                  {item.searchType == "auditorie" && (
                    <p>{item.content.weeks} week</p>
                  )}
                </div>
              </>
            )}
          </List.Item>
        )}
      />
    </>
  );
}
