import "./Schedule.css";
import { List, Skeleton } from "antd";
import { useContext, useEffect, useState } from "react";
import DataContext from "../../context/DataProvider";
import { useSelector } from "react-redux";
import { TeamOutlined } from "@ant-design/icons";
import { getSchedule } from "./utilities";

export default function Schedule() {
  const [data, setData] = useState();

  const { auditoriesSchedule } = useSelector((state) => state.schedule);

  const isLoading = auditoriesSchedule.status == "loading";

  useEffect(() => {
    console.log(isLoading);
    if (!isLoading) {
      const scheduleData = getSchedule(auditoriesSchedule);
      setData(scheduleData);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <Skeleton loading={isLoading} active></Skeleton>}
      {!isLoading && (
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
                        {item.Day} {item.Month}, {item.NameDay}
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
                    {item.searchType != "auditorie" &&
                      item.content.studentGroups && (
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
      )}
    </>
  );
}
