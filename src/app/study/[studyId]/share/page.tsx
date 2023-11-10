"use client";

import Board, { Article } from "@/app/board/board";
import SolvedAcTier from "../assignments/solved_ac_tier";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import apiClient from "@/app/api_client/api_client";
import { useParams } from "next/navigation";
import { SharedSourceCode } from "@/app/api_client/studyroom";

export default function SharePage() {
  const params = useParams();
  const [sharedCodes, setSharedCodes] = useState<SharedSourceCode[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (sharedCodes.length === 0)
      apiClient
        .studyroom(parseInt(params.studyId as string))
        .sharedSourceCodes()
        .then(setSharedCodes)
        .catch((err) => setError(err.message))
        .then(() => setError(undefined));
  }, [sharedCodes]);

  return (
    <div className={styles.padded}>
      <Board
        title="코드 공유"
        withProblem
        loading={sharedCodes.length === 0}
        error={error}
      >
        {sharedCodes.map((i) => (
          <Article
            title={i.title}
            author={i.writer.nickname}
            date={new Date()}
            href={`share/${i.id}`}
            problem={{
              tier: (
                <SolvedAcTier level={i.problem.difficultyLevel}></SolvedAcTier>
              ),
              title: i.problem.title
            }}
          ></Article>
        ))}
      </Board>
    </div>
  );
}
