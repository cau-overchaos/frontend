"use client";

import { useSearchParams } from "next/navigation";
import Board, { Article } from "../board/board";
import MainLayout from "../main_layout";
import { useEffect, useState } from "react";
import apiClient, { StudyRoom } from "../api_client";

export default function () {
  const [loading, setLoading] = useState<boolean>(true);
  const [studies, setStudies] = useState<StudyRoom[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const params = useSearchParams();
  const pageLimit = 25;
  const participatedOnly = params.get("participated") === "true";
  useEffect(() => {
    if (loading)
      apiClient
        .studyrooms(participatedOnly ? "participated" : "all")
        .then((result) => {
          setLoading(false);
          setStudies(result);
        })
        .catch((err: Error) => {
          setError(err.message || "알 수 없는 오류가 발생했습니다.");
        });
  });

  return (
    <MainLayout>
      <Board
        noDate
        noAuthor
        writeButtonHref="/study/create"
        writeButtonText="새 스터디 생성"
        title={participatedOnly ? "내 스터디 목록" : "전체 스터디 목록"}
        loading={loading}
        error={error ?? undefined}
        pagination={
          loading
            ? undefined
            : studies.length > 0
            ? {
                first: 1,
                current: page,
                last: Math.ceil(studies.length / pageLimit),
                onPaginationLinkClick: setPage
              }
            : undefined
        }
      >
        {studies.length === 0
          ? null
          : studies.map((i) => (
              <Article title={i.title} href={`/study/${i.id}`}></Article>
            ))}
      </Board>
    </MainLayout>
  );
}
