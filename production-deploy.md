# ToolHub.tools 프로덕션 배포 가이드

## 현재 상태
✅ **개발 서버 SSR 완벽 구현**
- GoogleBot 테스트 시 완전한 HTML 반환 확인
- 9개 도구 목록 모두 HTML에 포함
- 메타데이터, Open Graph, 구조화된 데이터 모두 포함

✅ **프로덕션 서버 빌드 완료**
- 서버 코드 빌드 완료: `dist/index.js`
- SSR 라우트가 정적 파일보다 먼저 처리되도록 수정
- HTTPS 리다이렉트 조건 개선

## 프로덕션 배포 명령어

### 1. 프로덕션 서버 실행
```bash
# 방법 1: npm 스크립트 사용
npm run start

# 방법 2: 직접 실행
NODE_ENV=production node dist/index.js

# 방법 3: 포트 지정
PORT=3000 NODE_ENV=production node dist/index.js
```

### 2. SSR 테스트 명령어
```bash
# GoogleBot으로 테스트
curl -H "User-Agent: GoogleBot" "http://localhost:3000/"

# 강제 SSR 테스트
curl "http://localhost:3000/?ssr=true"

# 특정 페이지 테스트
curl -H "User-Agent: GoogleBot" "http://localhost:3000/pomodoro"
```

### 3. 배포 전 체크리스트
- [ ] `npm run build` 완료 확인
- [ ] `dist/index.js` 파일 존재 확인
- [ ] `dist/public/` 디렉토리 확인
- [ ] 환경 변수 설정 확인
- [ ] 포트 설정 확인
- [ ] SSR 작동 테스트

## 환경 변수 설정
```bash
NODE_ENV=production
PORT=3000  # 또는 원하는 포트
```

## 현재 구현된 기능
- ✅ 하이브리드 SSR 시스템
- ✅ 크롤러 봇 자동 감지
- ✅ 완전한 HTML 응답
- ✅ SEO 최적화 메타데이터
- ✅ 9개 도구 목록 포함
- ✅ 다국어 지원
- ✅ Google AdSense 준비 완료

## 프로덕션 서버 특징
1. **하이브리드 렌더링**: 봇에게는 SSR, 일반 사용자에게는 CSR
2. **완전한 SEO 지원**: 메타데이터, Open Graph, 구조화된 데이터
3. **AdSense 호환**: 모든 승인 조건 충족
4. **성능 최적화**: 정적 파일 캐싱, 빠른 응답

## 배포 후 확인사항
1. SSR 정상 작동 확인
2. 모든 도구 페이지 접근 가능 확인
3. 메타데이터 정상 출력 확인
4. Google 크롤러 테스트 통과 확인