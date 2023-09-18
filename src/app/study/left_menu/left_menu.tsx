import { ReactNode } from 'react';
import styles from './left_menu.module.scss'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type LeftMenuProps = {
    children: ReactNode;
};

type LeftMenuItemProps = {
    icon: IconDefinition;
    href: string;
    text: string;
};

export default function LeftMenu (props: LeftMenuProps) {
    return <nav className={styles.leftMenu}>
        <ul>
              {props.children}
        </ul>
    </nav>
}

export function LeftMenuItem(props: LeftMenuItemProps) {
    return <li>
        <Link href={props.href}>
            <div className={styles.icon}><FontAwesomeIcon icon={props.icon}></FontAwesomeIcon></div>
            <div className={styles.text}>{props.text}</div>
        </Link>
    </li>
}