import { ChangeEventHandler, MouseEventHandler, ReactNode } from "react";
import styles from "./inputs.module.scss";
import classNames from "classnames";

type ButtonProps = {
  children: ReactNode;
  submit?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type InputCommonProps<T> = {
  placeholder?: string;
  value?: string;
  className?: string;
  name?: string;
  required?: boolean;
  onChange?: ChangeEventHandler<T>;
};

type InputProps = InputCommonProps<HTMLInputElement> & {
  password?: boolean;
  invalid?: boolean;
  minLength?: number;
  pattern?: string;
};

export function Button(props: ButtonProps) {
  return (
    <button
      type={props.submit ? "submit" : "button"}
      className={styles.input}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function Input(props: InputProps) {
  return (
    <input
      required={props.required}
      pattern={props.pattern}
      type={props.password ? "password" : "input"}
      name={props.name}
      minLength={props.minLength}
      className={classNames(
        styles.input,
        props.className,
        props.invalid && "invalid"
      )}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    ></input>
  );
}

export function Textarea(
  props: InputCommonProps<HTMLTextAreaElement> & { noBackground?: boolean }
) {
  return (
    <textarea
      name={props.name ?? undefined}
      className={classNames(
        styles.input,
        props.className,
        props.noBackground && styles.noBackground
      )}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    ></textarea>
  );
}
