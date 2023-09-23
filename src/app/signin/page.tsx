"use client";

import { FormEventHandler, useState } from 'react'
import { Button, Input } from '../common/inputs'
import styles from './page.module.scss'
import MainLayout from '../main_layout';

export default function signUp() {
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const doSignup: FormEventHandler<HTMLFormElement> = (evt) => {
        evt.preventDefault();
        let validated = false;

        if (id.length == 0) {
            alert('아이디를 입력해주세요!');
        } else if (password.length == 0) {
            alert('비밀번호를 입력해주세요!');
        } else {
            validated = true;
        }

        if (validated) {

        }
    }

    return <MainLayout>
        <div className={styles.container}>
            <h1>로그인</h1>
            <form className={styles.form} onSubmit={doSignup}>
                <label>
                    ID
                </label>
                <div className={styles.input}>
                    <Input required pattern='[a-z0-9_]+' minLength={4} name='id' value={id} onChange={(evt) => setId(evt.target.value.toLowerCase())} />
                </div>
                <label>
                    비밀번호
                </label>
                <div className={styles.input}>
                    <Input required password minLength={8} name='password' value={password} onChange={(evt) => setPassword(evt.target.value)}></Input>
                </div>
                <div className={styles.input}>
                    <Button submit>로그인</Button>
                </div>
            </form>
        </div>
    </MainLayout>
}