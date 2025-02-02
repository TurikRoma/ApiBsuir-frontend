const startDate = new Date("2025-02-10");
const endDate = new Date("2025-06-20");
let currentDate = new Date();
let days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

if (currentDate < startDate) currentDate = new Date(startDate);

let WeekOptions = { weekday: "long" };

export function getIndexWeek(date) {
  const start = new Date(startDate);
  const diffInDays = Math.floor((date - start) / (1000 * 60 * 60 * 24));
  let weekIndex = Math.floor(diffInDays / 7);
  while (weekIndex > 3) {
    weekIndex -= 4;
  }

  return weekIndex;
}

function sortScheduleByTime(newAuditorieList) {
  for (let i = 0; i < 6; i++) {
    let schedule;
    try {
      schedule = newAuditorieList[days[i]];
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
    newAuditorieList[days[i]] = schedule;
  }
  return newAuditorieList;
}

function getUniqueSchedule(newAuditorieList) {
  for (let i = 0; i < 6; i++) {
    if (newAuditorieList[days[i]]) {
      const uniqueSchedule = Array.from(
        new Map(
          newAuditorieList[days[i]].map((schedule) => [
            JSON.stringify(schedule),
            schedule,
          ])
        ).values()
      );
      newAuditorieList[days[i]] = uniqueSchedule;
    }
  }
  return newAuditorieList;
}

export function getSchedule(auditoriesSchedule) {
  let scheduleData = [];
  let data = auditoriesSchedule.item;
  while (currentDate <= endDate) {
    if (currentDate.getDay() !== 0) {
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
      if (data[`${indexWeek}week`][dayName] == undefined) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }
      let daySchedule = data[`${indexWeek}week`][dayName];
      if (daySchedule.length != 0) {
        scheduleData = scheduleData.concat({
          type: "Head",
          WeekIndex: indexWeek,
          NameDay: dayName,
          Month: month,
          Day: day,
        });
      }
      for (let i = 0; i < daySchedule.length; i++) {
        let schedule = daySchedule[i];
        scheduleData = scheduleData.concat({
          type: "Main",
          content: schedule,
        });
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentDate < startDate) currentDate = new Date(startDate);
  else currentDate = new Date(startDate);
  return scheduleData;
}

export function getScheduleByWeek(auditorieSchedule, week) {
  let scheduleData = [];
  let data = auditorieSchedule.item;
  let newAuditorieList = { ...data[`${week[0]}week`] };

  week.shift();
  week.map((w) => {
    for (let day in data[`${w}week`]) {
      if (newAuditorieList[day]) {
        const newSchedule = newAuditorieList[day].concat(data[`${w}week`][day]);
        newAuditorieList[day] = newSchedule;
      } else {
        newAuditorieList[day] = data[`${w}week`][day];
      }
    }
  });
  newAuditorieList = sortScheduleByTime(newAuditorieList);
  newAuditorieList = getUniqueSchedule(newAuditorieList);

  for (let i = 0; i < 6; i++) {
    scheduleData.push({
      type: "Head",
      NameDay: days[i],
    });
    console.log(newAuditorieList[days[i]]);
    if (newAuditorieList[days[i]] && newAuditorieList[days[i]].length != 0) {
      for (let j = 0; j < newAuditorieList[days[i]].length; j++) {
        scheduleData.push({
          type: "Main",
          content: newAuditorieList[days[i]][j],
        });
      }
    } else {
      scheduleData.push({
        type: "WithoutSchedule",
      });
    }
  }
  return scheduleData;
}
