import { Checkbox, Divider } from "antd";
import "./Aside.css";
import { useDispatch, useSelector } from "react-redux";
import { changeOptionsCorps } from "../../redux/slices/Corps";
import { changeOptionsWeeks } from "../../redux/slices/weeks";

const CheckboxGroup = Checkbox.Group;
const CorpsOptions = [1, 2, 3, 4, 5];
const WeekOptions = [1, 2, 3, 4];

export default function Aside() {
  const dispatch = useDispatch();

  const { corpsList } = useSelector((state) => state.corps);
  const { weeksList } = useSelector((state) => state.weeks);

  const checkAllWeeks = WeekOptions.length === weeksList.length;
  const checkAllCorps = CorpsOptions.length === corpsList.length;

  const onChangeCorps = (list) => {
    dispatch(changeOptionsCorps(list));
  };
  const onChangeWeeks = (list) => {
    dispatch(changeOptionsWeeks(list));
  };
  const onCheckAllCorpsChange = (e) => {
    e.target.checked
      ? dispatch(changeOptionsCorps(CorpsOptions))
      : dispatch(changeOptionsCorps([]));
  };
  const onCheckAllWeekChange = (e) => {
    e.target.checked
      ? dispatch(changeOptionsWeeks(WeekOptions))
      : dispatch(changeOptionsWeeks([]));
  };
  return (
    <aside>
      <p>Корпус</p>
      <CheckboxGroup
        options={CorpsOptions}
        value={corpsList}
        onChange={onChangeCorps}
      />
      <br />
      <Checkbox onChange={onCheckAllCorpsChange} checked={checkAllCorps}>
        Выбрать все
      </Checkbox>

      <Divider />

      <p>Неделя</p>
      <CheckboxGroup
        options={WeekOptions}
        value={weeksList}
        onChange={onChangeWeeks}
      />
      <br />
      <Checkbox onChange={onCheckAllWeekChange} checked={checkAllWeeks}>
        Выбрать все
      </Checkbox>
    </aside>
  );
}
