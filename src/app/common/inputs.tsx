import { ChangeEventHandler, MouseEventHandler, ReactNode } from "react"
import styles from "./inputs.module.scss"
import classNames from "classnames"

type ButtonProps = {
    children: ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

type InputProps<T> = {
    placeholder?: string;
    value?: string;
    className?: string;
    onChange?: ChangeEventHandler<T>;
}

export function Button(props: ButtonProps) {
    return <button type="button" className={styles.input} onClick={props.onClick}>
        { props.children }
    </button>
}

export function Input(props: InputProps<HTMLInputElement>) {
    return <input type="input" className={classNames(styles.input, props.className)} value={props.value} onChange={props.onChange} placeholder={props.placeholder}>

    </input>
}

export function Textarea(props: InputProps<HTMLTextAreaElement> & {noBackground?: boolean}) {
    return <textarea className={classNames(styles.input, props.className, props.noBackground && styles.noBackground)} value={props.value} onChange={props.onChange} placeholder={props.placeholder}>

    </textarea>
}