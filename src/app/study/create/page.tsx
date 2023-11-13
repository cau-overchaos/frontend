"use client";

import { Button, Input, Textarea } from "@/app/common/inputs";
import MainLayout from "@/app/main_layout";
import styles from "./page.module.scss";
import { FormEventHandler, useEffect, useState } from "react";
import apiClient, { ProgammingLanguage } from "@/app/api_client/api_client";

export default function CreationForm() {
  const [title, setTitle] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(true);
  const [maximum, setMaximum] = useState<number>(10);
  const [description, setDescription] = useState<string>("");
  const [availableLanguages, setAvailableLanguages] = useState<
    ProgammingLanguage[]
  >([]);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    apiClient
      .createStudyroom({
        title,
        studyRoomVisibility: visible ? "PUBLIC" : "PRIVATE",
        maxUserCnt: maximum,
        description,
        programmingLanguageList: selectedLanguages
      })
      .then((studyRoom) => {
        location.href = `/study/${studyRoom.id}`;
      })
      .catch((err) => {
        alert(`오류가 발생했습니다: ${err.message}`);
      });
  };

  useEffect(() => {
    if (availableLanguages.length === 0)
      apiClient.programmingLanguages().then(setAvailableLanguages);
  }, [availableLanguages]);

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>스터디방 생성</h1>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>제목</label>
            <Input
              className={styles.input}
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
            ></Input>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>유형</label>
            <label className={styles.radio}>
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visible}
                onChange={(evt) => setVisible(evt.target.checked)}
              ></input>{" "}
              공개
            </label>
            <label className={styles.radio}>
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={!visible}
                onChange={(evt) => setVisible(!evt.target.checked)}
              ></input>{" "}
              비공개
            </label>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>최대인원</label>
            <Input
              className={styles.input}
              number
              value={maximum}
              onChange={(evt) => setMaximum(evt.target.valueAsNumber)}
            ></Input>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>설명</label>
            <Textarea
              border
              className={styles.input}
              value={description}
              onChange={(evt) => setDescription(evt.target.value)}
            ></Textarea>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>언어</label>
            <div className={styles.langs}>
              {availableLanguages.map((i) => (
                <label>
                  <input
                    type="checkbox"
                    name="lang"
                    value={i.id}
                    key={i.id}
                    checked={selectedLanguages.includes(i.id)}
                    onChange={(evt) => {
                      if (evt.target.checked)
                        setSelectedLanguages([...selectedLanguages, i.id]);
                      else {
                        const newval = JSON.parse(
                          JSON.stringify(selectedLanguages)
                        );
                        while (newval.includes(i.id))
                          newval.splice(newval.indexOf(i.id), 1);
                        setSelectedLanguages(newval);
                      }
                    }}
                  ></input>
                  &nbsp;{i.name}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.field}>
            <Button submit>생성</Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
