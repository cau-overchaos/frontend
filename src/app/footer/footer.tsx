import styles from './footer.module.scss'
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';

export default function Footer() {
    return <footer className={styles.footer}>
        <a href="https://github.com/cau-overchaos/algogather" className={styles.github}>
            <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>
        </a>
        <p>
            <ul className={styles.links}>
                <li><Link href="#">CONTACT US</Link></li>
                <li><Link href="#">개인정보처리방침</Link></li>
            </ul>
        </p>
        <p className={styles.copyright}>
        © 2023 Overchaos
        </p>
    </footer>
}