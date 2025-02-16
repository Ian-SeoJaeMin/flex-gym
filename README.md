# 🚀 flexGym - 피트니스 센터 회원 관리 시스템

## 📌 프로젝트 개요
flexGym은 크로스핏 및 피트니스 센터에서 회원 및 출석을 효율적으로 관리할 수 있도록 개발된 백엔드 시스템입니다. 

## 🛠 기술 스택
- **프레임워크:** NestJS
- **ORM:** TypeORM
- **데이터베이스:** PostgreSQL (또는 MySQL, MariaDB)
- **인증:** JWT (Access & Refresh Token)
- **캐시:** Redis (선택 사항)
- **메시지 브로커:** RabbitMQ (출석 체크 이벤트 활용 예정)
- **CI/CD:** Jenkins 또는 ArgoCD (추후 설정 예정)
- **컨테이너:** Docker & Docker-Compose

## 📂 프로젝트 구조
```
flexGym/
├── src/
│   ├── modules/          # 주요 도메인 모듈 (Admins, Centers, Members 등)
│   ├── common/           # 공통 유틸리티 및 인터셉터
│   ├── main.ts           # 애플리케이션 진입점
│   ├── app.module.ts     # 메인 모듈
├── .env.development      # 개발 환경 변수
├── .env.production       # 프로덕션 환경 변수
├── docker-compose.yml    # DB 및 서비스 컨테이너 구성
├── package.json          # 프로젝트 메타데이터 및 스크립트
└── README.md             # 프로젝트 개요
```

## ⚙️ 설치 및 실행 방법
### 1️⃣ 프로젝트 클론
```sh
git clone https://github.com/your-username/flexGym.git
cd flexGym
```

### 2️⃣ 환경 변수 설정

### 3️⃣ Docker로 데이터베이스 실행
개발 환경에서는 docker-compose를 이용해 postgresql, redis를 띠워서 개발

### 4️⃣ 프로젝트 실행
#### 개발 환경
```sh
pnpm install
pnpm run start:dev
```
#### 프로덕션 환경
```sh
pnpm run build
pnpm run start:prod
```

## 📖 API 문서 (작업전)
API 명세는 Swagger를 통해 자동 생성됩니다.
서버 실행 후, 아래 경로에서 확인할 수 있습니다.
```
http://localhost:3000/api-docs
```

## 📌 작업 내역
- [x] 프로젝트 초기 설정 작업
- [ ] Swagger 설정
- [ ] API 기능 구현
- [ ] 테스트 코드 작성
- [ ] CI/CD (Jenkins 또는 ArgoCD) 설정
- [ ] RabbitMQ 연동 및 출석 이벤트 처리
