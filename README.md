![react](https://img.shields.io/badge/react-444444?style=for-the-badge&logo=react) ![typescript](https://img.shields.io/badge/typescript-444444?style=for-the-badge&logo=typescript) ![redux-tool-kit](https://img.shields.io/badge/redux_tool_kit-444444?style=for-the-badge&logo=redux) ![recoil](https://img.shields.io/badge/recoil-444444?style=for-the-badge&logo=recoil) ![react-query](https://img.shields.io/badge/react_query-444444?style=for-the-badge&logo=react-query) ![react-hook-form](https://img.shields.io/badge/react_hook_form-444444?style=for-the-badge&logo=react-hook-form) ![react-router](https://img.shields.io/badge/react_router-444444?style=for-the-badge&logo=react-router) ![tailwind-css](https://img.shields.io/badge/tailwind_css-444444?style=for-the-badge&logo=tailwind-css)

# Url

**https://no-support.site(=https://www.no-support.site)**

## Architecture

![Architecture](https://github.com/no-support/mall/assets/50227723/3ce2db9a-4f83-4c99-af26-ba795ac25b33)

## Feature
 - 회원 가입(react-hook-form 사용해 리렌더링 비용 줄임)
 - 로그인 및 카카오 로그인, 로그아웃 기능
 - Todo, Product 목록 페이지네이션 및 CRUD(+파일 처리)

## 풀스택 프로젝트(스프링 부트, 리액트) 배포 회고 및 이슈 정리

### 회고

1. 백엔드 뿐만 아니라 프론트엔드도 EB(Elastic Beanstalk)를 통해 배포함. 이 점은 배포하고 나니 아쉬운 부분임. 프론트엔드는 빌드된 파일을 S3에 올리거나 Amplify를 통해 개발 및 배포했어도 되는 부분이었음. 이미 이렇게 환경을 구성해버린 바람에 생긴 **문제**들은 다음과 같음
	1. 2대의 EC2 사용 요금이 나오고 있음
	2. EB의 구성 항목인 EC2의 메모리를 t3.micro로 만들어서 EC2에서 모듈 설치 및 빌드 시 메모리 뻗음 및 time out으로 배포 실패(거의 100%의 확률). 해당 문제를 다음과 같은 방법으로 해결함.
        1. 요약: 모듈 설치 및 배포할 때만 가상 메모리를 할당함(t3.micro보다 좋은 것으로 변경해도 되긴 함).
        2. 구체: .ebextensions/config 설정 파일 생성(01_setup_swap.config) 및 해당 파일에 EB EC2 인스턴스에 대해 가상 메모리 할당문 작성(프로젝트 최상위 경로에 위와 같은 폴더 및 파일 생성 시 EB가 해당 파일을 읽어 빌드 및 배포 전에 해당 작업을 수행) // 배포 // 인스턴스에 연결(ssh로 접속하든 aws 콘솔로 접속하든..) 및 free 명령어로 가상 메모리 할당 확인 // 배포 완료 확인 후 가상 메모리 해제(sudo swapoff)
2. 아키텍처에 대한 고민 지속: 현재와 같이 2 EB 환경 or 프론트엔드를 S3 또는 Amplify에 배포 or 스프링 부트 백엔드 프로젝트의 정적 리소스 폴더 경로에 프론트엔드 빌드 파일을 적용하는 방안 세 가지에 대해 고민해봄. 현재의 아키텍처 사용 경험은 위에 언급했고, 이 중 세 번째 아이디어에 대한 장단점을 생각해봄
   1. 특징: 백엔드와 프론트엔드 버전이 일치함
      1. pros: 버전 관리 용이
      2. cons: 프론트엔드만 가벼운 변경 사항이 있을 경우, 무중단 배포 환경이 아닐 경우 백엔드도 잠시 서비스 중단됨. 백엔드와 프론트엔드가 강결합되어 있음. 백엔드와 프론트를 나누는 의미가 희석됨.
   2. 위의 사유로 프론트엔드는 S3 또는 Amplify를 이용하는 것이 베스트이지 않을까 생각하게 됨.
3. 개인 프로젝트다 보니 깃 브랜치 전략 및 커밋 컨벤션 룰을 제대로 지키지 않고, husky(git hook을 사용한 테스트 및 린트 자동화)와 같은 도구 미사용
4. 경험을 중시해서 한 프로젝트 내에 여러 가지 상태 관리 도구를 쓰다 보니 해당 측면에서 통일성이 없음
5. 결론: 풀스택으로 CI/CD 환경 구축까지 해보니 웹 환경에 대한 전반적인 이해에 도움이 되었음

### 이슈

#### 카카오 로그인 기능 운영 서버에서 can not get {url} 에러 이슈

1. 환경: AWS CloudFront, react.
2. 원인: CRA로 만든 웹 페이지가 SPA라 생기는 문제. 외부 url인 카카오 로그인 페이지에서 다시 우리 사이트의 특정 경로로 리다이렉트 되어 돌아올 때, CloudFront가 해당 경로의 자원은 없다고 판단하여 404 not found 에러를 띄움. SPA는 사실 html 파일은 index.html 파일 하나이므로 해당 리다이렉트 경로에 해당하는 도큐먼트 파일이 없다는 404 에러가 뜸.
3. 해결: CloudFront - 오류 페이지 - 사용자 정의 오류 응답 생성 - 404 오류 코드에 대해, 오류 응답 사용자 정의 - 예, 응답 페이지 경로를 /index.html로 수정, http 응답 코드도 200으로 수정

#### CI/CD 구축 과정에서 생긴 이슈

1. 깃허브 액션(일종의 남이 만들어 놓은 라이브러리 스크립트)을 사용. 프로젝트 최상위 경로에 .github/workflows/yml 설정 파일 생성(나의 경우 CICD.yml) 및 해당 파일에 깃허브 액션 페이지에서 내게 필요한 배포 환경 검색 및 코드 활용, AWS 보안 자격 증명 - 액세스 키 발급, 깃허브 - 프로젝트 설정에 해당 킷값 등록 후 배포 시도 중 실패(Treating warnings as errors because process.env.CI = true...) => 경고를 다 에러 처리하는 깐깐함 때문에 생긴 문제
   1. 해결: yml 설정 파일에서 `- run: npm run build` 코드를 `- run: CI='false' npm run build`로 수정

#### SSL 인증 구현 과정에서 생긴 이슈

1. 환경: 엘라스틱 빈스톡으로 환경 구축 시 자동으로 고정 IP 및 도메인 생성 및 연결해 줌. 따로 도메인까지 살 생각은 없어서 AWS가 만들어 준 도메인에 SSL 인증서를 받아서 시도해보았으나 실패.
2. 원인: SSL 인증(HTTPS URL 생성) 시에는 도메인을 따로 구매해야 함.
3. 해결: 
   1. AWS Route 53에서 도메인을 구매하는 것부터 할 수 있으나, 저렴한 도메인은 팔지 않아서 도메인은 가비아에서 구매 후 DNS값을 Route 53에 등록. HTTP로 접속 시 HTTPS로 리다이렉트도 시켜주기 위해 AWS CloudFront 서비스 사용. 인증서는 AWS ACM 서비스를 통해 인증 받음.
   2. 프론트엔드만 인증서 발급 받으면 되는 줄 알았더니, 브라우저에서 Mixed Content 에러를 뿜음.
      1. 사진 자료 ![Mixed Content Error](https://github.com/no-support/mall/assets/50227723/2b283fd5-1258-4d27-b190-55a4f87dd683)
   3. 나의 웹 서비스만 ssl 적용하면 끝나는 게 아니라, 나의 웹 서비스가 요청을 날리는 곳들도 ssl 적용이 되어 있어야 함(즉 백엔드도 ssl 인증해야 함)을 확인. 결국 백엔드도 ACM 서비스를 통해 ssl 인증서 발급(EB 환경에선 스프링 프로젝트 앞 단에 nginx가 리버스 프록싱을 해주고 있기 때문에, 스프링 프로젝트 내부에서 인증서 파일을 넣어도 적용 안 되길래 ACM 서비스를 통해 발급 받음.)
   4. AWS ALB(Application Load Balancer)/Route 53 설정을 통해 최종 SSL 적용 완료.