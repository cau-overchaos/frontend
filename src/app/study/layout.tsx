import styles from './layout.module.scss'
import { ReactNode } from "react";
import MainNavbar from "../main_navbar/main_navbar";
import LeftMenu, { LeftMenuItem } from "./left_menu/left_menu";
import { faBook, faCode, faComments, faShare, faUsers } from "@fortawesome/free-solid-svg-icons";

export default function StudyLayout({ children }: { children?: ReactNode | ReactNode[]}) {
    return <div className={styles.layoutRoot}>
        <MainNavbar narrowContainer={true}></MainNavbar>
        <div className={styles.layoutContainer}>
            <LeftMenu>
                <LeftMenuItem icon={faCode} text="온라인 IDE" href="#"></LeftMenuItem>
                <LeftMenuItem icon={faComments} text="채팅" href="#"></LeftMenuItem>
                <LeftMenuItem icon={faShare} text="풀이 공유" href="#"></LeftMenuItem>
                <LeftMenuItem icon={faBook} text="과제" href="#"></LeftMenuItem>
                <LeftMenuItem icon={faUsers} text="인원" href="#"></LeftMenuItem>
            </LeftMenu>
            {children}
        </div>
    </div>
}