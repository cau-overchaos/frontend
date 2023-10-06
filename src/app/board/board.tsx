"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./board.module.scss";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight
} from "@fortawesome/free-solid-svg-icons";
import { MouseEventHandler, ReactNode } from "react";

type Prop = {
  children?: ReactNode;
  title?: string;
  pagination?: PaginationProp;
};

type PaginationProp = {
  first: number;
  current: number;
  last: number;
  onPaginationLinkClick: (newPage: number) => void;
};

type ArticleProp = {
  title: string;
  author: string;
  date: Date;
  href?: string;
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
  const dateString = `${props.date.getFullYear()}. ${
    props.date.getMonth() + 1
  }. ${props.date.getDate()}`;

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
      <td className={styles.fitAndCenter}>{props.author}</td>
      <td className={styles.fitAndCenter}>{dateString}</td>
    </tr>
  );
}

export default function Board(props: Prop) {
  return (
    <div className={styles.board}>
      {props.title && <h1>{props.title}</h1>}
      <table className={styles.articles}>
        <thead>
          <tr>
            <th>제목</th>
            <th className={styles.fitAndCenter}>글쓴이</th>
            <th className={styles.fitAndCenter}>날짜</th>
          </tr>
        </thead>
        <tbody>
          {!props.children ? (
            <tr>
              <td colSpan={3} className={styles.empty}>
                게시글이 없습니다
              </td>
            </tr>
          ) : (
            props.children
          )}
        </tbody>
      </table>

      {props.pagination && <Navigation {...props.pagination}></Navigation>}
    </div>
  );
}
