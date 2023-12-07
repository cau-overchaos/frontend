import Board, { Article } from "../board/board";
import MainLayout from "../main_layout";

export default function CompeititonArticleListPage() {
  return (
    <MainLayout>
      <Board noAuthor noWriteButton title="코딩 테스트/대회 공고">
        <Article
          title="2024 카카오 채융 연계형 겨울 인턴십 코딩테스트"
          href="/competitions/1"
          author="관리자"
          date={new Date(2023, 10, 7)}
        ></Article>
      </Board>
    </MainLayout>
  );
}
