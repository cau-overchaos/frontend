"use client"

import styles from './ide.module.scss'
import { Button, Input, Textarea } from "@/app/common/inputs";
import ReactSelect from "react-select";
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism.css';
import { encode } from 'html-entities';

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

export type Language = {label: string, value: string, highlight?: IdeHighlighterType};
export type Problem = {label: string, value: number};

type Props = {
    supportedLanuages: Language[],
    selectedLanguage?: Language;
    availableProblems: Problem[],
    selectedProblem?: Problem;
    codeTitle: string,
    code: string,
    input: string,
    output: string,
    
    onSave: () => void,
    onCompile: () => void,
    onChange: (type: IdeChangeEventType, newValue: string) => void
    onLanguageSelect: (newLanguage: Language | null) => void
    onProblemSelect: (newProblem: Problem | null) => void
}

export default function Ide(props: Props) {
    const highlightCode = (code:string) => {
        switch (props.selectedLanguage?.highlight) {
            case IdeHighlighterType.C:
                return highlight(code, languages.c, 'c');
            case IdeHighlighterType.Cpp:
                return highlight(code, languages.cpp, 'cpp');
            case IdeHighlighterType.Java:
                return highlight(code, languages.java, 'java');
            case IdeHighlighterType.Javascript:
                return highlight(code, languages.javascript, 'javascript');
            case IdeHighlighterType.Python:
                return highlight(code, languages.python, 'python');
            default:
                return encode(code);
        }
    };

    return <div className={styles.ide}>
        <div className={styles.hasCode}>
            <div className={styles.menu}>
                <ReactSelect<Problem> placeholder='문제 제목' options={props.availableProblems} defaultValue={props.selectedProblem} onChange={(newValue) => props.onProblemSelect(newValue)}></ReactSelect>
                <Input placeholder="코드 이름" className={styles.saveBtn} value={props.codeTitle} onChange={(evt) => props.onChange(IdeChangeEventType.CodeTitle, evt.target.value)}></Input>
                <Button onClick={props.onSave}>저장</Button>
                <ReactSelect<Language> placeholder='언어 선택' options={props.supportedLanuages} defaultValue={props.selectedLanguage}  onChange={(newValue) => props.onLanguageSelect(newValue)}></ReactSelect>
                <Button onClick={props.onCompile}>컴파일</Button>
            </div>
            <div className={styles.code}>
                <CodeEditor
                    value={props.code}
                    onValueChange={code => props.onChange(IdeChangeEventType.Code, code)}
                    highlight={code => highlightCode(code)}
                    padding={12}
                    className={styles.textarea}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 20,
                    }}
                />
            </div>
        </div>
        <div className={styles.hasIo}>
            <div className={styles.input}>
                <h1>입력</h1>
                <Textarea noBackground value={props.input} onChange={evt => props.onChange(IdeChangeEventType.Input, evt.target.value)}></Textarea>
            </div>
            <div className={styles.output}>
                <h1>출력</h1>
                <Textarea noBackground value={props.output} onChange={evt => props.onChange(IdeChangeEventType.Output, evt.target.value)}></Textarea>
            </div>
        </div>
    </div>
}