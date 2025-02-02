import { createContext, useEffect, useState } from "react";
import axios from "../axios";
import { useSelector } from "react-redux";

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
  const [AuditoriesList, setAuditoriesList] = useState([]);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [typeSearch, setTypeSearch] = useState("auditorie");

  const { auditoriesSchedule } = useSelector((state) => state.schedule);
  const sorteredAuditories = auditoriesSchedule.sorteredAuditoriesList.payload;

  useEffect(() => {
    async function getAuditorieList() {
      let auditorieList = await axios.get("/auditories");

      setAuditoriesList(auditorieList.data);
      auditorieList = auditorieList.data.map((auditorie) => {
        return { value: auditorie };
      });
      setOptions(auditorieList);
    }
    getAuditorieList();
    setLoading(false);
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
    typeSearch == "auditorie"
      ? (searchingType = AuditoriesList)
      : (searchingType = sorteredAuditories);

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
