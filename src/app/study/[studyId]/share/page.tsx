import Board, { Article } from "@/app/board/board";
import SolvedAcTier from "../assignments/solved_ac_tier";
import styles from "./page.module.scss";

export default function () {
  return (
    <div className={styles.padded}>
      <Board title="코드 공유" withProblem>
        <Article
          title="Lorem ipsum"
          author="asdf"
          date={new Date()}
          href="share/1"
          problem={{
            id: "15649",
            tier: <SolvedAcTier level={8}></SolvedAcTier>,
            title: "N과 M (1)"
          }}
        ></Article>
      </Board>
    </div>
  );
}
