import Board, { Article } from "../board/board";
import MainLayout from "../main_layout";

export default function CompeititonArticleListPage() {
  return (
    <MainLayout>
      <Board noAuthor title="코딩 테스트/대회 공고">
        <Article
          title="test"
          href="/competitions/1"
          author="관리자"
          date={new Date()}
        ></Article>
      </Board>
    </MainLayout>
  );
}
