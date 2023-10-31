import { Button, Input, Select } from "@/app/common/inputs";
import styles from "./new_assignment_popup.module.scss";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { MouseEventHandler, useState } from "react";
import SolvedAcTier from "../solved_ac_tier";
import apiClient, {
  Problem,
  ProblemProviderKey,
  problemProviderKeyToValue
} from "@/app/api_client/api_client";
import { useParams } from "next/navigation";

type Props = {
  onCloseClick: () => void;
};

type AssignmentProps = Pick<
  Problem,
  "pid" | "provider" | "difficultyLevel" | "title"
>;

function AssingmentRow(
  props: AssignmentProps & {
    onDeleteBtnClick: (assignment: AssignmentProps) => void;
  }
) {
  return (
    <tr>
      <td>{problemProviderKeyToValue(props.provider)}</td>
      <td>
        <SolvedAcTier
          level={props.difficultyLevel}
          className={styles.difficultyIcon}
        ></SolvedAcTier>
        &nbsp;
        {props.pid}
      </td>
      <td>{props.title}</td>
      <td>
        <Button
          small
          onClick={() => {
            props.onDeleteBtnClick(props);
          }}
        >
          삭제
        </Button>
      </td>
    </tr>
  );
}

export default function NewAssignmentPopup(props: Props) {
  const params = useParams();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  );
  const [problems, setProblems] = useState<AssignmentProps[]>([]);
  const [problemIdInput, setProblemIdInput] = useState<number | undefined>(
    undefined
  );

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

  const addProblem = async (id: number) => {
    const problem = await apiClient.getProblem(id, "BAEKJOON");
    if (!problems.some((i) => i.pid === id))
      setProblems([...problems, problem]);
    else alert("이미 추가된 문제입니다.");
  };

  const createAssignment = async () => {
    await apiClient.createAssignment(parseInt(params.studyId as string), {
      dueDate: endDate,
      startDate,
      problemList: problems.map((problem) => ({
        pid: problem.pid,
        provider: problem.provider
      }))
    });

    props.onCloseClick();
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
            {problems.map((i, idx) => (
              <AssingmentRow
                key={i.pid}
                {...i}
                onDeleteBtnClick={(_assignment) => {
                  setProblems([
                    ...problems.slice(0, idx),
                    ...problems.slice(idx + 1)
                  ]);
                }}
              ></AssingmentRow>
            ))}
            <tr>
              <td>
                <Select small name="" id="">
                  <option value="" selected>
                    백준
                  </option>
                </Select>
              </td>
              <td colSpan={2}>
                <Input
                  small
                  number
                  value={problemIdInput}
                  onChange={(evt) =>
                    setProblemIdInput(evt.target.valueAsNumber)
                  }
                />
              </td>
              <td>
                <Button
                  small
                  onClick={() => {
                    if (typeof problemIdInput !== "undefined")
                      addProblem(problemIdInput);
                    else alert("문제 번호를 입력해주세요!");
                  }}
                >
                  추가
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.dateField}>
          과제 시작일:&nbsp;
          <DateTimePicker
            value={startDate}
            onChange={(v) => {
              if (v !== null) setStartDate(v);
            }}
            disableClock
            format="y-MM-dd H:mm"
          ></DateTimePicker>
        </div>
        <div className={styles.dateField}>
          과제 종료일:&nbsp;
          <DateTimePicker
            value={endDate}
            onChange={(v) => {
              if (v !== null) setEndDate(v);
            }}
            disableClock
            format="y-MM-dd H:mm"
          ></DateTimePicker>
        </div>
        <div>
          <Button small onClick={createAssignment}>
            과제 생성
          </Button>
        </div>
      </div>
    </div>
  );
}
