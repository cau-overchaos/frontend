"use client";

import { useEffect, useState } from "react";
import Board, { Article } from "../../board/board";
import MainLayout from "../../main_layout";
import { RecruitPostInfo } from "@/app/api_client/recruits";
import apiClient from "@/app/api_client/api_client";

export default function WantedListPage() {
  const [posts, setPosts] = useState<RecruitPostInfo[] | null>(null);

  useEffect(() => {
    if (posts === null) apiClient.recruitPosts().getPosts().then(setPosts);
  }, [posts]);

  return (
    <MainLayout>
      <Board
        title="스터디원 구인"
        noDate
        writeButtonHref="/study/wanted/create"
      >
        {posts?.map((i) => (
          <Article
            title={i.title}
            href={`/study/wanted/${i.id}`}
            author={i.writer.name}
            key={i.id}
          ></Article>
        ))}
      </Board>
    </MainLayout>
  );
}
