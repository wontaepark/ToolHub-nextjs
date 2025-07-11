// 프로덕션 환경에서 서버 실행을 위한 스크립트
process.env.NODE_ENV = 'production';

// ES modules 지원을 위한 설정
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 서버 실행
import('./server/index.ts').then(() => {
  console.log('프로덕션 서버가 성공적으로 시작되었습니다.');
}).catch(err => {
  console.error('프로덕션 서버 시작 실패:', err);
});