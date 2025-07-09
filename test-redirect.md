# 301 리다이렉트 테스트 가이드

## 프로덕션 배포 후 테스트 방법:

### 1. 터미널 테스트
```bash
# www 도메인 → non-www 리다이렉트 테스트
curl -I https://www.toolhub.tools

# 기대 응답:
# HTTP/1.1 301 Moved Permanently
# Location: https://toolhub.tools/
```

### 2. 브라우저 테스트
1. F12 → Network 탭 열기
2. https://www.toolhub.tools 접속
3. 첫 번째 요청에서 "301" 상태 코드 확인
4. Location 헤더에 "https://toolhub.tools" 확인

### 3. 다양한 경로 테스트
```bash
curl -I https://www.toolhub.tools/pomodoro
curl -I https://www.toolhub.tools/mbti-test
curl -I https://www.toolhub.tools/contact
```

### 4. SEO 도구 확인
- Google Search Console에서 리다이렉트 체인 확인
- 301 리다이렉트가 올바르게 설정되었는지 검증

## 현재 상태:
- ✅ Express.js 미들웨어 설정 완료
- ✅ 로직 테스트 통과
- ⏳ 프로덕션 배포 대기 중
- ⏳ 실제 도메인 테스트 대기 중