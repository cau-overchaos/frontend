import { Button, Input, Select } from "@/app/common/inputs";
import styles from "./new_assignment_popup.module.scss";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { MouseEventHandler } from "react";

type Props = {
  onCloseClick: () => void;
};

export default function NewAssignmentPopup(props: Props) {
  const closeWindowOnOutsideClick: MouseEventHandler<HTMLDivElement> = (
    evt
  ) => {
    let now: HTMLElement | null = evt.target as HTMLElement;
    let clickedPopup = false;
    while (now !== null) {
      if (now.classList.contains(styles.popup)) {
        clickedPopup = true;
        break;
      }
      now = now.parentElement;
    }

    if (!clickedPopup) {
      props.onCloseClick();
    }
  };
  return (
    <div className={styles.container} onClick={closeWindowOnOutsideClick}>
      <div className={styles.popup}>
        <h2>과제 생성</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>플랫폼</th>
              <th>번호</th>
              <th>제목</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>백준</td>
              <td>1112</td>
              <td>Lorem ipsum</td>
              <td>
                <Button small>삭제</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Select small name="" id="">
                  <option value="">백준</option>
                </Select>
              </td>
              <td colSpan={2}>
                <Input small />
              </td>
              <td>
                <Button small>추가</Button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.dateField}>
          과제 시작일:&nbsp;
          <DateTimePicker
            value={new Date()}
            disableClock
            format="y-MM-dd H:mm"
          ></DateTimePicker>
        </div>
        <div className={styles.dateField}>
          과제 종료일:&nbsp;
          <DateTimePicker
            value={new Date()}
            disableClock
            format="y-MM-dd H:mm"
          ></DateTimePicker>
        </div>
        <div>
          <Button small>과제 생성</Button>
        </div>
      </div>
    </div>
  );
}
