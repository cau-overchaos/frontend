"use client";

import { FormEventHandler, useState } from 'react'
import { Button, Input } from '../common/inputs'
import styles from './page.module.scss'
import MainLayout from '../main_layout';
import apiClient from '../api_client';

export default function signUp() {
    const [id, setId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordRetype, setPasswordRetype] = useState<string>('');
    const [bojId, setBojId] = useState<string>('');

    const doSignup: FormEventHandler<HTMLFormElement> = (evt) => {
        evt.preventDefault();
        let validated = false;

        if (/[^a-z0-9_]/.test(id)) {
            alert('아이디는 영문 소문자, 숫자, 언더바(_)만 가능합니다.');
        } else if (id.length < 4) {
            alert('아이디는 최소 4글자 이상이어야 합니다.');
        } else if (password.length < 8) {
            alert('비밀번호는 최소 8글자 이상이어야 합니다.');
        } else if (password !== passwordRetype) {
            alert('비밀번호가 서로 일치하지 않습니다.');
        } else if (bojId.trim().length == 0) {
            alert('백준 ID는 필수입니다.');
        } else {
            validated = true;
        }

        if (validated) {
            apiClient.signUp({
                userId: id,
                name,
                password,
                judgeAccount: bojId
            }).then(() => {
                alert('회원가입이 완료됐습니다!');
                location.href = '/';
            }).catch((err: Error) => {
                alert(`오류가 발생했습니다: ${err.message}`);
            })
        }
    }

    return <MainLayout>
        <div className={styles.container}>
            <h1>회원가입</h1>
            <form className={styles.form} onSubmit={doSignup}>
                <label>
                    ID
                </label>
                <div className={styles.input}>
                    <Input required pattern='[a-z0-9_]+' minLength={4} name='id' value={id} onChange={(evt) => setId(evt.target.value.toLowerCase())} />
                </div>
                <label>
                    성함
                </label>
                <div className={styles.input}>
                    <Input required name='name' value={name} onChange={(evt) => setName(evt.target.value)} />
                </div>
                <label>
                    비밀번호
                </label>
                <div className={styles.input}>
                    <Input required password minLength={8} name='password' value={password} onChange={(evt) => setPassword(evt.target.value)}></Input>
                </div>
                <label>
                    비밀번호 재입력
                </label>
                <div className={styles.input}>
                    <Input required password minLength={8} name='password_retype' value={passwordRetype} onChange={(evt) => setPasswordRetype(evt.target.value)}></Input>
                </div>
                <label>
                    백준 ID
                </label>
                <div className={styles.input}>
                    <Input required name='boj_id' value={bojId} onChange={(evt) => setBojId(evt.target.value)}></Input>
                </div>
                <div className={styles.input}>
                    <Button submit>회원가입</Button>
                </div>
            </form>
        </div>
    </MainLayout>
}