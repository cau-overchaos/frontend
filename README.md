# 알고모여 프론트엔드

[알고모여](https://algogather.com)의 프론트엔드입니다.

## 실행방법

1. nodejs를 설치합니다.
1. `npm i`
1. `npm run dev` or `yarn dev` or (any package manager you like :D)
1. [http://localhost:3000](http://localhost:3000) 접속하면 OK
   - p.s. [http://127.0.0.1:3000](http://127.0.0.1:3000)로 접속시 CORS 오류날 수 있음.

## 빌드방법

1. `.env.production`을 생성하거나 수정합니다. (아래는 예시)
   ```ini
   NEXT_PUBLIC_API_ENDPOINT=http://example.com:1234
   ```
1. nodejs를 설치합니다.
1. `npm i`
1. `NODE_ENV=production npm run build` or `NODE_ENV=produciton yarn build` or (any nodejs package manager you like :D)
1. 빌드 완료

### 프로덕션 실행방법

`NODE_ENV=productino npm run start` or `NODE_ENV=productino yarn start` or (any nodejs package manager you like :D)
