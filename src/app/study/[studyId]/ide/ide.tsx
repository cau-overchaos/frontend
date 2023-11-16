"use client";

import styles from "./ide.module.scss";
import { Button, Input, ProblemInput, Textarea } from "@/app/common/inputs";
import ReactSelect from "react-select";
import CodeEditor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/themes/prism.css";
import { encode } from "html-entities";
import apiClient, { ProblemProviderKey } from "@/app/api_client/api_client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export enum IdeChangeEventType {
  CodeTitle,
  Code,
  Input,
  Output
}

export enum IdeHighlighterType {
  C,
  Cpp,
  Python,
  Java,
  Javascript
}

export type Language = {
  label: string;
  value: string;
  highlight?: IdeHighlighterType;
};
export type Problem = {
  title: string;
  pid: number;
  level: number;
  provider: ProblemProviderKey;
};

type Props = {
  supportedLanuages: Language[];
  selectedLanguage?: Language;
  selectedProblem?: Pick<Problem, "pid" | "provider">;
  codeTitle: string;
  code: string;
  input: string;
  output: string;
  errorOutput?: string;
  infoOutput?: string;
  loadingOutput?: boolean;

  onSave: () => void;
  onLoad: () => void;
  onCompile: () => void;
  onChange: (type: IdeChangeEventType, newValue: string) => void;
  onLanguageSelect: (newLanguage: Language | null) => void;
  onProblemIdInput: (
    newProblem: Pick<Problem, "pid" | "provider"> | null
  ) => void;
};

export default function Ide(props: Props) {
  const highlightCode = (code: string) => {
    switch (props.selectedLanguage?.highlight) {
      case IdeHighlighterType.C:
        return highlight(code, languages.c, "c");
      case IdeHighlighterType.Cpp:
        return highlight(code, languages.cpp, "cpp");
      case IdeHighlighterType.Java:
        return highlight(code, languages.java, "java");
      case IdeHighlighterType.Javascript:
        return highlight(code, languages.javascript, "javascript");
      case IdeHighlighterType.Python:
        return highlight(code, languages.python, "python");
      default:
        return encode(code);
    }
  };

  const [problemDetail, setProblemDetail] = useState<Problem | null>(null);
  useEffect(() => {
    if (
      props.selectedProblem &&
      problemDetail?.pid !== props.selectedProblem.pid
    ) {
      apiClient
        .getProblem(props.selectedProblem?.pid, props.selectedProblem?.provider)
        .then((result) => {
          setProblemDetail({
            level: result.difficultyLevel,
            pid: result.pid,
            provider: result.provider,
            title: result.title
          });
        })
        .catch(() => {
          setProblemDetail({
            level: 0,
            pid: props.selectedProblem?.pid!,
            provider: props.selectedProblem?.provider ?? "BAEKJOON",
            title: "????"
          });
        });
    }
  }, [props.selectedProblem?.pid]);

  return (
    <div className={styles.ide}>
      <div className={styles.hasCode}>
        <div className={styles.menu}>
          {/* <ReactSelect<Problem>
            placeholder="문제 제목"
            options={props.availableProblems}
            defaultValue={props.selectedProblem}
            onChange={(newValue) => props.onProblemSelect(newValue)}
          ></ReactSelect> */}
          <ProblemInput
            placeholder="문제 번호"
            problemLevel={problemDetail?.level}
            problemTitle={problemDetail?.title}
            className={styles.saveBtn}
            value={props.selectedProblem?.pid}
            onChange={(evt) => {
              props.onProblemIdInput({
                pid: evt.target.valueAsNumber,
                provider: "BAEKJOON"
              });
            }}
            size={6}
          ></ProblemInput>
          <Input
            placeholder="코드 이름"
            className={styles.saveBtn}
            value={props.codeTitle}
            onChange={(evt) =>
              props.onChange(IdeChangeEventType.CodeTitle, evt.target.value)
            }
            size={15}
          ></Input>
          <Button onClick={props.onSave}>저장</Button>
          <Button onClick={props.onLoad}>불러오기</Button>
          <ReactSelect<Language>
            placeholder="언어 선택"
            options={props.supportedLanuages}
            defaultValue={props.selectedLanguage}
            onChange={(newValue) => props.onLanguageSelect(newValue)}
          ></ReactSelect>
          <Button onClick={props.onCompile}>컴파일</Button>
        </div>
        <div className={styles.code}>
          <CodeEditor
            value={props.code}
            onValueChange={(code) =>
              props.onChange(IdeChangeEventType.Code, code)
            }
            highlight={(code) => highlightCode(code)}
            padding={12}
            className={styles.textarea}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 20
            }}
          />
        </div>
      </div>
      <div className={styles.hasIo}>
        <div className={styles.input}>
          <h1>입력</h1>
          <Textarea
            noBackground
            value={props.input}
            onChange={(evt) =>
              props.onChange(IdeChangeEventType.Input, evt.target.value)
            }
          ></Textarea>
        </div>
        <div className={styles.output}>
          <h1>출력</h1>
          {props.loadingOutput ? (
            <div className={styles.loading}>
              <FontAwesomeIcon icon={faSpinner} spin></FontAwesomeIcon>
            </div>
          ) : (
            <div className={styles.outputContainer}>
              {props.output}
              {props.errorOutput && (
                <>
                  {props.output !== "" && <br></br>}
                  <span className={styles.errorOutput}>
                    {props.errorOutput}
                  </span>
                </>
              )}
              {props.infoOutput && (
                <>
                  {props.output + (props.errorOutput ?? "") !== "" && <br></br>}
                  <span className={styles.infoOutput}>{props.infoOutput}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
