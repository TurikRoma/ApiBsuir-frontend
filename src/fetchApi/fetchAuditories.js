import { addAuditorie, db, fetchAuditories } from "../database/database";
import pLimit from "p-limit";

let groups;
let auditories = {};
let days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
let errGroups = [];

const startDate = new Date("2024-09-2");
const endDate = new Date("2024-12-28");

const limit = pLimit(1);

function getScheduleForDate(date, dayName) {
  const start = new Date(startDate);
  const diffInDays = Math.floor((date - start) / (1000 * 60 * 60 * 24));
  let weekIndex = Math.floor(diffInDays / 7) % 4;
  weekIndex += "week";
  return schedule[weekIndex][dayName];
}

// Получение всех групп

export async function getGroups() {
  groups = await fetch("https://iis.bsuir.by/api/v1/student-groups")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let groupsData = data.map((group) => {
        return group["name"];
      });
      return groupsData;
    });
  return groups;
}

// Получение всех групп

// Получение расписания отдельных групп и формирование объекта auditories

export function GetGroupsSchedule(group) {
  let Data = group.map(async (g) => {
    return fetch(`https://iis.bsuir.by/api/v1/schedule?studentGroup=${g}`)
      .then((response) => {
        if (!response.ok) console.clear();
        return response.json();
      })
      .catch((err) => {
        return null;
      })
      .then((data) => {
        try {
          for (let key in data["schedules"]) {
            let groupSchedules = data["schedules"][key];
            groupSchedules = groupSchedules.map((s) => {
              let auditoriesNumber;
              let employName;

              try {
                auditoriesNumber = s["auditories"][0].slice(0, -3);
              } catch (error) {
                auditoriesNumber = "ФизК";
              }
              if (
                auditoriesNumber == "310a-4" ||
                auditoriesNumber == "410a-4"
              ) {
                auditoriesNumber = auditoriesNumber.replace(/a/gi, "а");
              }
              try {
                employName = `${s["employees"][0]["lastName"]} ${s["employees"][0]["firstName"][0]}. ${s["employees"][0]["middleName"][0]}.`;
              } catch (error) {
                employName: "нету";
              }

              let obj = {
                startLesson: s["startLessonTime"],
                studentGroups: [s["studentGroups"][0]["name"]],
                employ: employName,
                weeks: s["weekNumber"],
                subject: s["subject"],
                lessonType: s["lessonTypeAbbrev"],
              };
              if (auditoriesNumber == "ФизК")
                obj["auditorie"] = s["auditories"][0];
              if (s["lessonTypeAbbrev"] == "ЛР")
                obj["subGroup"] =
                  s["numSubgroup"] == 0 ? "1,2 " : s["numSubgroup"];
              else if (
                s["lessonTypeAbbrev"] == "Экзамен" ||
                s["lessonTypeAbbrev"] == "Консультация"
              ) {
                return {};
              }
              if (!Object.hasOwn(auditories, auditoriesNumber)) {
                auditories[auditoriesNumber] = {
                  "1week": {},
                  "2week": {},
                  "3week": {},
                  "4week": {},
                };
                try {
                  obj.weeks.map((week) => {
                    auditories[auditoriesNumber][`${week}week`][key] = [obj];
                  });
                } catch (error) {}
              } else {
                try {
                  obj.weeks.map((week) => {
                    if (auditories[auditoriesNumber][`${week}week`][key]) {
                      auditories[auditoriesNumber][`${week}week`][key] =
                        auditories[auditoriesNumber][`${week}week`][key].concat(
                          obj
                        );
                    } else {
                      auditories[auditoriesNumber][`${week}week`][key] = [obj];
                    }
                  });
                } catch (error) {}
              }
            });
          }
        } catch (error) {}
      });
  });
  return Data;
}

// Получение расписания отдельных групп и формирование объекта auditories

// main функция

export default async function getSchedule() {
  let group = await getGroups();
  let newData = GetGroupsSchedule(group);
  await Promise.all(newData).then((data) => {
    console.log(errGroups);
    for (let key in auditories) {
      for (let week in auditories[key]) {
        let sortedSchedule = {};
        for (let i = 0; i < days.length; i++) {
          let schedule;
          try {
            schedule = auditories[key][week][days[i]];
          } catch (error) {
            continue;
          }

          try {
            schedule.sort((a, b) => {
              const timeA = a.startLesson.split(":").map(Number);
              const timeB = b.startLesson.split(":").map(Number);
              return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
            });
          } catch (error) {}
          sortedSchedule[days[i]] = schedule;
        }
        auditories[key][week] = sortedSchedule;
      }
    }
    let lectures = new Set();
    for (let auditorie in auditories) {
      for (let week in auditories[auditorie]) {
        for (let i = 0; i < days.length; i++) {
          let schedule;
          try {
            schedule = auditories[auditorie][week][days[i]];
          } catch (error) {
            continue;
          }
          if (schedule != undefined) {
            schedule = schedule.find((item) => {
              return item.lessonType == "ЛК";
            });
          }

          if (schedule) {
            lectures.add(auditorie);
            break;
          }
        }
      }
    }
    let sorteredAuditories = [...lectures];
    sorteredAuditories.map((auditorie) => {
      for (let week in auditories[auditorie]) {
        for (let i = 0; i < days.length; i++) {
          let schedule;
          let changedSchecule = {};
          let listChahgedSchedule = [];
          try {
            schedule = auditories[auditorie][week][days[i]];
          } catch (error) {
            continue;
          }
          if (schedule != undefined) {
            schedule.map((item) => {
              if (!changedSchecule[item.startLesson]) {
                changedSchecule[item.startLesson] = {
                  [item.lessonType]: item,
                };
                changedSchecule[item.startLesson][
                  item.lessonType
                ].studentGroups = new Set(item.studentGroups);
              } else {
                try {
                  changedSchecule[item.startLesson][
                    item.lessonType
                  ].studentGroups.add(item.studentGroups[0]);
                } catch (error) {}
              }
            });
          }
          for (let key in changedSchecule) {
            for (let type in changedSchecule[key]) {
              listChahgedSchedule.push(changedSchecule[key][type]);
            }
          }
          auditories[auditorie][week][days[i]] = listChahgedSchedule;
        }
      }
    });
  });
  return auditories;
}

// main функция
