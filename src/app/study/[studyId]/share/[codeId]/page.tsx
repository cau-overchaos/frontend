"use client";

import { Button } from "@/app/common/inputs";
import { IdeHighlighterType } from "../../ide/ide";
import styles from "./page.module.scss";
import LineComments from "../lineComments";
import SharedCodeViewer from "./sharedCodeViewer";

export default function ViewCode() {
  return (
    <div className={styles.container}>
      <Button>풀이 비교</Button>
      <SharedCodeViewer
        code={"#include <stdio.h>\n\nint main() {\n    //Do something\n}"}
        highlight={IdeHighlighterType.C}
        className={styles.code}
        onCommentClick={() => (
          <LineComments
            comments={[
              {
                authorId: "aa",
                content: "asdf".repeat(10000),
                id: "1",
                profileImgUrl: null,
                subcomments: [
                  {
                    authorId: "aa",
                    content: "asdf",
                    id: "2",
                    profileImgUrl: null
                  },
                  {
                    authorId: "aa",
                    content: "asdf".repeat(10000),
                    id: "3",
                    profileImgUrl: null
                  },
                  {
                    authorId: "aa",
                    content: "asdf",
                    id: "4",
                    profileImgUrl: null
                  },
                  {
                    authorId: "aa",
                    content: "asdf",
                    id: "5",
                    profileImgUrl: null
                  }
                ]
              },
              {
                authorId: "aa",
                content: "asdf",
                id: "6",
                profileImgUrl: null,
                subcomments: []
              },
              {
                authorId: "aa",
                content: "asdf",
                id: "7",
                profileImgUrl: null,
                subcomments: []
              }
            ]}
            onNewCommentRequest={(message) => {
              console.log(message);
            }}
            onNewSubcommentRequest={(message, replyTo) => {
              console.log(`${message} to ${replyTo}`);
            }}
          ></LineComments>
        )}
      ></SharedCodeViewer>
    </div>
  );
}
