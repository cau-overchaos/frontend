import Article from "@/app/board/article";
import MainLayout from "@/app/main_layout";

export default function () {
  return (
    <MainLayout>
      <Article
        title="Lorem ipsum"
        author="관리자"
        date={new Date()}
        listHref="/competitions"
        endDate={new Date()}
        wantedCount={3}
        tags={["Javascript", "Java"]}
      >
        adsf
      </Article>
    </MainLayout>
  );
}
