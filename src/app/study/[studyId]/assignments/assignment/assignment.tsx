"use client";

import { ReactNode, useState } from "react";
import SolvedAcTier from "../solved_ac_tier";
import styles from "./assignment.module.scss";
import { Button } from "@/app/common/inputs";
import NewAssignmentPopup from "../new_assignment_popup/new_assignment_popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

type AssignmentProps = {
  solvedAcTier: number;
  problemId: number;
  problemName: string;
  children?: ReactNode;
};

type AssigneeProps = {
  profileImageUrl?: string;
  nickname: string;
};

type DatetimeProps = {
  dueDate: Date;
  startDate: Date;
};

export default function Assignment(props: AssignmentProps) {
  return (
    <div className={styles.assignment}>
      <div className={styles.problem}>
        <div className={styles.tier}>
          <SolvedAcTier
            level={props.solvedAcTier}
            className={styles.tier}
          ></SolvedAcTier>
        </div>
        <div className={styles.id}>{props.problemId}</div>
        <div className={styles.name}>{props.problemName}</div>
      </div>
      <ul className={styles.assignees}>{props.children}</ul>
    </div>
  );
}

export function Assignee(props: AssigneeProps) {
  return (
    <li className={styles.assignee}>
      <img
        src=""
        alt=""
        className={styles.profile}
        style={{
          background: props.profileImageUrl && `url(${props.profileImageUrl})`,
          backgroundSize: "cover"
        }}
      />
      <div className={styles.nickname}>{props.nickname}</div>
    </li>
  );
}

export function Datetime(props: DatetimeProps) {
  const formatDatetime = (dt: Date) => {
    const now = new Date();
    let result = "";
    if (now.getFullYear() != dt.getFullYear())
      result += `${dt.getFullYear()}년 `;
    result += `${
      dt.getMonth() + 1
    }월 ${dt.getDate()}일 ${dt.getHours()}:${dt.getMinutes()}`;

    return result;
  };

  return (
    <div className={styles.datetime}>
      <FontAwesomeIcon icon={faCalendarAlt}></FontAwesomeIcon>&nbsp;
      {formatDatetime(props.startDate)} ~&nbsp;
      {formatDatetime(props.dueDate)}
    </div>
  );
}

export function AssignmentContainer(props: { children?: ReactNode }) {
  const [newAssignmentPopupActive, toggleNewAssignmentPopup] =
    useState<boolean>(false);
  return (
    <div className={styles.assignmentsContainer}>
      <Button
        onClick={(evt) => {
          evt.preventDefault();
          toggleNewAssignmentPopup(true);
        }}
      >
        과제 생성
      </Button>
      <div className={styles.assignments}>{props.children}</div>
      {newAssignmentPopupActive && (
        <NewAssignmentPopup
          onCloseClick={() => toggleNewAssignmentPopup(false)}
        ></NewAssignmentPopup>
      )}
    </div>
  );
}
