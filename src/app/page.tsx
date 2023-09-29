import styles from "./page.module.scss";
import MainNavbar from "./main_navbar/main_navbar";
import SummariedBoardWidget, {
  SummariedArticle
} from "./summaried_board_widget/summaried_board_widget";
import responsiveness from "./responsiveness.module.scss";
import Footer from "./footer/footer";
import classNames from "classnames";
import MainLayout from "./main_layout";

export default function Home() {
  return (
    <MainLayout>
      <div className={styles.boards}>
        <SummariedBoardWidget boardName="코딩테스트 / 대회 공고"></SummariedBoardWidget>
        <SummariedBoardWidget boardName="알고리즘 스터디 모임"></SummariedBoardWidget>
      </div>
    </MainLayout>
  );
}
