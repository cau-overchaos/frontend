"use client";

import apiClient, { ProgammingLanguage } from "@/app/api_client/api_client";
import Ide, { IdeChangeEventType, IdeHighlighterType, Language } from "./ide";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SharedCodeSelectPopup from "../share/shared_color_select_dialog/sharedCodeSelectDialog";

export default function PeoplePage() {
  const params = useParams();
  const [availableLanguages, setAvailableLanguages] = useState<
    ProgammingLanguage[]
  >([]);
  const [selectedLanguage, setSelectedLanguages] =
    useState<ProgammingLanguage | null>(null);
  const [sourceCode, setSourceCode] = useState<string>(
    "#include <stdio.h>\n\nint main() {\n\n}"
  );
  const [programInput, setProgramInput] = useState<string>("3 1 2 3");
  const [programOutputs, setProgramOutputs] = useState<{
    output: string;
    loading: boolean;
    info: string;
    error: string;
  }>({
    output: "6",
    loading: false,
    info: "",
    error: ""
  });
  const [title, setTitle] = useState<string>("");
  const [selectedPid, setSelectedPid] = useState<number>(1001);
  const [loadDialogActive, setLoadDialogActive] = useState<boolean>(false);
  const langMap = (i: ProgammingLanguage): Language => ({
    label: i.name,
    value: i.id.toString(),
    highlight: i.name.toLowerCase().includes("c++")
      ? IdeHighlighterType.Cpp
      : i.name.toLowerCase().includes("python")
      ? IdeHighlighterType.Python
      : i.name.toLowerCase().includes("javascript")
      ? IdeHighlighterType.Javascript
      : i.name.toLowerCase().includes("java")
      ? IdeHighlighterType.Java
      : IdeHighlighterType.C // fallback to c
  });

  const studyId = parseInt(params.studyId as string);
  const studyroomClient = apiClient.studyroom(studyId);

  useEffect(() => {
    if (availableLanguages.length === 0)
      studyroomClient
        .programmingLanguages()
        .then((i) => setAvailableLanguages(i));
  }, [availableLanguages]);

  return (
    <>
      <Ide
        onCompile={() => {
          if (selectedLanguage === null)
            return alert("프로그래밍 언어를 선택해주세요!");

          setProgramOutputs({
            ...programOutputs,
            loading: true
          });
          studyroomClient
            .compile(sourceCode, selectedLanguage.id, programInput)
            .then((result) => {
              console.log(result);
              switch (result.type) {
                case "success":
                  setProgramOutputs({
                    error: "",
                    info: `종료코드: ${result.data.exitCode} / 실행시간: ${result.data.userTime}`,
                    loading: false,
                    output: result.data.output
                  });
                  break;
                case "compile_failure":
                  setProgramOutputs({
                    error: result.data.errorDescription,
                    info: "",
                    loading: false,
                    output: ""
                  });
                  break;
                case "execution_failure":
                  setProgramOutputs({
                    error: `종료코드: ${result.data.exitCode} / 실행시간: ${result.data.userTime}\n${result.data.errorDescription}`,
                    info: "",
                    loading: false,
                    output: ""
                  });
                  break;
              }
            })
            .catch((err) => {
              setProgramOutputs({
                error: "예기치 못한 오류가 발생했습니다!\n" + err.message,
                info: "",
                loading: false,
                output: ""
              });
            });
        }}
        onLanguageSelect={(lang) => {
          setSelectedLanguages(
            availableLanguages.find((i) => i.id.toString() == lang?.value)!
          );
        }}
        onProblemIdInput={(val) => {
          if (val) setSelectedPid(val?.pid);
        }}
        selectedLanguage={
          selectedLanguage === null ? undefined : langMap(selectedLanguage)
        }
        selectedProblem={{ provider: "BAEKJOON", pid: selectedPid }}
        supportedLanuages={availableLanguages.map(langMap)}
        codeTitle={title}
        code={sourceCode}
        input={programInput}
        output={programOutputs.output}
        errorOutput={programOutputs.error}
        infoOutput={programOutputs.info}
        loadingOutput={programOutputs.loading}
        onSave={() => {
          if (title.trim() === "") return alert("제목을 입력해주세요!");

          if (selectedLanguage === null)
            return alert("프로그래밍 언어를 선택해주세요!");

          studyroomClient
            .shareSourceCode({
              languageId: selectedLanguage!.id,
              problem: {
                pid: selectedPid,
                provider: "BAEKJOON"
              },
              sourceCode,
              title
            })
            .then(() => alert("저장했습니다!"))
            .catch((err) => alert("오류: " + err.message));
        }}
        onChange={(type, val) => {
          switch (type) {
            case IdeChangeEventType.Code:
              setSourceCode(val);
              break;
            case IdeChangeEventType.CodeTitle:
              setTitle(val);
              break;
            case IdeChangeEventType.Input:
              setProgramInput(val);
              break;
          }
        }}
        onLoad={() => {
          setLoadDialogActive(true);
        }}
      ></Ide>
      {loadDialogActive && (
        <SharedCodeSelectPopup
          onCloseClick={() => setLoadDialogActive(false)}
          studyRoomId={studyId}
          onSelect={(code) => {
            setTitle(code.title);
            setSelectedLanguages(code.language);
            code.getSourceCode().then(setSourceCode);
            setLoadDialogActive(false);
          }}
        ></SharedCodeSelectPopup>
      )}
    </>
  );
}
