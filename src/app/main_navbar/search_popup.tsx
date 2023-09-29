import classNames from "classnames";
import styles from "./search_popup.module.scss";
import { KeyboardEventHandler, useState } from "react";

type Props = {
  active: boolean;
  onCloseButtonClick: () => void;
  onSearchRequest: (query: string) => void;
  onAutocompleteRequest: (query: string) => Promise<string[]>;
};

export default function SearchPopup(props: Props) {
  const [query, setQuery] = useState<string>("");
  const [autocompletes, setAutocompletes] = useState<string[]>([]);
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] = useState<
    number | null
  >(null);
  const handleAutocomplete: KeyboardEventHandler<HTMLInputElement> = (evt) => {
    const value = (evt.target as HTMLInputElement).value;

    if (evt.key === "ArrowDown" && autocompletes.length > 0) {
      let newIndex =
        selectedAutocompleteIndex === null ? 0 : selectedAutocompleteIndex + 1;
      if (newIndex < autocompletes.length) {
        setSelectedAutocompleteIndex(newIndex);
      } else {
        setSelectedAutocompleteIndex(null);
      }
    } else if (evt.key === "ArrowUp" && autocompletes.length > 0) {
      let newIndex =
        selectedAutocompleteIndex === null
          ? autocompletes.length - 1
          : selectedAutocompleteIndex - 1;
      if (newIndex >= 0) {
        setSelectedAutocompleteIndex(newIndex);
      } else {
        setSelectedAutocompleteIndex(null);
      }
    } else if (evt.key === "Enter") {
      if (selectedAutocompleteIndex === null) {
        props.onSearchRequest(value);
      } else if (autocompletes.length > 0) {
        setQuery(autocompletes[selectedAutocompleteIndex]);
        props
          .onAutocompleteRequest(autocompletes[selectedAutocompleteIndex])
          .then(setAutocompletes)
          .catch(() => {
            setAutocompletes([]);
          })
          .then(() => {
            setSelectedAutocompleteIndex(null);
          });
      }
      evt.preventDefault();
    } else {
      props
        .onAutocompleteRequest(value)
        .then(setAutocompletes)
        .catch(() => {
          setAutocompletes([]);
        })
        .then(() => {
          setSelectedAutocompleteIndex(null);
        });
    }
  };

  return (
    <div
      className={classNames(styles.background, props.active && styles.active)}
      onClickCapture={(evt) => {
        if ((evt.target as HTMLElement).tagName !== "INPUT")
          props.onCloseButtonClick();
      }}
    >
      <div className={styles.search}>
        <input
          type="text"
          value={query}
          onChange={(evt) => setQuery(evt.target.value)}
          className={styles.input}
          onKeyUp={handleAutocomplete}
          placeholder="검색어를 입력하세요..."
        />

        {autocompletes.length > 0 && (
          <ul className={styles.autocomplete}>
            {autocompletes.map((i, idx) => (
              <li
                className={
                  idx === selectedAutocompleteIndex ? styles.active : ""
                }
                key={i}
              >
                {i}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
