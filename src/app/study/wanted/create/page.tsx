"use client";

import apiClient, { StudyRoom } from "@/app/api_client/api_client";
import { Button, Input, Textarea } from "@/app/common/inputs";
import MainLayout from "@/app/main_layout";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import styles from "./page.module.scss";
import ReactSelect from "react-select";
import { useEffect, useState } from "react";
import classNames from "classnames";

type ReactSelectItem = { value: number; label: string };

export default function CreateRecruitPostPage() {
  const [studyrooms, setStudyrooms] = useState<ReactSelectItem[] | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // after 1week
  );
  const [selectedStudyroom, setSelectedStudyroom] =
    useState<ReactSelectItem | null>(null);

  useEffect(() => {
    if (studyrooms === null)
      apiClient.studyrooms("managing").then((i) =>
        setStudyrooms(
          i.map((j) => ({
            label: j.title,
            value: j.id
          }))
        )
      );
  }, [studyrooms]);

  const submit = () => {
    if (dueDate === null) return alert("마감일을 선택해주세요!");
    if (selectedStudyroom === null) return alert("스터디방을 선택해주세요,");

    apiClient
      .recruitPosts()
      .createPost({
        content,
        title,
        dueDate,
        studyRoomId: selectedStudyroom.value
      })
      .then((i) => location.assign(`/study/wanted/`))
      .catch((i) => alert(`오류가 발생했습니다: ${i.message}`));
  };

  return (
    <MainLayout>
      <h1>게시글 작성</h1>
      <form className={styles.form}>
        <div className={styles.row}>
          <div className={classNames(styles.field, styles.title)}>
            <label className={styles.label}>제목</label>
            <Input
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
            ></Input>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>스터디방</label>
            <div className={styles.select}>
              <ReactSelect
                options={studyrooms ?? []}
                value={selectedStudyroom}
                onChange={setSelectedStudyroom}
                placeholder="선택해주세요..."
              ></ReactSelect>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>마감일</label>
            <DateTimePicker
              format="yyyy.MM.dd."
              value={dueDate}
              onChange={setDueDate}
            ></DateTimePicker>
          </div>
        </div>
        <div className={classNames(styles.field, styles.content)}>
          <label className={styles.label}>내용</label>
          <Textarea
            border
            value={content}
            onChange={(evt) => setContent(evt.target.value)}
          ></Textarea>
        </div>
        <div className={styles.field}>
          <Button onClick={submit}>작성</Button>
        </div>
      </form>
    </MainLayout>
  );
}
