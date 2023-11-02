"use client";

import styles from "./layout.module.scss";
import { ReactNode } from "react";
import MainNavbar from "../../main_navbar/main_navbar";
import LeftMenu, { LeftMenuItem } from "./left_menu/left_menu";
import {
  faBook,
  faCode,
  faComments,
  faShare,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

export default function StudyLayout({
  children
}: {
  children?: ReactNode | ReactNode[];
}) {
  const pathname = usePathname();
  const prefix = (/\/study\/([^\/]+)/.exec(pathname) ?? [""])[0];

  return (
    <div className={styles.layoutRoot}>
      <MainNavbar narrowContainer={true}></MainNavbar>
      <div className={styles.layoutContainer}>
        <LeftMenu>
          <LeftMenuItem
            icon={faCode}
            text="온라인 IDE"
            href={prefix + "/ide"}
          ></LeftMenuItem>
          <LeftMenuItem
            icon={faComments}
            text="채팅"
            href={prefix + "/chat"}
          ></LeftMenuItem>
          <LeftMenuItem
            icon={faShare}
            text="풀이 공유"
            href={prefix + "/share"}
          ></LeftMenuItem>
          <LeftMenuItem
            icon={faBook}
            text="과제"
            href={prefix + "/assignments"}
          ></LeftMenuItem>
          <LeftMenuItem
            icon={faUsers}
            text="인원"
            href={prefix + "/people"}
          ></LeftMenuItem>
        </LeftMenu>
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
}
