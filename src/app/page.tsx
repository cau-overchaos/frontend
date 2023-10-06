"use client";

import styles from "./page.module.scss";
import SummariedBoardWidget, {
  SummariedArticle
} from "./summaried_board_widget/summaried_board_widget";
import MainLayout from "./main_layout";
import { useEffect, useState } from "react";
import apiClient, { StudyRoom } from "./api_client";

export default function Home() {
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const [participatedLoaded, setParticipatedLoaded] = useState<boolean>(false);
  const [all, setAll] = useState<StudyRoom[]>([]);
  const [participated, setParticipated] = useState<StudyRoom[]>([]);

  useEffect(() => {
    if (!allLoaded) {
      apiClient.studyrooms("all").then((all) => {
        setAllLoaded(true);
        setAll(all);
      });
    }

    if (!participatedLoaded) {
      apiClient
        .studyrooms("participated")
        .then((participated) => {
          setParticipatedLoaded(true);
          setParticipated(participated);
        })
        .finally(() => {
          setParticipatedLoaded(true);
        });
    }
  });

  return (
    <MainLayout>
      <div className={styles.boards}>
        <SummariedBoardWidget boardName="알고리즘 스터디 모임">
          {all.map((i) => (
            <SummariedArticle
              title={i.title}
              href={`/study/${i.id}`}
              tags={[]}
            ></SummariedArticle>
          ))}
        </SummariedBoardWidget>
        <SummariedBoardWidget boardName="내 스터디">
          {participated.map((i) => (
            <SummariedArticle
              title={i.title}
              href={`/study/${i.id}`}
              tags={[]}
            ></SummariedArticle>
          ))}
        </SummariedBoardWidget>
      </div>
    </MainLayout>
  );
}
