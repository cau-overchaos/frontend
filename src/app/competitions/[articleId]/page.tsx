import Article from "@/app/board/article";
import MainLayout from "@/app/main_layout";
import styles from "./page.module.scss";

export default function CompetitionArticlePage() {
  return (
    <MainLayout>
      <Article
        title="2024 카카오 채융 연계형 겨울 인턴십 코딩테스트"
        author="관리자"
        date={new Date(2023, 10, 7)}
        listHref="/competitions"
        startDate={new Date(2023, 10, 25)}
        endDate={new Date(2023, 10, 26)}
        tags={["Javascript", "Java", "C++", "Python", "Swift", "Kotlin"]}
        contentClassName={styles.article}
      >
        <p>
          카카오에서{" "}
          <a href="https://stylescareers.kakao.com/jobs/P-13426">
            채용 연계형 겨울 인턴십
          </a>
          을 모집하고 있습니다.
          <br />
          서류 접수는 11월 8일부터 11월 20일까지이며, 코딩 테스트는 11월 25일에
          실시됩니다. 그리고 System Engineering / Open Source Platform
          Engineering 분야 지원자는 11월 26일에 2차 코딩 테스트가 실시됩니다.
        </p>
        <p>
          이번 코딩테스트는 Javascript, Java, C++, Python, Swfit, Kotlin중
          하나를 선택하여 응시하실 수 있습니다.
        </p>
        <p>
          <a href="https://tech.kakao.com/2022/07/13/2022-coding-test-summer-internship/">
            전년도 코딩테스트 해설
          </a>
          에 따르면, 구현과 자료구조, DP, 다익스트라 알고리즘 응용 문제들로 총
          5문제가 출제됐습니다. 자료구조와 구현, DP를 중심으로 공부하시되
          일반적인 컴퓨터공학 학사과정에서 공부하는 알고리즘을 복습하시면 큰
          무리 없이 준비하실 수 있을 것 같습니다!
        </p>
      </Article>
    </MainLayout>
  );
}
