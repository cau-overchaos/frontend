import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./article.module.scss";
import formatDate from "./formatDate";
import {
  faAngleLeft,
  faCalendar,
  faClock,
  faCode,
  faTag,
  faTags,
  faUser,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { ReactNode } from "react";
import SolvedAcTier from "../study/[studyId]/assignments/solved_ac_tier";

type Props = {
  title: string;
  author?: string;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  problem?: {
    difficultyLevel: number;
    title: string;
  };
  language?: string;
  userCount?: {
    maximum: number;
    current: number;
  };
  date: Date;
  listHref: string;
  children: ReactNode;
};

export default function Article(props: Props) {
  return (
    <div className={styles.article}>
      <Link href={props.listHref} className={styles.goToList}>
        <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>&nbsp;게시글
        목록으로
      </Link>
      <h1 className={styles.title}>{props.title}</h1>
      <ul className={styles.info}>
        <li>
          <FontAwesomeIcon icon={faClock}></FontAwesomeIcon>{" "}
          {formatDate(props.date, true)}
        </li>
        {props.author && (
          <li>
            <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> {props.author}
          </li>
        )}
        {(props.startDate || props.endDate) && (
          <li>
            <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>&nbsp;
            {props.startDate ? formatDate(props.startDate) : ""} ~&nbsp;
            {props.endDate ? formatDate(props.endDate) : ""}
          </li>
        )}
        {props.userCount?.maximum && props.userCount.current && (
          <li>
            <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>&nbsp;
            {props.userCount.current} / {props.userCount?.maximum}
          </li>
        )}
        {(props.tags?.length ?? 0) > 0 && (
          <li>
            <FontAwesomeIcon
              icon={props.tags?.length === 1 ? faTag : faTags}
            ></FontAwesomeIcon>
            &nbsp;
            {props.tags?.join(", ")}
          </li>
        )}
        {props.problem && (
          <li>
            <SolvedAcTier
              className={styles.solvedAc}
              level={props.problem.difficultyLevel}
            ></SolvedAcTier>
            &nbsp;
            {props.problem.title}
          </li>
        )}
        {props.language && (
          <li>
            <FontAwesomeIcon icon={faCode}></FontAwesomeIcon>
            &nbsp;
            {props.language}
          </li>
        )}
      </ul>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
