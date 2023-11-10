"use client";

import apiClient, { ProgammingLanguage } from "@/app/api_client/api_client";
import Ide, { IdeChangeEventType, IdeHighlighterType, Language } from "./ide";
import { useEffect, useState } from "react";

export default function PeoplePage() {
  const [availableLanguages, setAvailableLanguages] = useState<
    ProgammingLanguage[]
  >([]);
  const [selectedLanguage, setSelectedLanguages] =
    useState<ProgammingLanguage | null>(null);
  const [sourceCode, setSourceCode] = useState<string>(
    "#include <stdio.h>\n\nint main() {\n\n}"
  );
  const [programInput, setProgramInput] = useState<string>("3 1 2 3");
  const [programOutput, setProgramOutput] = useState<string>("6");
  const [title, setTitle] = useState<string>("");
  const [selectedPid, setSelectedPid] = useState<number>(1001);
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

  useEffect(() => {
    if (availableLanguages.length === 0)
      apiClient.programmingLanguages().then((i) => setAvailableLanguages(i));
  }, [availableLanguages]);

  return (
    <Ide
      onCompile={() => {}}
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
      output={programOutput}
      onSave={() => {}}
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
          case IdeChangeEventType.Output:
            setProgramOutput(val);
            break;
        }
      }}
    ></Ide>
  );
}
