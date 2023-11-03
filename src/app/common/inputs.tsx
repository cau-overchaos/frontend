import {
  ChangeEventHandler,
  DetailedHTMLProps,
  MouseEventHandler,
  ReactNode,
  SelectHTMLAttributes
} from "react";
import styles from "./inputs.module.scss";
import classNames from "classnames";

type ButtonProps = {
  children: ReactNode;
  submit?: boolean;
  className?: string;
  small?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type InputCommonProps<T> = {
  placeholder?: string;
  value?: string | number;
  className?: string;
  name?: string;
  required?: boolean;
  small?: boolean;
  onChange?: ChangeEventHandler<T>;
};

type InputProps = InputCommonProps<HTMLInputElement> & {
  password?: boolean;
  invalid?: boolean;
  minLength?: number;
  pattern?: string;
  number?: boolean;
  onEnter?: () => void;
};

export function Button(props: ButtonProps) {
  return (
    <button
      type={props.submit ? "submit" : "button"}
      className={classNames(
        styles.input,
        props.small && styles.small,
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function Input(props: InputProps) {
  let type = "input";
  if (props.password) type = "password";
  else if (props.number) type = "number";
  return (
    <input
      required={props.required}
      pattern={props.pattern}
      type={type}
      name={props.name}
      minLength={props.minLength}
      className={classNames(
        styles.input,
        props.className,
        props.invalid && "invalid",
        props.small && styles.small
      )}
      value={props.value}
      onChange={props.onChange}
      onKeyUp={
        typeof props.onEnter !== "undefined"
          ? (evt) => {
              if (evt.key === "Enter") {
                evt.preventDefault();
                props.onEnter!();
              }
            }
          : undefined
      }
      placeholder={props.placeholder}
    ></input>
  );
}

export function Textarea(
  props: InputCommonProps<HTMLTextAreaElement> & {
    noBackground?: boolean;
    border?: boolean;
  }
) {
  return (
    <textarea
      name={props.name ?? undefined}
      className={classNames(
        styles.input,
        props.className,
        props.noBackground && styles.noBackground,
        props.border && styles.border
      )}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    ></textarea>
  );
}

export function Select(
  props: DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > & {
    small?: boolean;
  }
) {
  return (
    <select
      {...props}
      className={classNames(
        styles.input,
        props.className,
        props.small && styles.small
      )}
    ></select>
  );
}
