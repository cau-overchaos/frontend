import { ReactNode } from 'react'
import SolvedAcTier from '../solved_ac_tier'
import styles from './assignment.module.scss'

type AssignmentProps = {
    solvedAcTier: number;
    problemId: number;
    problemName: string;
    children?: ReactNode
}

type AssigneeProps = {
    profileImageUrl?: string;
    nickname: string
}

export default function Assignment(props: AssignmentProps) {
    return <div className={styles.assignment}>
        <div className={styles.problem}>
            <div className={styles.tier}>
                <SolvedAcTier level={props.solvedAcTier} className={styles.tier}></SolvedAcTier>
            </div>
            <div className={styles.id}>{ props.problemId }</div>
            <div className={styles.name}>{ props.problemName }</div>
        </div>
        <ul className={styles.assignees}>
            { props.children }
        </ul>
    </div>
}

export function Assignee(props: AssigneeProps) {
    return <li className={styles.assignee}>
        <img src="" alt="" className={styles.profile} style={{
            background: props.profileImageUrl && `url(${props.profileImageUrl})`,
            backgroundSize: 'cover'
        }} />
        <div className={styles.nickname}>
            { props.nickname }
        </div>
    </li>
}

export function AssignmentContainer(props: {children?: ReactNode}) {
    return <div className={styles.assignments}>
        { props.children }
    </div>
}