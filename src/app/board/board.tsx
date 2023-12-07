"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./board.module.scss";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faExclamationTriangle,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { MouseEventHandler, ReactNode } from "react";
import formatDate from "./formatDate";
import classNames from "classnames";
import { Button } from "../common/inputs";
import { useRouter } from "next/navigation";

type Prop = {
  children?: ReactNode;
  title?: string;
  noAuthor?: boolean;
  noDate?: boolean;
  noWriteButton?: boolean;
  withProblem?: boolean;
  loading?: boolean;
  error?: string;
  pagination?: PaginationProp;
  writeButtonText?: string;
  writeButtonHref?: string;
  onWriteButtonClick?: () => void;
};

type PaginationProp = {
  first: number;
  current: number;
  last: number;
  onPaginationLinkClick: (newPage: number) => void;
};

type ArticleProp = {
  title: string;
  author?: string;
  date?: Date;
  href?: string;
  problem?: {
    tier: ReactNode;
    id?: number;
    title: string;
  };
  onClick?: () => void;
} & ({ href: string } | { onClick: () => void });

function Navigation(props: PaginationProp) {
  const paginate = (newPage: number): MouseEventHandler<HTMLAnchorElement> => {
    return (evt) => {
      evt.preventDefault();
      props.onPaginationLinkClick(newPage);
    };
  };
  return props.first === props.last ? null : (
    <nav className={styles.pagination}>
      <ul>
        <li>
          {props.current !== props.first && (
            <a href="#" onClick={paginate(props.first)}>
              <FontAwesomeIcon icon={faAnglesLeft}></FontAwesomeIcon>
              처음
            </a>
          )}
        </li>
        <li>
          {props.current > props.first && (
            <a href="#" onClick={paginate(props.current - 1)}>
              <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
              이전
            </a>
          )}
        </li>
        <li>
          {props.current < props.last && (
            <a href="#" onClick={paginate(props.current + 1)}>
              다음
              <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
            </a>
          )}
        </li>
        <li>
          {props.current !== props.last && (
            <a href="#" onClick={paginate(props.last)}>
              마지막
              <FontAwesomeIcon icon={faAnglesRight}></FontAwesomeIcon>
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
}

export function Article(props: ArticleProp) {
  const dateString = props.date ? formatDate(props.date) : null;

  return (
    <tr>
      <td>
        <a
          href={props.href}
          onClick={(evt) => {
            if (props.onClick) {
              evt.preventDefault();
              props.onClick();
            }
          }}
        >
          {props.title}
        </a>
      </td>
      {props.problem && (
        <td className={styles.problem}>
          <div className={styles.tier}>{props.problem.tier}</div>&nbsp;
          {props.problem.id ? `${props.problem.id} - ` : ""}
          {props.problem.title}
        </td>
      )}
      <td className={classNames(styles.fitAndCenter, styles.author)}>
        {props.author}
      </td>
      <td className={classNames(styles.fitAndCenter, styles.date)}>
        {dateString}
      </td>
    </tr>
  );
}

export default function Board(props: Prop) {
  let message = null;
  let columns = props.withProblem ? 4 : 3;
  const router = useRouter();
  if (props.error) {
    message = (
      <tr>
        <td colSpan={columns} className={styles.loading}>
          <FontAwesomeIcon icon={faExclamationTriangle}></FontAwesomeIcon>
          <br />
          {props.error}
        </td>
      </tr>
    );
  } else if (props.loading) {
    message = (
      <tr>
        <td colSpan={columns} className={styles.loading}>
          <FontAwesomeIcon icon={faSpinner} spin></FontAwesomeIcon>
          <br />
          불러오고 있습니다...
        </td>
      </tr>
    );
  } else if (!props.children) {
    message = (
      <tr>
        <td colSpan={columns} className={styles.empty}>
          게시글이 없습니다
        </td>
      </tr>
    );
  }

  return (
    <div
      className={classNames(
        styles.board,
        props.noAuthor && styles.noAuthor,
        props.noDate && styles.noDate
      )}
    >
      {props.title && <h1>{props.title}</h1>}
      <table className={styles.articles}>
        <thead>
          <tr>
            <th>제목</th>
            {props.withProblem && <th>문제</th>}
            <th className={classNames(styles.fitAndCenter, styles.author)}>
              글쓴이
            </th>
            <th className={classNames(styles.fitAndCenter, styles.date)}>
              날짜
            </th>
          </tr>
        </thead>
        <tbody>{message || props.children}</tbody>
      </table>

      <div className={styles.navAndWrite}>
        {props.pagination && <Navigation {...props.pagination}></Navigation>}
        {!(props.noWriteButton ?? false) && (
          <Button
            className={styles.write}
            onClick={(evt) => {
              evt.preventDefault();

              if (props.writeButtonHref) {
                router.push(props.writeButtonHref);
              } else if (props.onWriteButtonClick) {
                props.onWriteButtonClick();
              }
            }}
          >
            {props.writeButtonText || "작성"}
          </Button>
        )}
      </div>
    </div>
  );
}
