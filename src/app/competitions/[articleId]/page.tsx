import Article from "@/app/board/article";
import MainLayout from "@/app/main_layout";

export default function CompetitionArticlePage() {
  return (
    <MainLayout>
      <Article
        title="Lorem ipsum"
        author="관리자"
        date={new Date()}
        listHref="/competitions"
        startDate={new Date()}
        endDate={new Date()}
        tags={["Javascript", "Java"]}
      >
        adsf
      </Article>
    </MainLayout>
  );
}
