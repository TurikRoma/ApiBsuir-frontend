import "./Schedule.css";
import { List, Skeleton } from "antd";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TeamOutlined } from "@ant-design/icons";
import { getSchedule, getScheduleByWeek } from "./utilities";
import DataContext from "../../context/DataProvider";

export default function Schedule() {
  const { typeSearch } = useContext(DataContext);
  const [data, setData] = useState();

  const { auditoriesSchedule } = useSelector((state) => state.schedule);
  const { weeksList } = useSelector((state) => state.weeks);

  const isLoading = auditoriesSchedule.status == "loading";

  useEffect(() => {
    if (!isLoading) {
      let scheduleData;
      if (typeSearch == "auditorie") {
        scheduleData = getSchedule(auditoriesSchedule);
        console.log(scheduleData);
      } else {
        console.log(weeksList);
        scheduleData = getScheduleByWeek(auditoriesSchedule, [...weeksList]);
        console.log(scheduleData);
      }
      setData(scheduleData);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      console.log(weeksList);
      if (weeksList.length != 0) {
        const scheduleData = getScheduleByWeek(auditoriesSchedule, [
          ...weeksList,
        ]);
        setData(scheduleData);
      } else {
        setData([]);
      }
    }
  }, [weeksList]);

  return (
    <>
      
      {typeSearch == "auditorie" && isLoading && (
        <Skeleton loading={isLoading} active></Skeleton>
      )}
      {typeSearch != "auditorie" && isLoading && <div className="plug"></div>}

      {!isLoading && (
        <List
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item className="schedule-item">
              {item.type == "Head" && (
                <div className="header-schedule">
                  {typeSearch == "auditorie" && (
                    <>
                      <h1>
                        {item.Day} {item.Month}, {item.NameDay}
                      </h1>
                      <h2>{item.WeekIndex}week</h2>
                    </>
                  )}
                  {typeSearch != "auditorie" && <h1>{item.NameDay}</h1>}
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
                    {item.searchType != "auditorie" &&
                      item.content.studentGroups && (
                        <p>{[...item.content.studentGroups].join(", ")}</p>
                      )}

                    <p>{item.content.employ}</p>
                    {typeSearch != "auditorie" && (
                      <p>{[...item.content.weeks].join(", ")} нед.</p>
                    )}
                  </div>
                  <div className="aside-content">
                    <h2>{item.content.startLesson}</h2>
                    {item.searchType == "auditorie" && (
                      <p>{item.content.weeks} week</p>
                    )}
                  </div>
                </>
              )}
              {item.type == "WithoutSchedule" && (
                <div className="no-schedule-container">
                  <p>Нету расписания</p>
                </div>
              )}
            </List.Item>
          )}
        />
      )}
    </>
  );
}
