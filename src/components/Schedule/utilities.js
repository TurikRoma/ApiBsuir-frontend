const startDate = new Date("2025-02-10");
const endDate = new Date("2025-06-20");

let currentDate = new Date();

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
