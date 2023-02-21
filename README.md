# nextjs 13에 대해서 알아보자

_목차_

- [nextjs 13에 대해서 알아보자](#nextjs-13에-대해서-알아보자)
  - [가보자고](#가보자고)
  - [Next.js 13 설치](#nextjs-13-설치)
  - [`app` Directory (Beta)](#app-directory-beta)
    - [Layouts](#layouts)
    - [Server Components](#server-components)
    - [Streaming](#streaming)
    - [Support for Data Fetching](#support-for-data-fetching)

## 가보자고

참 이 바닥은 변화가 왜 이렇게 빠른지 Next.js 13이 나왔다고 해서 살짝 맛을 보려고 한다.

공식문서에 나와있는 변경된 점은 아래와 같다고 한다.

- app 디렉토리(beta): 더 쉽고 빠르며 더 간단한 클라이언트
  - Layout - 불필요한 리렌더링를 방지하고 복잡한 인터페이스를 쉽게 배치함
  - React Server Components - React에 Server Components를 지원
  - Streaming - UI의 렌더링을 점진적으로 렌더링
- turbopack: 최대 700배 빠른 Rust 기반의 webpack 대체
- 새로운 next/image: 더 빨라진 지연 로딩
- 새로운 @next/font(beta): 레이아웃 이동이 없는 자체 호스팅 글꼴
- 개선된 next/link: 간소화된 API

---

## Next.js 13 설치

최신 버전을 설치하려면 아래처럼 입력하면 된다.

```powershell
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

## `app` Directory (Beta)

기존 next.js에서는 `pages` 폴더 안에 파일을 생성하면 자동으로 라우팅을 해줬는데 새롭게 등장한 app 디렉토리다. (기존 pages 폴더에 대한 지원은 아직 한다고 함)

> 아직은 프로덕션 환경에서는 사용하지 않는 게 좋다고 한다.

### Layouts

상태를 유지하고 비용이 많이 드는 **리렌더링을 방지**하고 **경로 간에 UI를 쉽게 공유**할 수 있다.

app 내부에 경로를 생성하려면 **page.js**라는 단일 파일이 필요하다.

> 이건 그냥 기존에 `pages/index.js` 파일이랑 같은 역할을 하는 것 같다.

```jsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
```

실행을 했는데 오류가 발생했다.

```text
Error: > The `app` directory is experimental. To enable, add `appDir: true` to your `next.config.js` configuration under `experimental`. See https://nextjs.org/docs/messages/experimental-app-dir-config
    at Object.findPagesDir (/Users/yunseonghan/Playground/next13-learn/node_modules/next/dist/lib/find-pages-dir.js:80:19)
    at new DevServer (/Users/yunseonghan/Playground/next13-learn/node_modules/next/dist/server/dev/next-dev-server.js:112:59)
    at NextServer.createServer (/Users/yunseonghan/Playground/next13-learn/node_modules/next/dist/server/next.js:140:20)
    at /Users/yunseonghan/Playground/next13-learn/node_modules/next/dist/server/next.js:155:42
    at async NextServer.prepare (/Users/yunseonghan/Playground/next13-learn/node_modules/next/dist/server/next.js:130:24)
    at async /Users/yunseonghan/Playground/next13-learn/node_modules/next/dist/cli/next-dev.js:521:17
```

app 디렉토리는 아직 **실험적**이기 때문에 사용하려면 next.config.js 구성에 `experimental` 아래에 `appDir: true`를 추가해야 한다고 한다. 그럼 next.config.js를 수정해보자

```jsx
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
```

설정을 하고 다시 실행하면 정상적으로 켜진다.

그럼 이제 **레이아웃을 정의**해보자

```jsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html>
      <head>
        <title>Next.js 13 learn</title>
      </head>
      <body>
        <header>Header</header>
        <section>{children}</section>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
```

이렇게 레이아웃 파일을 만들고 <http://localhost:3000>을 접속하면 이렇게 뜬다.

<img width="607" alt="image" src="https://user-images.githubusercontent.com/58321856/220382176-d79e2a7c-98a2-44ff-b77f-5c1fe1ec79a8.png">


특정 폴더 안에서만 레이아웃을 지정해보자

먼저 **폴더를 추가해서 경로를 생성**하고 그 아래에 layout 파일을 만들자

```jsx
// app/todo/layout.tsx
export default function TodoLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <div>
      <h1>Todo Layout</h1>
      {children}
    </div>
  );
}
```

그 다음 **page 파일**을 만들자

```jsx
// app/todo/page.tsx
export default function TodoPage() {
  return <div>Todo Page</div>;
}
```

<img width="580" alt="image" src="https://user-images.githubusercontent.com/58321856/220382256-f596a604-3964-4c69-80a4-98a2e5e1d9b9.png">

그럼 이렇게 특정 페이지에서만 레이아웃을 적용할 수 있다. 와!

### Server Components

React에 Server Components를 사용하여 클라이언트에 전송되는 JS의 크기를 줄여서 초기 페이지 로드 속도를 높힌다고 한다.

_이 부분은 [여기](https://beta.nextjs.org/docs/rendering/server-and-client-components)를 들어가서 더 공부해봐야 할 것 같다. 아직 서버 컴포넌트에 대한 이해가 많이 부족하다_

### Streaming

로드 상태를 표시

### Support for Data Fetching
