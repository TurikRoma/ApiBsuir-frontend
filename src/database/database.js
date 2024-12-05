import Dexie from "dexie";
import getSchedule from "../fetchApi/fetchAuditories";

export const db = new Dexie("auditoriesDatabase");

export const dbData = db.version(1).stores({
  auditories: "++id, auditoriesNumber, content",
});

export async function addAuditorie(auditorieNumber, content) {
  try {
    await db.auditories.add({ auditorieNumber, content });
  } catch (error) {
    console.log(error);
  }
}

export async function fetchAuditories() {
  const allAuditories = await db.auditories.toArray();
  return allAuditories;
}

export async function auditoriesUpload() {
  let auditoriesDB = await fetchAuditories();
  let auditoriesSchedule = {};
  let sorteredAuditories = [];

  auditoriesDB = auditoriesDB.map((auditorie) => {
    auditoriesSchedule[auditorie.auditorieNumber] = auditorie.content;
    sorteredAuditories = sorteredAuditories.concat(auditorie.auditorieNumber);
  });

  return [auditoriesSchedule, sorteredAuditories];
}

export async function addDataToDB() {
  let data = await getSchedule();
  await db.auditories.clear();
  for (let key in data) {
    addAuditorie(key, data[key]);
  }
  let dataAuditorie = await auditoriesUpload();
}
