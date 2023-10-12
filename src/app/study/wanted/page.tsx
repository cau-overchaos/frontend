import Board, { Article } from "../../board/board";
import MainLayout from "../../main_layout";

export default function WantedListPage() {
  return (
    <MainLayout>
      <Board title="스터디원 구인">
        <Article
          title="test"
          href="/study/wanted/1"
          author="관리자"
          date={new Date()}
        ></Article>
      </Board>
    </MainLayout>
  );
}
