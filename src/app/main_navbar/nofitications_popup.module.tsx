import classNames from 'classnames'
import styles from './notifications_popup.module.scss'
import popupStyles from './popup.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBellSlash, faCog, faEllipsis, faSignOut, faTrash } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

type propsType = {
    notifications?: {
        text: string;
        href: string;
        id: string
    }[]
}

export default function NotificationPopup(props: propsType) {
    const notifications = props.notifications ?? [];

    return <div className={classNames(popupStyles.container, styles.popup)}>
        <div className={popupStyles.popup}>
            <div className={popupStyles.top}>
                <ul className={styles.menu}>
                    {notifications.map(i => <li  key={i.id}>
                        <Link href={i.href}>
                            <FontAwesomeIcon className={styles.icon} icon={faBell}></FontAwesomeIcon>
                            <span>{i.text}</span>
                        </Link>
                    </li>)}
                    {notifications.length == 0 && <li><Link href="#">
                        <FontAwesomeIcon className={styles.icon} icon={faBellSlash}></FontAwesomeIcon>
                        <span>알림이 없습니다.</span>
                    </Link></li> }
                </ul>    
            </div>
            <hr className={popupStyles.divider}></hr>
            <div className={popupStyles.bottom}>
                <ul className={styles.actions}>
                    <li>
                        <a href="#">
                            <FontAwesomeIcon className={styles.icon} icon={faEllipsis}></FontAwesomeIcon>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <FontAwesomeIcon className={styles.icon} icon={faTrash}></FontAwesomeIcon>
                        </a>
                    </li>
                </ul>    
            </div>
        </div>
    </div> 
}