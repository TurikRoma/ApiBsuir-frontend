import { createContext, useEffect, useState } from "react";
import { addDataToDB, auditoriesUpload, db } from "../database/database";

const DataContext = createContext({
  auditoriesSchedule: {},
  sorteredAuditories: [],
  AuditoriesList: [],
  typeSearch: "auditorie",
  loading: false,
  options: [],
});

export function DataProviderContext({ children }) {
  const [loading, setLoading] = useState(true);
  const [auditoriesSchedule, setAuditoriesSchedule] = useState({});
  const [sorteredAuditories, setSorteredAuditories] = useState([]);
  const [AuditoriesList, setAuditoriesList] = useState([]);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [typeSearch, setTypeSearch] = useState("auditorie");

  useEffect(() => {
    async function func() {
      let dataAuditorie = await auditoriesUpload();
      setAuditoriesSchedule(dataAuditorie[0]);
      setAuditoriesList(dataAuditorie[1]);
      console.log(dataAuditorie[0]);
      db.auditories.clear();
      if (dataAuditorie[1].length == 0) {
        await addDataToDB();
        func();
      }
      setLoading(false);
    }
    func();
  }, []);

  const changeOptions = function (option) {
    setOptions(option);
  };

  const changeTypeSearch = function (type) {
    setTypeSearch(type);
  };

  const FindAuditories = function (el) {
    let data = el;
    let sorteredList = [];
    let searchingType;

    typeSearch == "auditorie" ? (searchingType = AuditoriesList) : null;

    searchingType.forEach((item) => {
      if (
        item.slice(0, data.length).toLowerCase().includes(data.toLowerCase())
      ) {
        sorteredList.push({ value: item });
      }
    });
    return sorteredList;
  };

  return (
    <DataContext.Provider
      value={{
        loading,
        auditoriesSchedule,
        typeSearch,
        options,
        inputValue,
        setInputValue,
        changeTypeSearch,
        FindAuditories,
        changeOptions,
        AuditoriesList,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;

export function useData() {
  return useContext(DataContext);
}
