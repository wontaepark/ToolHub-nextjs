import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Share2, Users, BookOpen, CheckCircle, HelpCircle, Lightbulb } from 'lucide-react';
import AdSense from '@/components/AdSense';
import SEOHead from '@/components/SEOHead';

interface Question {
  id: number;
  text: {
    ko: string;
    en: string;
    ja: string;
  };
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  weight: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

interface TestStyle {
  id: string;
  name: {
    ko: string;
    en: string;
    ja: string;
  };
  description: {
    ko: string;
    en: string;
    ja: string;
  };
  emoji: string;
}

interface MBTIResult {
  type: string;
  name: {
    ko: string;
    en: string;
    ja: string;
  };
  description: {
    ko: string;
    en: string;
    ja: string;
  };
  traits: {
    ko: string[];
    en: string[];
    ja: string[];
  };
  careers: {
    ko: string[];
    en: string[];
    ja: string[];
  };
  famous: {
    ko: string[];
    en: string[];
    ja: string[];
  };
}

const testStyles: TestStyle[] = [
  {
    id: 'balance',
    name: { ko: '밸런스 게임', en: 'Balance Game', ja: 'バランスゲーム' },
    description: { ko: 'A 또는 B 선택으로 성격 발견', en: 'Discover personality through A or B choices', ja: 'AまたはBの選択で性格発見' },
    emoji: '⚖️'
  },
  {
    id: 'routine',
    name: { ko: '하루 루틴', en: 'Daily Routine', ja: '一日のルーチン' },
    description: { ko: '일상 습관으로 알아보는 성격', en: 'Personality through daily habits', ja: '日常習慣で分かる性格' },
    emoji: '🌅'
  },
  {
    id: 'lifestyle',
    name: { ko: '일상 기반', en: 'Lifestyle Based', ja: 'ライフスタイル基盤' },
    description: { ko: '생활 방식으로 파악하는 성향', en: 'Tendencies through lifestyle', ja: 'ライフスタイルで把握する性向' },
    emoji: '🏠'
  },
  {
    id: 'romance',
    name: { ko: '연애 기반', en: 'Romance Based', ja: '恋愛基盤' },
    description: { ko: '연애 스타일로 보는 성격', en: 'Personality through dating style', ja: '恋愛スタイルで見る性格' },
    emoji: '💕'
  },
  {
    id: 'professional',
    name: { ko: '직장인 컨셉', en: 'Professional Concept', ja: '会社員コンセプト' },
    description: { ko: '업무 스타일로 알아보는 성격', en: 'Personality through work style', ja: '業務スタイルで分かる性格' },
    emoji: '💼'
  },
  {
    id: 'social',
    name: { ko: '소셜 미디어', en: 'Social Media', ja: 'ソーシャルメディア' },
    description: { ko: 'SNS 사용 패턴으로 보는 성격', en: 'Personality through SNS usage', ja: 'SNS使用パターンで見る性格' },
    emoji: '📱'
  },
  {
    id: 'travel',
    name: { ko: '여행', en: 'Travel', ja: '旅行' },
    description: { ko: '여행 스타일로 파악하는 성향', en: 'Tendencies through travel style', ja: '旅行スタイルで把握する性向' },
    emoji: '✈️'
  },
  {
    id: 'study',
    name: { ko: '학습', en: 'Study', ja: '学習' },
    description: { ko: '공부 방법으로 알아보는 성격', en: 'Personality through study methods', ja: '勉強方法で分かる性格' },
    emoji: '📚'
  },
  {
    id: 'crisis',
    name: { ko: '위기상황', en: 'Crisis Situation', ja: '危機状況' },
    description: { ko: '위기 대응으로 보는 성격', en: 'Personality through crisis response', ja: '危機対応で見る性格' },
    emoji: '⚡'
  }
];

const questions: Record<string, Question[]> = {
  balance: [
    { id: 1, text: { ko: "A: 큰 파티에서 즐기기 vs B: 소수와 깊은 대화", en: "A: Enjoy big parties vs B: Deep conversations with few", ja: "A: 大きなパーティーで楽しむ vs B: 少数と深い会話" }, dimension: 'EI', weight: 'E' },
    { id: 2, text: { ko: "A: 계획적으로 준비하기 vs B: 즉흥적으로 행동하기", en: "A: Plan ahead vs B: Act spontaneously", ja: "A: 計画的に準備 vs B: 即興的に行動" }, dimension: 'JP', weight: 'J' },
    { id: 3, text: { ko: "A: 논리적으로 판단하기 vs B: 감정으로 결정하기", en: "A: Judge logically vs B: Decide emotionally", ja: "A: 論理的に判断 vs B: 感情で決定" }, dimension: 'TF', weight: 'T' },
    { id: 4, text: { ko: "A: 현실적인 목표 설정 vs B: 이상적인 꿈 추구", en: "A: Set realistic goals vs B: Pursue ideal dreams", ja: "A: 現実的な目標設定 vs B: 理想的な夢追求" }, dimension: 'SN', weight: 'S' },
    { id: 5, text: { ko: "A: 팀워크로 협력하기 vs B: 혼자서 집중하기", en: "A: Collaborate in teamwork vs B: Focus alone", ja: "A: チームワークで協力 vs B: 一人で集中" }, dimension: 'EI', weight: 'E' },
    { id: 6, text: { ko: "A: 규칙을 잘 지키기 vs B: 융통성 있게 대처", en: "A: Follow rules well vs B: Handle flexibly", ja: "A: ルールをよく守る vs B: 融通性を持って対処" }, dimension: 'JP', weight: 'J' },
    { id: 7, text: { ko: "A: 객관적 사실 중시 vs B: 인간관계 우선", en: "A: Value objective facts vs B: Prioritize relationships", ja: "A: 客観的事実重視 vs B: 人間関係優先" }, dimension: 'TF', weight: 'T' },
    { id: 8, text: { ko: "A: 구체적인 예시 선호 vs B: 추상적인 개념 선호", en: "A: Prefer concrete examples vs B: Prefer abstract concepts", ja: "A: 具体的な例を好む vs B: 抽象的な概念を好む" }, dimension: 'SN', weight: 'S' },
    { id: 9, text: { ko: "A: 사교 모임 참여하기 vs B: 개인 시간 즐기기", en: "A: Join social gatherings vs B: Enjoy personal time", ja: "A: 社交集まりに参加 vs B: 個人時間を楽しむ" }, dimension: 'EI', weight: 'E' },
    { id: 10, text: { ko: "A: 미리 계획 세우기 vs B: 상황에 맞춰 대응", en: "A: Plan in advance vs B: Respond to situations", ja: "A: 事前に計画を立てる vs B: 状況に合わせて対応" }, dimension: 'JP', weight: 'J' },
    { id: 11, text: { ko: "A: 합리적 의사결정 vs B: 직감적 의사결정", en: "A: Rational decision-making vs B: Intuitive decision-making", ja: "A: 合理的意思決定 vs B: 直感的意思決定" }, dimension: 'TF', weight: 'T' },
    { id: 12, text: { ko: "A: 검증된 방법 사용 vs B: 새로운 시도 도전", en: "A: Use proven methods vs B: Try new challenges", ja: "A: 検証された方法使用 vs B: 新しい試みに挑戦" }, dimension: 'SN', weight: 'S' },
    { id: 13, text: { ko: "A: 외향적 활동 선호 vs B: 내향적 활동 선호", en: "A: Prefer extroverted activities vs B: Prefer introverted activities", ja: "A: 外向的活動を好む vs B: 内向的活動を好む" }, dimension: 'EI', weight: 'E' },
    { id: 14, text: { ko: "A: 체계적 접근 방식 vs B: 유연한 접근 방식", en: "A: Systematic approach vs B: Flexible approach", ja: "A: 体系的アプローチ vs B: 柔軟なアプローチ" }, dimension: 'JP', weight: 'J' },
    { id: 15, text: { ko: "A: 분석적 사고 방식 vs B: 공감적 사고 방식", en: "A: Analytical thinking vs B: Empathetic thinking", ja: "A: 分析的思考方式 vs B: 共感的思考方式" }, dimension: 'TF', weight: 'T' }
  ],
  routine: [
    { id: 1, text: { ko: "A: 매일 같은 시간에 기상 vs B: 기분에 따라 유동적으로", en: "A: Wake up same time daily vs B: Flexibly based on mood", ja: "A: 毎日同じ時間に起床 vs B: 気分に応じて流動的に" }, dimension: 'JP', weight: 'J' },
    { id: 2, text: { ko: "A: 아침에 사람들과 대화 vs B: 혼자만의 시간 갖기", en: "A: Chat with people in morning vs B: Have personal time", ja: "A: 朝に人と会話 vs B: 一人の時間を持つ" }, dimension: 'EI', weight: 'E' },
    { id: 3, text: { ko: "A: 영양 균형 고려한 식사 vs B: 먹고 싶은 음식 위주", en: "A: Nutritionally balanced meals vs B: Foods you crave", ja: "A: 栄養バランスを考えた食事 vs B: 食べたい食べ物中心" }, dimension: 'TF', weight: 'T' },
    { id: 4, text: { ko: "A: 대중교통 이용하기 vs B: 개인 이동수단 이용", en: "A: Use public transport vs B: Use personal transport", ja: "A: 大衆交通利用 vs B: 個人移動手段利用" }, dimension: 'EI', weight: 'E' },
    { id: 5, text: { ko: "A: 실용적인 점심 메뉴 vs B: 새로운 메뉴 도전", en: "A: Practical lunch menu vs B: Try new menu", ja: "A: 実用的な昼食メニュー vs B: 新しいメニューに挑戦" }, dimension: 'SN', weight: 'S' },
    { id: 6, text: { ko: "A: 정해진 일정표 따르기 vs B: 유연하게 스케줄 조정", en: "A: Follow set schedule vs B: Adjust schedule flexibly", ja: "A: 決まったスケジュールに従う vs B: 柔軟にスケジュール調整" }, dimension: 'JP', weight: 'J' },
    { id: 7, text: { ko: "A: 동료들과 점심 함께 vs B: 혼자서 조용히 식사", en: "A: Lunch with colleagues vs B: Eat quietly alone", ja: "A: 同僚と昼食を一緒に vs B: 一人で静かに食事" }, dimension: 'EI', weight: 'E' },
    { id: 8, text: { ko: "A: 미리 약속 잡고 만나기 vs B: 즉석에서 만나기", en: "A: Make appointments in advance vs B: Meet spontaneously", ja: "A: 事前に約束して会う vs B: その場で会う" }, dimension: 'JP', weight: 'J' },
    { id: 9, text: { ko: "A: 효율성 위주로 처리 vs B: 감정 고려해서 처리", en: "A: Handle efficiently vs B: Handle considering emotions", ja: "A: 効率性中心で処理 vs B: 感情を考慮して処理" }, dimension: 'TF', weight: 'T' },
    { id: 10, text: { ko: "A: 집중할 수 있는 환경 vs B: 활기찬 분위기 선호", en: "A: Environment for concentration vs B: Prefer lively atmosphere", ja: "A: 集中できる環境 vs B: 活気ある雰囲気を好む" }, dimension: 'EI', weight: 'I' },
    { id: 11, text: { ko: "A: 감정을 내면에 간직 vs B: 감정을 표현하고 공유", en: "A: Keep emotions inside vs B: Express and share emotions", ja: "A: 感情を内面に保つ vs B: 感情を表現し共有" }, dimension: 'TF', weight: 'F' },
    { id: 12, text: { ko: "A: 규칙적인 운동 스케줄 vs B: 기분 따라 운동하기", en: "A: Regular exercise schedule vs B: Exercise based on mood", ja: "A: 規則的な運動スケジュール vs B: 気分に応じて運動" }, dimension: 'JP', weight: 'J' },
    { id: 13, text: { ko: "A: 정해진 시간에 잠자리 vs B: 할 일 끝내고 잠자리", en: "A: Sleep at set time vs B: Sleep after finishing tasks", ja: "A: 決まった時間に就寝 vs B: やることを終えてから就寝" }, dimension: 'JP', weight: 'J' },
    { id: 14, text: { ko: "A: 하루를 체계적으로 정리 vs B: 하루를 감성적으로 회상", en: "A: Organize day systematically vs B: Reflect on day emotionally", ja: "A: 一日を体系的に整理 vs B: 一日を感性的に回想" }, dimension: 'TF', weight: 'T' },
    { id: 15, text: { ko: "A: 현실적 목표 점검하기 vs B: 꿈과 이상 그려보기", en: "A: Check realistic goals vs B: Envision dreams and ideals", ja: "A: 現実的目標をチェック vs B: 夢と理想を描く" }, dimension: 'SN', weight: 'S' }
  ],
  lifestyle: [
    { id: 1, text: { ko: "A: 계획적으로 쇼핑하기 vs B: 즉흥적으로 쇼핑하기", en: "A: Shop systematically vs B: Shop spontaneously", ja: "A: 計画的にショッピング vs B: 即興的にショッピング" }, dimension: 'JP', weight: 'J' },
    { id: 2, text: { ko: "A: 새로운 카페 탐방하기 vs B: 단골 카페 이용하기", en: "A: Explore new cafes vs B: Use regular cafe", ja: "A: 新しいカフェ探訪 vs B: 常連カフェ利用" }, dimension: 'SN', weight: 'N' },
    { id: 3, text: { ko: "A: 전화 즉시 받기 vs B: 나중에 다시 걸기", en: "A: Answer phone immediately vs B: Call back later", ja: "A: 電話をすぐ取る vs B: 後でかけ直す" }, dimension: 'EI', weight: 'E' },
    { id: 4, text: { ko: "A: 약속은 미리 계획하기 vs B: 즉석에서 결정하기", en: "A: Plan appointments ahead vs B: Decide on the spot", ja: "A: 約束は事前に計画 vs B: その場で決定" }, dimension: 'JP', weight: 'J' },
    { id: 5, text: { ko: "A: 기념일을 꼼꼼히 챙기기 vs B: 특별한 날만 챙기기", en: "A: Carefully remember anniversaries vs B: Only special occasions", ja: "A: 記念日をきちんと覚える vs B: 特別な日だけ覚える" }, dimension: 'JP', weight: 'J' },
    { id: 6, text: { ko: "A: 지도 보고 길 찾기 vs B: 직감으로 길 찾기", en: "A: Find way with map vs B: Find way intuitively", ja: "A: 地図を見て道を探す vs B: 直感で道を探す" }, dimension: 'SN', weight: 'S' },
    { id: 7, text: { ko: "A: 검증된 뉴스 위주로 보기 vs B: 다양한 소스 탐색하기", en: "A: Focus on verified news vs B: Explore various sources", ja: "A: 検証されたニュース中心に見る vs B: 様々なソースを探索" }, dimension: 'SN', weight: 'S' },
    { id: 8, text: { ko: "A: 논리적 조언 해주기 vs B: 공감하며 들어주기", en: "A: Give logical advice vs B: Listen empathetically", ja: "A: 論理的アドバイスをする vs B: 共感しながら聞く" }, dimension: 'TF', weight: 'T' },
    { id: 9, text: { ko: "A: 미리 계획 세운 휴일 vs B: 당일 기분 따라 휴일", en: "A: Pre-planned holidays vs B: Holiday based on daily mood", ja: "A: 事前に計画した休日 vs B: 当日の気分に応じた休日" }, dimension: 'JP', weight: 'J' },
    { id: 10, text: { ko: "A: 평점 높은 영화 선택 vs B: 흥미로운 줄거리 선택", en: "A: Choose high-rated movies vs B: Choose interesting plots", ja: "A: 評価の高い映画選択 vs B: 興味深いストーリー選択" }, dimension: 'SN', weight: 'S' },
    { id: 11, text: { ko: "A: 친구들과 활동적 시간 vs B: 혼자만의 조용한 시간", en: "A: Active time with friends vs B: Quiet time alone", ja: "A: 友達と活動的な時間 vs B: 一人の静かな時間" }, dimension: 'EI', weight: 'E' },
    { id: 12, text: { ko: "A: 체계적으로 정리정돈 vs B: 편안함 우선 배치", en: "A: Organize systematically vs B: Arrange for comfort", ja: "A: 体系的に整理整頓 vs B: 快適さ優先配置" }, dimension: 'JP', weight: 'J' },
    { id: 13, text: { ko: "A: 규칙적 일기 쓰기 vs B: 기분 날 때 기록하기", en: "A: Write diary regularly vs B: Record when in mood", ja: "A: 規則的な日記書き vs B: 気分の時に記録" }, dimension: 'JP', weight: 'J' },
    { id: 14, text: { ko: "A: 실용적 조언 해주기 vs B: 마음 공감해주기", en: "A: Give practical advice vs B: Empathize emotionally", ja: "A: 実用的アドバイス vs B: 心を共感" }, dimension: 'TF', weight: 'T' },
    { id: 15, text: { ko: "A: 사람들과 어울리는 저녁 vs B: 혼자 즐기는 저녁", en: "A: Evening with people vs B: Evening alone", ja: "A: 人と過ごす夜 vs B: 一人で楽しむ夜" }, dimension: 'EI', weight: 'E' }
  ],
  romance: [
    { id: 1, text: { ko: "A: 적극적으로 먼저 다가가기 vs B: 상대방이 다가오길 기다리기", en: "A: Approach actively first vs B: Wait for them to approach", ja: "A: 積極的に先にアプローチ vs B: 相手が近づくのを待つ" }, dimension: 'EI', weight: 'E' },
    { id: 2, text: { ko: "A: 데이트 코스 미리 계획 vs B: 즉흥적으로 데이트", en: "A: Plan date course ahead vs B: Spontaneous dating", ja: "A: デートコースを事前に計画 vs B: 即興的にデート" }, dimension: 'JP', weight: 'J' },
    { id: 3, text: { ko: "A: 상대방의 말에 집중 vs B: 상대방의 감정에 집중", en: "A: Focus on their words vs B: Focus on their emotions", ja: "A: 相手の言葉に集中 vs B: 相手の感情に集中" }, dimension: 'TF', weight: 'T' },
    { id: 4, text: { ko: "A: 논리적으로 갈등 해결 vs B: 감정적으로 갈등 해결", en: "A: Resolve conflicts logically vs B: Resolve conflicts emotionally", ja: "A: 論理的に葛藤解決 vs B: 感情的に葛藤解決" }, dimension: 'TF', weight: 'T' },
    { id: 5, text: { ko: "A: 직접적인 사랑 표현 vs B: 은은한 사랑 표현", en: "A: Direct love expression vs B: Subtle love expression", ja: "A: 直接的な愛情表現 vs B: 控えめな愛情表現" }, dimension: 'EI', weight: 'E' },
    { id: 6, text: { ko: "A: 특별한 날 꼼꼼히 챙기기 vs B: 평소에 더 신경쓰기", en: "A: Carefully prepare special days vs B: Care more usually", ja: "A: 特別な日をきちんと準備 vs B: 普段にもっと気を遣う" }, dimension: 'JP', weight: 'J' },
    { id: 7, text: { ko: "A: 객관적 조언 해주기 vs B: 따뜻하게 위로해주기", en: "A: Give objective advice vs B: Comfort warmly", ja: "A: 客観的アドバイス vs B: 温かく慰める" }, dimension: 'TF', weight: 'T' },
    { id: 8, text: { ko: "A: 연인 SNS 관심 갖기 vs B: 개인 영역 존중하기", en: "A: Show interest in partner's SNS vs B: Respect personal space", ja: "A: 恋人のSNSに関心 vs B: 個人領域を尊重" }, dimension: 'EI', weight: 'E' },
    { id: 9, text: { ko: "A: 실용적인 데이트 코스 vs B: 로맨틱한 데이트 코스", en: "A: Practical date course vs B: Romantic date course", ja: "A: 実用的なデートコース vs B: ロマンチックなデートコース" }, dimension: 'SN', weight: 'S' },
    { id: 10, text: { ko: "A: 많은 사람 앞에서 애정표현 vs B: 둘만의 공간에서 애정표현", en: "A: Show affection publicly vs B: Show affection privately", ja: "A: 多くの人の前で愛情表現 vs B: 二人だけの空間で愛情表現" }, dimension: 'EI', weight: 'E' },
    { id: 11, text: { ko: "A: 체계적인 연애 관계 vs B: 자유로운 연애 관계", en: "A: Systematic relationship vs B: Free relationship", ja: "A: 体系的な恋愛関係 vs B: 自由な恋愛関係" }, dimension: 'JP', weight: 'J' },
    { id: 12, text: { ko: "A: 이성적으로 이별 결정 vs B: 감정적으로 이별 결정", en: "A: Decide breakup rationally vs B: Decide breakup emotionally", ja: "A: 理性的に別れを決定 vs B: 感情的に別れを決定" }, dimension: 'TF', weight: 'T' },
    { id: 13, text: { ko: "A: 적극적으로 관심 표현 vs B: 조용히 지켜보기", en: "A: Express interest actively vs B: Watch quietly", ja: "A: 積極的に関心表現 vs B: 静かに見守る" }, dimension: 'EI', weight: 'E' },
    { id: 14, text: { ko: "A: 상대방 말 그대로 받아들이기 vs B: 숨은 의미 파악하기", en: "A: Take words literally vs B: Understand hidden meaning", ja: "A: 相手の言葉をそのまま受け取る vs B: 隠された意味を把握" }, dimension: 'SN', weight: 'S' },
    { id: 15, text: { ko: "A: 현실적 조건 고려하기 vs B: 감정적 교감 중시하기", en: "A: Consider realistic conditions vs B: Value emotional connection", ja: "A: 現実的条件を考慮 vs B: 感情的な交感を重視" }, dimension: 'TF', weight: 'T' }
  ],
  professional: [
    { id: 1, text: { ko: "A: 업무 시작 전 계획 수립 vs B: 상황에 맞춰 유연하게", en: "A: Make plans before work vs B: Flexibly adapt to situations", ja: "A: 業務開始前に計画立案 vs B: 状況に合わせて柔軟に" }, dimension: 'JP', weight: 'J' },
    { id: 2, text: { ko: "A: 검증된 방법 사용하기 vs B: 창의적 방법 시도하기", en: "A: Use proven methods vs B: Try creative methods", ja: "A: 検証された方法使用 vs B: 創造的方法を試す" }, dimension: 'SN', weight: 'S' },
    { id: 3, text: { ko: "A: 팀 회의에서 적극 발언 vs B: 신중하게 의견 제시", en: "A: Speak actively in meetings vs B: Present opinions carefully", ja: "A: チーム会議で積極発言 vs B: 慎重に意見提示" }, dimension: 'EI', weight: 'E' },
    { id: 4, text: { ko: "A: 구체적 사례로 설명 vs B: 개념적으로 설명", en: "A: Explain with specific examples vs B: Explain conceptually", ja: "A: 具体的事例で説明 vs B: 概念的に説明" }, dimension: 'SN', weight: 'S' },
    { id: 5, text: { ko: "A: 마감 여유롭게 미리 준비 vs B: 마감 직전 집중해서", en: "A: Prepare well before deadline vs B: Focus just before deadline", ja: "A: 締切に余裕を持って準備 vs B: 締切直前に集中" }, dimension: 'JP', weight: 'J' },
    { id: 6, text: { ko: "A: 데이터 기반으로 해결 vs B: 직감으로 해결", en: "A: Solve based on data vs B: Solve intuitively", ja: "A: データ基盤で解決 vs B: 直感で解決" }, dimension: 'TF', weight: 'T' },
    { id: 7, text: { ko: "A: 동료들과 함께 협업 vs B: 혼자서 집중 작업", en: "A: Collaborate with colleagues vs B: Focus work alone", ja: "A: 同僚と一緒に協業 vs B: 一人で集中作業" }, dimension: 'EI', weight: 'E' },
    { id: 8, text: { ko: "A: 체계적으로 일 처리 vs B: 우선순위 따라 처리", en: "A: Handle work systematically vs B: Handle by priority", ja: "A: 体系的に仕事処理 vs B: 優先順位に従って処理" }, dimension: 'JP', weight: 'J' },
    { id: 9, text: { ko: "A: 객관적 보고서 작성 vs B: 스토리텔링 보고서", en: "A: Write objective reports vs B: Storytelling reports", ja: "A: 客観的報告書作成 vs B: ストーリーテリング報告書" }, dimension: 'TF', weight: 'T' },
    { id: 10, text: { ko: "A: 건설적 비판 수용하기 vs B: 격려와 인정 받기", en: "A: Accept constructive criticism vs B: Receive encouragement", ja: "A: 建設的批判を受け入れ vs B: 励ましと認定を受ける" }, dimension: 'TF', weight: 'T' },
    { id: 11, text: { ko: "A: 논리적 근거로 조언 vs B: 경험담으로 조언", en: "A: Advise with logical basis vs B: Advise with experience", ja: "A: 論理的根拠でアドバイス vs B: 経験談でアドバイス" }, dimension: 'TF', weight: 'T' },
    { id: 12, text: { ko: "A: 회식 자리 적극 참여 vs B: 필요할 때만 참여", en: "A: Actively join company dinners vs B: Join only when necessary", ja: "A: 会食の席に積極参加 vs B: 必要な時だけ参加" }, dimension: 'EI', weight: 'E' },
    { id: 13, text: { ko: "A: 정해진 절차 따르기 vs B: 효율적 방법 찾기", en: "A: Follow set procedures vs B: Find efficient methods", ja: "A: 決まった手順に従う vs B: 効率的方法を探す" }, dimension: 'JP', weight: 'J' },
    { id: 14, text: { ko: "A: 현실적 기준으로 평가 vs B: 혁신적 아이디어 중시", en: "A: Evaluate by realistic standards vs B: Value innovative ideas", ja: "A: 現実的基準で評価 vs B: 革新的アイデア重視" }, dimension: 'SN', weight: 'S' },
    { id: 15, text: { ko: "A: 정시에 일과 마무리 vs B: 일 끝날 때까지", en: "A: Finish work on time vs B: Until work is done", ja: "A: 定時に仕事終了 vs B: 仕事が終わるまで" }, dimension: 'JP', weight: 'J' }
  ],
  social: [
    { id: 1, text: { ko: "A: 많은 팔로워와 소통 vs B: 소수와 깊은 소통", en: "A: Communicate with many followers vs B: Deep communication with few", ja: "A: 多くのフォロワーとコミュニケーション vs B: 少数と深いコミュニケーション" }, dimension: 'EI', weight: 'E' },
    { id: 2, text: { ko: "A: 즉석에서 댓글 작성 vs B: 신중하게 댓글 작성", en: "A: Write comments spontaneously vs B: Write comments carefully", ja: "A: その場でコメント作成 vs B: 慎重にコメント作成" }, dimension: 'JP', weight: 'P' },
    { id: 3, text: { ko: "A: 팩트 체크 후 좋아요 vs B: 감정적으로 좋아요", en: "A: Like after fact-checking vs B: Like emotionally", ja: "A: ファクトチェック後にいいね vs B: 感情的にいいね" }, dimension: 'TF', weight: 'T' },
    { id: 4, text: { ko: "A: 적극적으로 친구 요청 vs B: 신중하게 친구 수락", en: "A: Actively send friend requests vs B: Carefully accept friends", ja: "A: 積極的に友達リクエスト vs B: 慎重に友達承認" }, dimension: 'EI', weight: 'E' },
    { id: 5, text: { ko: "A: 규칙적으로 포스팅 vs B: 기분 날 때 포스팅", en: "A: Post regularly vs B: Post when in mood", ja: "A: 規則的に投稿 vs B: 気分の時に投稿" }, dimension: 'JP', weight: 'J' },
    { id: 6, text: { ko: "A: 정보성 게시물 선호 vs B: 감성적 게시물 선호", en: "A: Prefer informative posts vs B: Prefer emotional posts", ja: "A: 情報性投稿を好む vs B: 感性的投稿を好む" }, dimension: 'TF', weight: 'T' },
    { id: 7, text: { ko: "A: 라이브 방송 자주 하기 vs B: 편집된 영상 올리기", en: "A: Do live broadcasts often vs B: Upload edited videos", ja: "A: ライブ放送をよくする vs B: 編集された動画をアップ" }, dimension: 'EI', weight: 'E' },
    { id: 8, text: { ko: "A: 체계적으로 피드 관리 vs B: 자유롭게 피드 운영", en: "A: Manage feed systematically vs B: Operate feed freely", ja: "A: 体系的にフィード管理 vs B: 自由にフィード運営" }, dimension: 'JP', weight: 'J' },
    { id: 9, text: { ko: "A: 검증된 트렌드 참여 vs B: 새로운 트렌드 시도", en: "A: Join verified trends vs B: Try new trends", ja: "A: 検証されたトレンドに参加 vs B: 新しいトレンドを試す" }, dimension: 'SN', weight: 'S' },
    { id: 10, text: { ko: "A: 친구 생일 꼼꼼히 챙기기 vs B: 특별한 사람만 챙기기", en: "A: Carefully remember all birthdays vs B: Only special people", ja: "A: 友達の誕生日をきちんと覚える vs B: 特別な人だけ覚える" }, dimension: 'JP', weight: 'J' },
    { id: 11, text: { ko: "A: 정보 공유 목적 사용 vs B: 감정 표현 목적 사용", en: "A: Use for information sharing vs B: Use for emotional expression", ja: "A: 情報共有目的で使用 vs B: 感情表現目的で使用" }, dimension: 'TF', weight: 'T' },
    { id: 12, text: { ko: "A: 태그 많이 하고 받기 vs B: 선별적으로 태그하기", en: "A: Tag and get tagged often vs B: Tag selectively", ja: "A: タグをよくしたりされたり vs B: 選別的にタグ" }, dimension: 'EI', weight: 'E' },
    { id: 13, text: { ko: "A: 정해진 시간에 업로드 vs B: 즉흥적으로 업로드", en: "A: Upload at set times vs B: Upload spontaneously", ja: "A: 決まった時間にアップロード vs B: 即興的にアップロード" }, dimension: 'JP', weight: 'J' },
    { id: 14, text: { ko: "A: 인기 해시태그 사용 vs B: 창의적 해시태그 사용", en: "A: Use popular hashtags vs B: Use creative hashtags", ja: "A: 人気ハッシュタグ使用 vs B: 創造的ハッシュタグ使用" }, dimension: 'SN', weight: 'S' },
    { id: 15, text: { ko: "A: 직접적으로 DM 보내기 vs B: 은근히 관심 표현하기", en: "A: Send DMs directly vs B: Express interest subtly", ja: "A: 直接的にDMを送る vs B: それとなく関心表現" }, dimension: 'EI', weight: 'E' }
  ],
  travel: [
    { id: 1, text: { ko: "A: 상세한 여행 계획 수립 vs B: 즉흥적인 여행", en: "A: Make detailed travel plans vs B: Spontaneous travel", ja: "A: 詳細な旅行計画立案 vs B: 即興的な旅行" }, dimension: 'JP', weight: 'J' },
    { id: 2, text: { ko: "A: 휴식과 재충전 목적 vs B: 새로운 경험 추구", en: "A: Purpose of rest and recharge vs B: Seek new experiences", ja: "A: 休息と充電目的 vs B: 新しい経験追求" }, dimension: 'SN', weight: 'S' },
    { id: 3, text: { ko: "A: 미리 준비물 체크리스트 vs B: 필요할 때 현지 구매", en: "A: Pre-prepared checklist vs B: Buy locally when needed", ja: "A: 事前に準備物チェックリスト vs B: 必要な時に現地購入" }, dimension: 'JP', weight: 'J' },
    { id: 4, text: { ko: "A: 시간대로 일정 진행 vs B: 기분에 따라 일정 변경", en: "A: Follow schedule by time vs B: Change schedule by mood", ja: "A: 時間通りにスケジュール進行 vs B: 気分に応じてスケジュール変更" }, dimension: 'JP', weight: 'J' },
    { id: 5, text: { ko: "A: 논리적으로 길 찾기 vs B: 직감으로 길 탐험", en: "A: Find way logically vs B: Explore path intuitively", ja: "A: 論理的に道を探す vs B: 直感で道を探検" }, dimension: 'TF', weight: 'T' },
    { id: 6, text: { ko: "A: 합리적으로 갈등 해결 vs B: 감정적으로 대화하기", en: "A: Resolve conflicts rationally vs B: Communicate emotionally", ja: "A: 合理的に葛藤解決 vs B: 感情的に対話" }, dimension: 'TF', weight: 'T' },
    { id: 7, text: { ko: "A: 정해진 시간에 기록 vs B: 감동받을 때 기록", en: "A: Record at set times vs B: Record when moved", ja: "A: 決まった時間に記録 vs B: 感動した時に記録" }, dimension: 'JP', weight: 'J' },
    { id: 8, text: { ko: "A: 계획된 여행 vs B: 즉흥 여행 제안", en: "A: Planned travel vs B: Spontaneous travel proposal", ja: "A: 計画された旅行 vs B: 即興旅行提案" }, dimension: 'JP', weight: 'J' },
    { id: 9, text: { ko: "A: 체계적으로 우선순위 vs B: 융통성 있게 조정", en: "A: Systematic priorities vs B: Flexible adjustment", ja: "A: 体系的に優先順位 vs B: 融通性を持って調整" }, dimension: 'JP', weight: 'J' },
    { id: 10, text: { ko: "A: 검증된 맛집 방문 vs B: 감각적으로 맛집 선택", en: "A: Visit verified restaurants vs B: Choose restaurants by instinct", ja: "A: 検証されたグルメ店訪問 vs B: 感覚的にグルメ店選択" }, dimension: 'TF', weight: 'T' },
    { id: 11, text: { ko: "A: 사람들과 함께 촬영 vs B: 혼자만의 사진 촬영", en: "A: Take photos with people vs B: Take photos alone", ja: "A: 人と一緒に撮影 vs B: 一人だけの写真撮影" }, dimension: 'EI', weight: 'E' },
    { id: 12, text: { ko: "A: 효율적으로 동선 계획 vs B: 자유롭게 동선 결정", en: "A: Plan routes efficiently vs B: Decide routes freely", ja: "A: 効率的にルート計画 vs B: 自由にルート決定" }, dimension: 'JP', weight: 'J' },
    { id: 13, text: { ko: "A: 현지인들과 대화하기 vs B: 동행자와 깊은 대화", en: "A: Chat with locals vs B: Deep conversation with companions", ja: "A: 現地の人と会話 vs B: 同行者と深い会話" }, dimension: 'EI', weight: 'E' },
    { id: 14, text: { ko: "A: 실용적인 기념품 vs B: 의미 있는 기념품", en: "A: Practical souvenirs vs B: Meaningful souvenirs", ja: "A: 実用的なお土産 vs B: 意味のあるお土産" }, dimension: 'SN', weight: 'S' },
    { id: 15, text: { ko: "A: 계획대로 정리하기 vs B: 추억 위주로 정리", en: "A: Organize as planned vs B: Organize around memories", ja: "A: 計画通りに整理 vs B: 思い出中心に整理" }, dimension: 'JP', weight: 'J' }
  ],
  study: [
    { id: 1, text: { ko: "A: 정해진 시간에 공부 vs B: 컨디션에 따라 공부", en: "A: Study at set times vs B: Study according to condition", ja: "A: 決まった時間に勉強 vs B: コンディションに応じて勉強" }, dimension: 'JP', weight: 'J' },
    { id: 2, text: { ko: "A: 체계적으로 자료 정리 vs B: 필요할 때 찾아서", en: "A: Organize materials systematically vs B: Find when needed", ja: "A: 体系的に資料整理 vs B: 必要な時に探して" }, dimension: 'JP', weight: 'J' },
    { id: 3, text: { ko: "A: 원인 분석하고 개선 vs B: 격려받고 동기부여", en: "A: Analyze causes and improve vs B: Get encouragement and motivation", ja: "A: 原因分析して改善 vs B: 励ましを受けて動機付け" }, dimension: 'TF', weight: 'T' },
    { id: 4, text: { ko: "A: 요약 노트 만들기 vs B: 전체 흐름 파악하기", en: "A: Make summary notes vs B: Understand overall flow", ja: "A: 要約ノート作成 vs B: 全体の流れ把握" }, dimension: 'SN', weight: 'S' },
    { id: 5, text: { ko: "A: 반복 암기 방법 vs B: 이해 중심 암기", en: "A: Repetitive memorization vs B: Understanding-based memorization", ja: "A: 反復暗記方法 vs B: 理解中心暗記" }, dimension: 'TF', weight: 'T' },
    { id: 6, text: { ko: "A: 적극적으로 질문하기 vs B: 혼자서 해결하기", en: "A: Ask questions actively vs B: Solve alone", ja: "A: 積極的に質問 vs B: 一人で解決" }, dimension: 'EI', weight: 'E' },
    { id: 7, text: { ko: "A: 함께 공부하고 토론 vs B: 혼자 집중해서 공부", en: "A: Study and discuss together vs B: Study alone with focus", ja: "A: 一緒に勉強して討論 vs B: 一人で集中して勉強" }, dimension: 'EI', weight: 'E' },
    { id: 8, text: { ko: "A: 미리 준비해서 시험 vs B: 마지막에 집중해서", en: "A: Prepare ahead for exams vs B: Focus at the last moment", ja: "A: 事前に準備して試験 vs B: 最後に集中して" }, dimension: 'JP', weight: 'J' },
    { id: 9, text: { ko: "A: 건설적 피드백 받기 vs B: 격려와 인정 받기", en: "A: Receive constructive feedback vs B: Receive encouragement", ja: "A: 建設的フィードバックを受ける vs B: 励ましと認定を受ける" }, dimension: 'TF', weight: 'T' },
    { id: 10, text: { ko: "A: 검증된 교재로 공부 vs B: 다양한 자료 활용", en: "A: Study with verified materials vs B: Use various resources", ja: "A: 検証された教材で勉強 vs B: 様々な資料活用" }, dimension: 'SN', weight: 'S' },
    { id: 11, text: { ko: "A: 이론 먼저 이해하기 vs B: 직관적으로 접근하기", en: "A: Understand theory first vs B: Approach intuitively", ja: "A: 理論を先に理解 vs B: 直感的にアプローチ" }, dimension: 'SN', weight: 'S' },
    { id: 12, text: { ko: "A: 정해진 분량 꾸준히 vs B: 몰아서 집중적으로", en: "A: Steady set amounts vs B: Intensively all at once", ja: "A: 決まった分量をコツコツ vs B: まとめて集中的に" }, dimension: 'JP', weight: 'J' },
    { id: 13, text: { ko: "A: 조용한 개인 공간 vs B: 활기찬 공용 공간", en: "A: Quiet personal space vs B: Lively shared space", ja: "A: 静かな個人空間 vs B: 活気ある共用空間" }, dimension: 'EI', weight: 'I' },
    { id: 14, text: { ko: "A: 실전 위주로 연습 vs B: 완벽하게 준비 후", en: "A: Practice with real tests vs B: After perfect preparation", ja: "A: 実戦中心で練習 vs B: 完璧に準備してから" }, dimension: 'JP', weight: 'P' },
    { id: 15, text: { ko: "A: 체계적으로 복습하기 vs B: 중요한 부분 위주로", en: "A: Review systematically vs B: Focus on important parts", ja: "A: 体系的に復習 vs B: 重要な部分中心に" }, dimension: 'JP', weight: 'J' }
  ],
  crisis: [
    { id: 1, text: { ko: "A: 미리 계획 변경하기 vs B: 상황에 맞춰 대응", en: "A: Change plans in advance vs B: Respond to situations", ja: "A: 事前に計画変更 vs B: 状況に合わせて対応" }, dimension: 'JP', weight: 'J' },
    { id: 2, text: { ko: "A: 체계적으로 처리하기 vs B: 급한 것부터 처리", en: "A: Handle systematically vs B: Handle urgent things first", ja: "A: 体系的に処理 vs B: 急ぎのものから処理" }, dimension: 'JP', weight: 'J' },
    { id: 3, text: { ko: "A: 논리적으로 분석하기 vs B: 감정 달래주기", en: "A: Analyze logically vs B: Soothe emotions", ja: "A: 論理的に分析 vs B: 感情をなだめる" }, dimension: 'TF', weight: 'T' },
    { id: 4, text: { ko: "A: 합리적으로 문제 해결 vs B: 인간관계 우선 고려", en: "A: Solve problems rationally vs B: Prioritize relationships", ja: "A: 合理的に問題解決 vs B: 人間関係を優先考慮" }, dimension: 'TF', weight: 'T' },
    { id: 5, text: { ko: "A: 체계적으로 대응하기 vs B: 감정적으로 지지하기", en: "A: Respond systematically vs B: Support emotionally", ja: "A: 体系的に対応 vs B: 感情的に支持" }, dimension: 'TF', weight: 'T' },
    { id: 6, text: { ko: "A: 팀을 이끌어 해결 vs B: 개인적으로 돕기", en: "A: Lead team to solve vs B: Help personally", ja: "A: チームを率いて解決 vs B: 個人的に助ける" }, dimension: 'EI', weight: 'E' },
    { id: 7, text: { ko: "A: 즉석에서 약속 잡기 vs B: 신중하게 시간 조정", en: "A: Make appointments on spot vs B: Carefully adjust time", ja: "A: その場で約束を取る vs B: 慎重に時間調整" }, dimension: 'EI', weight: 'E' },
    { id: 8, text: { ko: "A: 팩트 위주로 대응 vs B: 관계 고려해서 대응", en: "A: Respond based on facts vs B: Respond considering relationships", ja: "A: ファクト中心で対応 vs B: 関係を考慮して対応" }, dimension: 'TF', weight: 'T' },
    { id: 9, text: { ko: "A: 즉석에서 판단하기 vs B: 신중하게 검토하기", en: "A: Judge on the spot vs B: Review carefully", ja: "A: その場で判断 vs B: 慎重に検討" }, dimension: 'JP', weight: 'P' },
    { id: 10, text: { ko: "A: 계획대로 진행하기 vs B: 유연하게 조정하기", en: "A: Proceed as planned vs B: Adjust flexibly", ja: "A: 計画通りに進行 vs B: 柔軟に調整" }, dimension: 'JP', weight: 'J' },
    { id: 11, text: { ko: "A: 검증된 해결 방법 vs B: 창의적 해결 방법", en: "A: Proven solutions vs B: Creative solutions", ja: "A: 検証された解決方法 vs B: 創造的解決方法" }, dimension: 'SN', weight: 'S' },
    { id: 12, text: { ko: "A: 객관적으로 의견 충돌 vs B: 감정적으로 의견 조율", en: "A: Objective opinion conflicts vs B: Emotional opinion coordination", ja: "A: 客観的に意見対立 vs B: 感情的に意見調整" }, dimension: 'TF', weight: 'T' },
    { id: 13, text: { ko: "A: 적극적으로 도움 요청 vs B: 혼자서 해결 시도", en: "A: Actively ask for help vs B: Try to solve alone", ja: "A: 積極的に助けを求める vs B: 一人で解決を試みる" }, dimension: 'EI', weight: 'E' },
    { id: 14, text: { ko: "A: 체계적으로 즉시 판단 vs B: 직감적으로 신속 판단", en: "A: Judge systematically immediately vs B: Judge intuitively quickly", ja: "A: 体系的に即座に判断 vs B: 直感的に迅速判断" }, dimension: 'SN', weight: 'S' },
    { id: 15, text: { ko: "A: 논리적 근거로 결정 vs B: 직감과 감정으로 결정", en: "A: Decide with logical grounds vs B: Decide with intuition and emotion", ja: "A: 論理的根拠で決定 vs B: 直感と感情で決定" }, dimension: 'TF', weight: 'T' }
  ]
};

const mbtiResults: Record<string, MBTIResult> = {
  INTJ: {
    type: "INTJ",
    name: { ko: "전략가", en: "The Architect", ja: "建築家" },
    description: {
      ko: "혁신적인 아이디어와 뛰어난 실행력을 가진 완벽주의자입니다.",
      en: "A perfectionist with innovative ideas and excellent execution.",
      ja: "革新的なアイデアと優れた実行力を持つ完璧主義者です。"
    },
    traits: {
      ko: ["독립적", "전략적", "완벽주義", "미래지향적"],
      en: ["Independent", "Strategic", "Perfectionist", "Future-oriented"],
      ja: ["独立的", "戦略的", "完璧主義", "未来志向"]
    },
    careers: {
      ko: ["과학자", "엔지니어", "건축가", "전략기획자"],
      en: ["Scientist", "Engineer", "Architect", "Strategic Planner"],
      ja: ["科学者", "エンジニア", "建築家", "戦略企画者"]
    },
    famous: {
      ko: ["일론 머스크", "스티븐 호킹", "니콜라 테슬라"],
      en: ["Elon Musk", "Stephen Hawking", "Nikola Tesla"],
      ja: ["イーロン・マスク", "スティーブン・ホーキング", "ニコラ・テスラ"]
    }
  },
  INTP: {
    type: "INTP",
    name: { ko: "사색가", en: "The Thinker", ja: "思想家" },
    description: {
      ko: "논리적 사고와 창의적 아이디어로 새로운 가능성을 탐구하는 사람입니다.",
      en: "A person who explores new possibilities with logical thinking and creative ideas.",
      ja: "論理的思考と創造的アイデアで新しい可能性を探求する人です。"
    },
    traits: {
      ko: ["논리적", "창의적", "독립적", "분석적"],
      en: ["Logical", "Creative", "Independent", "Analytical"],
      ja: ["論理的", "創造的", "独立的", "分析的"]
    },
    careers: {
      ko: ["연구원", "프로그래머", "철학자", "작가"],
      en: ["Researcher", "Programmer", "Philosopher", "Writer"],
      ja: ["研究者", "プログラマー", "哲学者", "作家"]
    },
    famous: {
      ko: ["알베르트 아인슈타인", "빌 게이츠", "찰스 다윈"],
      en: ["Albert Einstein", "Bill Gates", "Charles Darwin"],
      ja: ["アルベルト・アインシュタイン", "ビル・ゲイツ", "チャールズ・ダーウィン"]
    }
  },
  ENTJ: {
    type: "ENTJ",
    name: { ko: "지휘관", en: "The Commander", ja: "指揮官" },
    description: {
      ko: "천생 지도자로 카리스마와 자신감으로 목표를 달성하는 사람입니다.",
      en: "Natural leaders who achieve goals with charisma and confidence.",
      ja: "天性のリーダーでカリスマと自信で目標を達成する人です。"
    },
    traits: {
      ko: ["리더십", "결단력", "효율성", "목표지향적"],
      en: ["Leadership", "Decisive", "Efficient", "Goal-oriented"],
      ja: ["リーダーシップ", "決断力", "効率性", "目標志向"]
    },
    careers: {
      ko: ["CEO", "변호사", "정치인", "컨설턴트"],
      en: ["CEO", "Lawyer", "Politician", "Consultant"],
      ja: ["CEO", "弁護士", "政治家", "コンサルタント"]
    },
    famous: {
      ko: ["스티브 잡스", "나폴레옹", "마가렛 대처"],
      en: ["Steve Jobs", "Napoleon", "Margaret Thatcher"],
      ja: ["スティーブ・ジョブズ", "ナポレオン", "マーガレット・サッチャー"]
    }
  },
  ENTP: {
    type: "ENTP",
    name: { ko: "변론가", en: "The Debater", ja: "討論者" },
    description: {
      ko: "창의적이고 활발한 토론을 즐기며 새로운 아이디어를 탐구하는 사람입니다.",
      en: "Creative and lively people who enjoy debate and explore new ideas.",
      ja: "創造的で活発な討論を楽しみ、新しいアイデアを探求する人です。"
    },
    traits: {
      ko: ["창의적", "열정적", "독창적", "논리적"],
      en: ["Creative", "Enthusiastic", "Original", "Logical"],
      ja: ["創造的", "情熱的", "独創的", "論理的"]
    },
    careers: {
      ko: ["기업가", "마케터", "발명가", "저널리스트"],
      en: ["Entrepreneur", "Marketer", "Inventor", "Journalist"],
      ja: ["起業家", "マーケター", "発明家", "ジャーナリスト"]
    },
    famous: {
      ko: ["토마스 에디슨", "월트 디즈니", "마크 트웨인"],
      en: ["Thomas Edison", "Walt Disney", "Mark Twain"],
      ja: ["トーマス・エジソン", "ウォルト・ディズニー", "マーク・トウェイン"]
    }
  },
  INFJ: {
    type: "INFJ",
    name: { ko: "옹호자", en: "The Advocate", ja: "提唱者" },
    description: {
      ko: "이상주의적이고 원칙주의적이며 다른 사람을 돕기 위해 헌신하는 사람입니다.",
      en: "Idealistic and principled people dedicated to helping others.",
      ja: "理想主義的で原則主義的、他人を助けるために献身する人です。"
    },
    traits: {
      ko: ["직관적", "공감적", "창의적", "통찰력"],
      en: ["Intuitive", "Empathetic", "Creative", "Insightful"],
      ja: ["直感的", "共感的", "創造的", "洞察力"]
    },
    careers: {
      ko: ["상담사", "작가", "교사", "예술가"],
      en: ["Counselor", "Writer", "Teacher", "Artist"],
      ja: ["カウンセラー", "作家", "教師", "芸術家"]
    },
    famous: {
      ko: ["넬슨 만델라", "마더 테레사", "플라톤"],
      en: ["Nelson Mandela", "Mother Teresa", "Plato"],
      ja: ["ネルソン・マンデラ", "マザー・テレサ", "プラトン"]
    }
  },
  INFP: {
    type: "INFP",
    name: { ko: "중재자", en: "The Mediator", ja: "仲裁者" },
    description: {
      ko: "조용하고 창의적이며 자신만의 가치와 신념을 중시하는 사람입니다.",
      en: "Quiet and creative people who value their own beliefs and values.",
      ja: "静かで創造的、自分だけの価値と信念を重視する人です。"
    },
    traits: {
      ko: ["이상주의적", "창의적", "개방적", "열정적"],
      en: ["Idealistic", "Creative", "Open-minded", "Passionate"],
      ja: ["理想主義的", "創造的", "開放的", "情熱的"]
    },
    careers: {
      ko: ["작가", "심리학자", "예술가", "사회복지사"],
      en: ["Writer", "Psychologist", "Artist", "Social Worker"],
      ja: ["作家", "心理学者", "芸術家", "社会福祉士"]
    },
    famous: {
      ko: ["윌리엄 셰익스피어", "반 고흐", "J.R.R 톨킨"],
      en: ["William Shakespeare", "Van Gogh", "J.R.R. Tolkien"],
      ja: ["ウィリアム・シェイクスピア", "ゴッホ", "J.R.R.トールキン"]
    }
  },
  ENFJ: {
    type: "ENFJ",
    name: { ko: "선도자", en: "The Protagonist", ja: "主人公" },
    description: {
      ko: "카리스마 있고 영감을 주며 다른 사람들을 이끌어가는 천생 지도자입니다.",
      en: "Charismatic and inspiring natural leaders who guide others.",
      ja: "カリスマ的で霊感を与え、他の人を導いていく天性のリーダーです。"
    },
    traits: {
      ko: ["카리스마", "이타적", "영감적", "결단력"],
      en: ["Charismatic", "Altruistic", "Inspiring", "Decisive"],
      ja: ["カリスマ的", "利他的", "霊感的", "決断力"]
    },
    careers: {
      ko: ["교사", "상담사", "정치인", "코치"],
      en: ["Teacher", "Counselor", "Politician", "Coach"],
      ja: ["教師", "カウンセラー", "政治家", "コーチ"]
    },
    famous: {
      ko: ["오프라 윈프리", "마틴 루터 킹", "버락 오바마"],
      en: ["Oprah Winfrey", "Martin Luther King Jr.", "Barack Obama"],
      ja: ["オプラ・ウィンフリー", "マーティン・ルーサー・キング", "バラク・オバマ"]
    }
  },
  ENFP: {
    type: "ENFP",
    name: { ko: "활동가", en: "The Campaigner", ja: "運動家" },
    description: {
      ko: "열정적이고 창의적이며 긍정적인 에너지로 사람들에게 영감을 주는 사람입니다.",
      en: "Enthusiastic and creative people who inspire others with positive energy.",
      ja: "情熱的で創造的、肯定的なエネルギーで人々にインスピレーションを与える人です。"
    },
    traits: {
      ko: ["열정적", "창의적", "사교적", "낙관적"],
      en: ["Enthusiastic", "Creative", "Sociable", "Optimistic"],
      ja: ["情熱的", "創造的", "社交的", "楽観的"]
    },
    careers: {
      ko: ["배우", "상담사", "기자", "사회복지사"],
      en: ["Actor", "Counselor", "Journalist", "Social Worker"],
      ja: ["俳優", "カウンセラー", "記者", "社会福祉士"]
    },
    famous: {
      ko: ["로빈 윌리엄스", "월트 디즈니", "엘렌 드제너러스"],
      en: ["Robin Williams", "Walt Disney", "Ellen DeGeneres"],
      ja: ["ロビン・ウィリアムズ", "ウォルト・ディズニー", "エレン・デジェネレス"]
    }
  },
  ISTJ: {
    type: "ISTJ",
    name: { ko: "현실주의자", en: "The Logistician", ja: "管理者" },
    description: {
      ko: "실용적이고 현실적이며 신뢰할 수 있는 성실한 사람입니다.",
      en: "Practical and fact-minded, reliable and responsible people.",
      ja: "実用的で現実的、信頼できる誠実な人です。"
    },
    traits: {
      ko: ["성실함", "책임감", "실용적", "체계적"],
      en: ["Honest", "Responsible", "Practical", "Systematic"],
      ja: ["誠実", "責任感", "実用的", "体系的"]
    },
    careers: {
      ko: ["회계사", "법무관", "의사", "관리자"],
      en: ["Accountant", "Legal Officer", "Doctor", "Manager"],
      ja: ["会計士", "法務官", "医師", "管理者"]
    },
    famous: {
      ko: ["워런 버핏", "조지 워싱턴", "안젤라 메르켈"],
      en: ["Warren Buffett", "George Washington", "Angela Merkel"],
      ja: ["ウォーレン・バフェット", "ジョージ・ワシントン", "アンゲラ・メルケル"]
    }
  },
  ISFJ: {
    type: "ISFJ",
    name: { ko: "수호자", en: "The Protector", ja: "擁護者" },
    description: {
      ko: "따뜻하고 친근하며 다른 사람을 보호하고 돌보는 것을 좋아하는 사람입니다.",
      en: "Warm and friendly people who like to protect and care for others.",
      ja: "温かく親しみやすく、他人を保護し世話することを好む人です。"
    },
    traits: {
      ko: ["보호적", "신뢰성", "따뜻함", "협조적"],
      en: ["Protective", "Reliable", "Warm", "Cooperative"],
      ja: ["保護的", "信頼性", "温かさ", "協調的"]
    },
    careers: {
      ko: ["간호사", "교사", "상담사", "사회복지사"],
      en: ["Nurse", "Teacher", "Counselor", "Social Worker"],
      ja: ["看護師", "教師", "カウンセラー", "社会福祉士"]
    },
    famous: {
      ko: ["마더 테레사", "케이트 미들턴", "로사 파크스"],
      en: ["Mother Teresa", "Kate Middleton", "Rosa Parks"],
      ja: ["マザー・テレサ", "ケイト・ミドルトン", "ローザ・パークス"]
    }
  },
  ESTJ: {
    type: "ESTJ",
    name: { ko: "경영자", en: "The Executive", ja: "幹部" },
    description: {
      ko: "뛰어난 관리 능력과 리더십으로 조직을 이끌어가는 사람입니다.",
      en: "People who lead organizations with excellent management skills and leadership.",
      ja: "優れた管理能力とリーダーシップで組織を率いていく人です。"
    },
    traits: {
      ko: ["조직적", "실용적", "신뢰성", "결단력"],
      en: ["Organized", "Practical", "Reliable", "Decisive"],
      ja: ["組織的", "実用的", "信頼性", "決断力"]
    },
    careers: {
      ko: ["관리자", "군인", "법관", "사업가"],
      en: ["Manager", "Military Officer", "Judge", "Business Owner"],
      ja: ["管理者", "軍人", "裁判官", "事業家"]
    },
    famous: {
      ko: ["윈스턴 처칠", "베르 미더", "프랭클린 루즈벨트"],
      en: ["Winston Churchill", "Vince Lombardi", "Franklin Roosevelt"],
      ja: ["ウィンストン・チャーチル", "ビンス・ロンバルディ", "フランクリン・ルーズベルト"]
    }
  },
  ESFJ: {
    type: "ESFJ",
    name: { ko: "집정관", en: "The Consul", ja: "領事官" },
    description: {
      ko: "사교적이고 인기가 많으며 다른 사람들과 조화를 이루며 살아가는 사람입니다.",
      en: "Popular and sociable people who live in harmony with others.",
      ja: "社交的で人気があり、他の人と調和を成して生きていく人です。"
    },
    traits: {
      ko: ["사교적", "배려심", "협조적", "책임감"],
      en: ["Sociable", "Caring", "Cooperative", "Responsible"],
      ja: ["社交的", "思いやり", "協調的", "責任感"]
    },
    careers: {
      ko: ["교사", "간호사", "이벤트 기획자", "영업"],
      en: ["Teacher", "Nurse", "Event Planner", "Sales"],
      ja: ["教師", "看護師", "イベント企画者", "営業"]
    },
    famous: {
      ko: ["테일러 스위프트", "휴 잭맨", "샐리 필드"],
      en: ["Taylor Swift", "Hugh Jackman", "Sally Field"],
      ja: ["テイラー・スウィフト", "ヒュー・ジャックマン", "サリー・フィールド"]
    }
  },
  ISTP: {
    type: "ISTP",
    name: { ko: "장인", en: "The Virtuoso", ja: "巨匠" },
    description: {
      ko: "손재주가 뛰어나고 실용적이며 다양한 도구와 기계를 다루는 데 능숙한 사람입니다.",
      en: "Skilled with hands, practical, and adept at handling various tools and machines.",
      ja: "手先が器用で実用的、様々な道具や機械を扱うのに長けた人です。"
    },
    traits: {
      ko: ["실용적", "유연함", "관찰력", "현실적"],
      en: ["Practical", "Flexible", "Observant", "Realistic"],
      ja: ["実用的", "柔軟性", "観察力", "現実的"]
    },
    careers: {
      ko: ["기계공", "파일럿", "경찰", "소방관"],
      en: ["Mechanic", "Pilot", "Police Officer", "Firefighter"],
      ja: ["機械工", "パイロット", "警察", "消防士"]
    },
    famous: {
      ko: ["클린트 이스트우드", "마이클 조던", "브루스 리"],
      en: ["Clint Eastwood", "Michael Jordan", "Bruce Lee"],
      ja: ["クリント・イーストウッド", "マイケル・ジョーダン", "ブルース・リー"]
    }
  },
  ISFP: {
    type: "ISFP",
    name: { ko: "모험가", en: "The Adventurer", ja: "冒険家" },
    description: {
      ko: "유연하고 매력적이며 새로운 가능성과 경험에 열려있는 예술가 기질의 사람입니다.",
      en: "Flexible and charming people with artistic temperament, open to new possibilities.",
      ja: "柔軟で魅力的、新しい可能性と経験に開かれた芸術家気質の人です。"
    },
    traits: {
      ko: ["예술적", "유연함", "민감함", "친근함"],
      en: ["Artistic", "Flexible", "Sensitive", "Friendly"],
      ja: ["芸術的", "柔軟性", "敏感", "親しみやすさ"]
    },
    careers: {
      ko: ["예술가", "음악가", "디자이너", "심리상담사"],
      en: ["Artist", "Musician", "Designer", "Counselor"],
      ja: ["芸術家", "音楽家", "デザイナー", "心理カウンセラー"]
    },
    famous: {
      ko: ["마이클 잭슨", "프린스", "오드리 햅번"],
      en: ["Michael Jackson", "Prince", "Audrey Hepburn"],
      ja: ["マイケル・ジャクソン", "プリンス", "オードリー・ヘプバーン"]
    }
  },
  ESTP: {
    type: "ESTP",
    name: { ko: "사업가", en: "The Entrepreneur", ja: "起業家" },
    description: {
      ko: "활동적이고 현실적이며 즉흥적으로 문제를 해결하는 것을 좋아하는 사람입니다.",
      en: "Active and realistic people who like to solve problems spontaneously.",
      ja: "活動的で現実的、即興的に問題を解決することを好む人です。"
    },
    traits: {
      ko: ["활동적", "실용적", "적응적", "에너지"],
      en: ["Active", "Practical", "Adaptable", "Energetic"],
      ja: ["活動的", "実用的", "適応的", "エネルギッシュ"]
    },
    careers: {
      ko: ["영업", "기업가", "운동선수", "구급대원"],
      en: ["Sales", "Entrepreneur", "Athlete", "Paramedic"],
      ja: ["営業", "起業家", "運動選手", "救急隊員"]
    },
    famous: {
      ko: ["도널드 트럼프", "어니스트 헤밍웨이", "윈스턴 처칠"],
      en: ["Donald Trump", "Ernest Hemingway", "Winston Churchill"],
      ja: ["ドナルド・トランプ", "アーネスト・ヘミングウェイ", "ウィンストン・チャーチル"]
    }
  },
  ESFP: {
    type: "ESFP",
    name: { ko: "연예인", en: "The Entertainer", ja: "エンターテイナー" },
    description: {
      ko: "자유로운 영혼으로 삶을 즐기며 주변 사람들에게 기쁨을 주는 사람입니다.",
      en: "Free spirits who enjoy life and bring joy to those around them.",
      ja: "自由な魂で人生を楽しみ、周りの人々に喜びを与える人です。"
    },
    traits: {
      ko: ["자발적", "열정적", "친근함", "협조적"],
      en: ["Spontaneous", "Enthusiastic", "Friendly", "Cooperative"],
      ja: ["自発的", "情熱的", "親しみやすさ", "協調的"]
    },
    careers: {
      ko: ["배우", "음악가", "이벤트 기획자", "사회복지사"],
      en: ["Actor", "Musician", "Event Planner", "Social Worker"],
      ja: ["俳優", "音楽家", "イベント企画者", "社会福祉士"]
    },
    famous: {
      ko: ["엘비스 프레슬리", "마릴린 먼로", "윌 스미스"],
      en: ["Elvis Presley", "Marilyn Monroe", "Will Smith"],
      ja: ["エルビス・プレスリー", "マリリン・モンロー", "ウィル・スミス"]
    }
  }
};

export default function MBTITest() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<MBTIResult | null>(null);

  const currentQuestions = selectedStyle ? questions[selectedStyle] : [];
  const progress = currentQuestions.length > 0 ? ((currentQuestion + 1) / currentQuestions.length) * 100 : 0;

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  const handleAnswer = (choiceIndex: number) => {
    const questionId = currentQuestions[currentQuestion]?.id;
    if (!questionId) return;

    const newAnswers = { ...answers, [questionId]: choiceIndex };
    setAnswers(newAnswers);

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, number>) => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    // More sophisticated scoring with weighted analysis
    currentQuestions.forEach((question) => {
      const answer = finalAnswers[question.id];
      if (answer !== undefined) {
        // Get the intended trait for this question
        const primaryTrait = question.weight;
        const oppositeTrait = getOppositeTrait(primaryTrait);
        
        if (answer === 1) {
          // Choice A - aligns with the question's primary weight
          scores[primaryTrait] += 2; // Stronger weight for primary choice
        } else if (answer === 2) {
          // Choice B - aligns with opposite trait
          scores[oppositeTrait] += 2; // Stronger weight for opposite choice
        }
      }
    });

    // Add some randomization for tied scores to prevent always getting same result
    Object.keys(scores).forEach(trait => {
      if (Math.random() < 0.1) { // 10% chance of small adjustment
        scores[trait as keyof typeof scores] += Math.random() < 0.5 ? 1 : -1;
      }
    });

    // Ensure no negative scores
    Object.keys(scores).forEach(trait => {
      scores[trait as keyof typeof scores] = Math.max(0, scores[trait as keyof typeof scores]);
    });

    // Calculate MBTI type with more nuanced logic
    const mbtiType = 
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');

    console.log('Scores:', scores);
    console.log('MBTI Type:', mbtiType);

    setResult(mbtiResults[mbtiType] || mbtiResults.INTJ);
    setShowResult(true);
  };

  const getOppositeTrait = (trait: string) => {
    const opposites: Record<string, string> = {
      'E': 'I', 'I': 'E',
      'S': 'N', 'N': 'S', 
      'T': 'F', 'F': 'T',
      'J': 'P', 'P': 'J'
    };
    return opposites[trait] || 'I';
  };

  const resetTest = () => {
    setSelectedStyle(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
  };

  if (!selectedStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('mbtiTest.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('mbtiTest.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testStyles.map((style) => (
              <Card
                key={style.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                onClick={() => handleStyleSelect(style.id)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{style.emoji}</div>
                  <CardTitle className="text-xl">
                    {style.name[i18n.language as keyof typeof style.name]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {style.description[i18n.language as keyof typeof style.description]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AdSense */}
          <div className="mb-8 flex justify-center">
            <AdSense adSlot="1234567890" className="w-full max-w-4xl" />
          </div>

          <div className="space-y-8">
            {/* MBTI 테스트란 무엇인가요? */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">
                {currentLang === 'ko' ? 'MBTI 성격유형 테스트란 무엇인가요?' : 
                 currentLang === 'ja' ? 'MBTI性格タイプテストとは何ですか？' : 
                 'What is the MBTI Personality Type Test?'}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {currentLang === 'ko' ? 
                    'MBTI(Myers-Briggs Type Indicator) 성격유형 테스트는 칼 융의 심리학적 유형론을 바탕으로 개발된 성격 분류 도구입니다. 16가지 고유한 성격 유형으로 사람들을 분류하며, 각 유형은 4가지 핵심 차원의 조합으로 구성됩니다: 외향성(E) vs 내향성(I), 감각(S) vs 직관(N), 사고(T) vs 감정(F), 판단(J) vs 인식(P). 이 테스트는 자기 이해를 높이고, 다른 사람들과의 관계를 개선하며, 적합한 직업이나 학습 스타일을 찾는 데 도움을 줍니다.' :
                   currentLang === 'ja' ? 
                    'MBTI（Myers-Briggs Type Indicator）性格タイプテストは、カール・ユングの心理学的類型論を基に開発された性格分類ツールです。16の独特な性格タイプで人々を分類し、各タイプは4つの核心次元の組み合わせで構成されます：外向性(E) vs 内向性(I)、感覚(S) vs 直感(N)、思考(T) vs 感情(F)、判断(J) vs 知覚(P)。このテストは自己理解を高め、他の人との関係を改善し、適切な職業や学習スタイルを見つけるのに役立ちます。' :
                    'The MBTI (Myers-Briggs Type Indicator) personality type test is a personality classification tool developed based on Carl Jung\'s psychological typology. It classifies people into 16 unique personality types, with each type consisting of a combination of four core dimensions: Extraversion (E) vs Introversion (I), Sensing (S) vs Intuition (N), Thinking (T) vs Feeling (F), and Judging (J) vs Perceiving (P). This test helps increase self-understanding, improve relationships with others, and find suitable careers or learning styles.'
                  }
                </p>
                <p>
                  {currentLang === 'ko' ? 
                    '전 세계적으로 널리 사용되는 이 도구는 기업의 팀 빌딩, 개인의 진로 탐색, 교육 방법 개선 등 다양한 분야에서 활용되고 있습니다. ToolHub.tools의 MBTI 테스트는 10가지 다양한 테스트 스타일을 제공하여 사용자가 자신에게 가장 적합한 방식으로 성격을 탐색할 수 있도록 돕습니다.' :
                   currentLang === 'ja' ? 
                    '世界中で広く使用されているこのツールは、企業のチームビルディング、個人のキャリア探索、教育方法改善など様々な分野で活用されています。ToolHub.toolsのMBTIテストは10種類の様々なテストスタイルを提供し、ユーザーが自分に最も適した方法で性格を探索できるよう支援します。' :
                    'This globally used tool is utilized in various fields such as corporate team building, personal career exploration, and educational method improvement. ToolHub.tools\' MBTI test provides 10 different test styles to help users explore their personality in the way that suits them best.'
                  }
                </p>
              </div>
            </section>

            {/* 주요 기능 및 특징 */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">
                {currentLang === 'ko' ? '주요 기능 및 특징' : 
                 currentLang === 'ja' ? '主要機能と特徴' : 
                 'Key Features and Characteristics'}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        {currentLang === 'ko' ? '다양한 테스트 스타일' : 
                         currentLang === 'ja' ? '様々なテストスタイル' : 
                         'Various Test Styles'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentLang === 'ko' ? 
                          '직장인, 학생, 일반인 등 상황별 맞춤형 10가지 테스트 스타일 제공' :
                         currentLang === 'ja' ? 
                          'オフィスワーカー、学生、一般人など状況別カスタマイズされた10種類のテストスタイル提供' :
                          'Provides 10 customized test styles for different situations like office workers, students, and general users'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        {currentLang === 'ko' ? '상세 결과 분석' : 
                         currentLang === 'ja' ? '詳細結果分析' : 
                         'Detailed Result Analysis'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentLang === 'ko' ? 
                          '16가지 성격 유형별 특성, 적합한 직업, 유명인 등 종합적 분석 제공' :
                         currentLang === 'ja' ? 
                          '16種類の性格タイプ別特性、適職、有名人など総合的分析提供' :
                          'Comprehensive analysis including traits, suitable careers, and famous people for all 16 personality types'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        {currentLang === 'ko' ? '과학적 신뢰성' : 
                         currentLang === 'ja' ? '科学的信頼性' : 
                         'Scientific Reliability'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentLang === 'ko' ? 
                          '칼 융의 심리학 이론에 기반한 검증된 성격 분석 방법론 사용' :
                         currentLang === 'ja' ? 
                          'カール・ユングの心理学理論に基づく検証された性格分析方法論使用' :
                          'Uses verified personality analysis methodology based on Carl Jung\'s psychological theory'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Share2 className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        {currentLang === 'ko' ? '소셜 공유 기능' : 
                         currentLang === 'ja' ? 'ソーシャル共有機能' : 
                         'Social Sharing Feature'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentLang === 'ko' ? 
                          '테스트 결과를 친구들과 쉽게 공유하고 서로의 성격 유형 비교 가능' :
                         currentLang === 'ja' ? 
                          'テスト結果を友達と簡単に共有し、お互いの性格タイプ比較可能' :
                          'Easy sharing of test results with friends and comparison of each other\'s personality types'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* AdSense */}
            <div className="flex justify-center">
              <AdSense adSlot="1234567891" className="w-full max-w-4xl" />
            </div>

            {/* 상세 사용법 가이드 */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">
                {currentLang === 'ko' ? '상세 사용법 가이드' : 
                 currentLang === 'ja' ? '詳細使用法ガイド' : 
                 'Detailed Usage Guide'}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {currentLang === 'ko' ? '1. 테스트 스타일 선택' : 
                     currentLang === 'ja' ? '1. テストスタイル選択' : 
                     '1. Test Style Selection'}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentLang === 'ko' ? 
                      '10가지 테스트 스타일 중 자신의 상황과 선호도에 맞는 것을 선택하세요. 직장 상황, 학습 환경, 일상생활, 연애 관계 등 다양한 상황별 질문으로 구성되어 있어 더욱 정확한 결과를 얻을 수 있습니다. 각 스타일은 고유한 질문 세트와 접근 방식을 가지고 있습니다.' :
                     currentLang === 'ja' ? 
                      '10種類のテストスタイルの中から自分の状況と好みに合うものを選択してください。職場状況、学習環境、日常生活、恋愛関係など様々な状況別質問で構成されており、より正確な結果を得ることができます。各スタイルは独自の質問セットとアプローチ方式を持っています。' :
                      'Choose from 10 test styles that match your situation and preferences. Composed of various situational questions including workplace situations, learning environments, daily life, and romantic relationships for more accurate results. Each style has its own unique question set and approach.'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {currentLang === 'ko' ? '2. 질문 응답하기' : 
                     currentLang === 'ja' ? '2. 質問への回答' : 
                     '2. Answering Questions'}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentLang === 'ko' ? 
                      '각 질문에 대해 A 또는 B 중 자신에게 더 맞는 답변을 선택하세요. 정답이나 틀린 답은 없으니 자연스럽고 솔직하게 응답하는 것이 중요합니다. 진행률 바를 통해 현재 테스트 진행 상황을 확인할 수 있으며, 이전 질문으로 돌아가서 답변을 수정할 수도 있습니다.' :
                     currentLang === 'ja' ? 
                      '各質問に対してAまたはBの中から自分により合った答えを選択してください。正解や間違った答えはないので、自然で正直に回答することが重要です。進行率バーで現在のテスト進行状況を確認でき、前の質問に戻って答えを修正することもできます。' :
                      'For each question, choose the answer that suits you better between A or B. There are no right or wrong answers, so it\'s important to respond naturally and honestly. You can check the current test progress through the progress bar and go back to previous questions to modify your answers.'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {currentLang === 'ko' ? '3. 결과 해석 및 활용' : 
                     currentLang === 'ja' ? '3. 結果解釈と活用' : 
                     '3. Result Interpretation and Application'}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentLang === 'ko' ? 
                      '테스트 완료 후 자신의 MBTI 유형과 상세 분석을 확인하세요. 성격 특성, 적합한 직업군, 동일한 유형의 유명인 등의 정보를 제공받습니다. 이 결과를 바탕으로 자기 이해를 높이고, 진로 결정이나 인간관계 개선에 활용할 수 있습니다. 결과는 언제든 다시 확인하거나 친구들과 공유할 수 있습니다.' :
                     currentLang === 'ja' ? 
                      'テスト完了後、自分のMBTIタイプと詳細分析を確認してください。性格特性、適職群、同じタイプの有名人などの情報を提供されます。この結果を基に自己理解を高め、進路決定や人間関係改善に活用できます。結果はいつでも再確認したり友達と共有したりできます。' :
                      'After completing the test, check your MBTI type and detailed analysis. You will receive information about personality traits, suitable career fields, and famous people of the same type. Based on these results, you can increase self-understanding and use it for career decisions or relationship improvement. Results can be checked again anytime or shared with friends.'
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* 활용 예시 */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">
                {currentLang === 'ko' ? '활용 예시' : 
                 currentLang === 'ja' ? '活用例' : 
                 'Usage Examples'}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <h3 className="text-lg font-semibold mb-2">
                    {currentLang === 'ko' ? '개인 발전' : 
                     currentLang === 'ja' ? '個人発展' : 
                     'Personal Development'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {currentLang === 'ko' ? 
                      '자신의 성격 유형을 이해함으로써 강점을 발견하고 약점을 보완할 수 있습니다. 학습 방법, 의사소통 스타일, 스트레스 관리 방법 등을 개선하여 더 나은 자신이 될 수 있습니다. 또한 자신에게 맞는 환경과 활동을 찾아 삶의 만족도를 높일 수 있습니다.' :
                     currentLang === 'ja' ? 
                      '自分の性格タイプを理解することで強みを発見し弱点を補完できます。学習方法、コミュニケーションスタイル、ストレス管理方法などを改善してより良い自分になれます。また、自分に合った環境と活動を見つけて人生の満足度を高められます。' :
                      'By understanding your personality type, you can discover strengths and compensate for weaknesses. You can become a better version of yourself by improving learning methods, communication styles, and stress management techniques. You can also increase life satisfaction by finding environments and activities that suit you.'
                    }
                  </p>
                </div>
                <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
                  <h3 className="text-lg font-semibold mb-2">
                    {currentLang === 'ko' ? '관계 개선' : 
                     currentLang === 'ja' ? '関係改善' : 
                     'Relationship Improvement'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {currentLang === 'ko' ? 
                      '가족, 친구, 동료들과 MBTI 결과를 공유하여 서로를 더 잘 이해할 수 있습니다. 각자의 성향을 알게 되면 갈등을 줄이고 더 효과적으로 소통할 수 있습니다. 팀 프로젝트나 협업 시에도 각 구성원의 강점을 활용하여 더 나은 결과를 얻을 수 있습니다.' :
                     currentLang === 'ja' ? 
                      '家族、友人、同僚とMBTI結果を共有してお互いをより良く理解できます。それぞれの傾向を知ると対立を減らしより効果的にコミュニケーションできます。チームプロジェクトや協業時にも各メンバーの強みを活用してより良い結果を得られます。' :
                      'Share MBTI results with family, friends, and colleagues to better understand each other. Knowing each person\'s tendencies can reduce conflicts and enable more effective communication. In team projects and collaborations, you can achieve better results by utilizing each member\'s strengths.'
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* AdSense */}
            <div className="flex justify-center">
              <AdSense adSlot="1234567892" className="w-full max-w-4xl" />
            </div>

            {/* 자주 묻는 질문 FAQ */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-4">
                {currentLang === 'ko' ? '자주 묻는 질문 (FAQ)' : 
                 currentLang === 'ja' ? 'よくある질問 (FAQ)' : 
                 'Frequently Asked Questions (FAQ)'}
              </h2>
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    {currentLang === 'ko' ? 'Q. MBTI 테스트 결과가 얼마나 정확한가요?' : 
                     currentLang === 'ja' ? 'Q. MBTIテスト結果はどのくらい正確ですか？' : 
                     'Q. How accurate are MBTI test results?'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {currentLang === 'ko' ? 
                      'A. MBTI는 과학적으로 검증된 성격 분석 도구로, 일관성 있게 응답하면 높은 신뢰도를 보입니다. 다만 개인의 성장이나 환경 변화에 따라 결과가 달라질 수 있으므로, 절대적 기준보다는 자기 이해의 도구로 활용하시기 바랍니다.' :
                     currentLang === 'ja' ? 
                      'A. MBTIは科学的に検証された性格分析ツールで、一貫性を持って回答すれば高い信頼度を示します。ただし、個人の成長や環境変化によって結果が変わることがあるので、絶対的基準よりも自己理解のツールとして活用してください。' :
                      'A. MBTI is a scientifically validated personality analysis tool that shows high reliability when answered consistently. However, results may change due to personal growth or environmental changes, so please use it as a tool for self-understanding rather than an absolute standard.'
                    }
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    {currentLang === 'ko' ? 'Q. 테스트를 다시 받으면 결과가 달라질 수 있나요?' : 
                     currentLang === 'ja' ? 'Q. テストを再受験すると結果が変わることがありますか？' : 
                     'Q. Can the results change if I retake the test?'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {currentLang === 'ko' ? 
                      'A. 네, 가능합니다. 개인의 성장, 경험, 환경 변화 등에 따라 성향이 변할 수 있습니다. 특히 경계선상에 있는 성향의 경우 작은 변화로도 다른 결과가 나올 수 있으니, 주기적으로 테스트를 받아보시는 것도 좋습니다.' :
                     currentLang === 'ja' ? 
                      'A. はい、可能です。個人の成長、経験、環境変化などによって傾向が変わることがあります。特に境界線上にある傾向の場合、小さな変化でも異なる結果が出ることがあるので、定期的にテストを受けてみることをお勧めします。' :
                      'A. Yes, it is possible. Tendencies can change due to personal growth, experiences, and environmental changes. Especially for tendencies on the borderline, small changes can lead to different results, so it\'s good to take the test periodically.'
                    }
                  </p>
                </div>
                <div className="border-b border-border pb-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    {currentLang === 'ko' ? 'Q. 어떤 성격 유형이 더 좋거나 나쁜 건 아닌가요?' : 
                     currentLang === 'ja' ? 'Q. どの性格タイプがより良いまたは悪いということはありませんか？' : 
                     'Q. Are some personality types better or worse than others?'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {currentLang === 'ko' ? 
                      'A. 절대 그렇지 않습니다. 모든 MBTI 유형은 고유한 강점과 가치를 가지고 있습니다. 각 유형은 서로 다른 상황에서 빛을 발하며, 다양성이야말로 사회를 풍요롭게 만드는 원동력입니다. 중요한 것은 자신의 유형을 이해하고 강점을 발전시키는 것입니다.' :
                     currentLang === 'ja' ? 
                      'A. 絶対にそうではありません。すべてのMBTIタイプは独自の強みと価値を持っています。各タイプは異なる状況で輝きを放ち、多様性こそが社会を豊かにする原動力です。重要なのは自分のタイプを理解し強みを発展させることです。' :
                      'A. Absolutely not. All MBTI types have unique strengths and values. Each type shines in different situations, and diversity is what enriches society. What\'s important is understanding your type and developing your strengths.'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    {currentLang === 'ko' ? 'Q. 예상과 다른 결과가 나왔는데 틀린 건 아닌가요?' : 
                     currentLang === 'ja' ? 'Q. 予想と異なる結果が出ましたが、間違っているのではありませんか？' : 
                     'Q. I got unexpected results. Could it be wrong?'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {currentLang === 'ko' ? 
                      'A. 예상과 다른 결과는 새로운 자기 발견의 기회일 수 있습니다. 때로는 자신이 생각하는 모습과 실제 행동 패턴이 다를 수 있으며, 이는 매우 자연스러운 현상입니다. 결과를 통해 자신을 새로운 각도에서 이해해보세요.' :
                     currentLang === 'ja' ? 
                      'A. 予想と異なる結果は新しい自己発見の機会かもしれません。時には自分が思っている姿と実際の行動パターンが異なることがあり、これは非常に自然な現象です。結果を通じて自分を新しい角度から理解してみてください。' :
                      'A. Unexpected results can be an opportunity for new self-discovery. Sometimes the image you have of yourself and your actual behavioral patterns can differ, which is a very natural phenomenon. Try to understand yourself from new angles through the results.'
                    }
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (showResult && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-3xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-purple-600 dark:text-purple-400">
                {result.type}
              </CardTitle>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.name[i18n.language as keyof typeof result.name]}
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {result.description[i18n.language as keyof typeof result.description]}
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('mbtiTest.traits')}</h3>
                  <div className="space-y-1">
                    {result.traits[i18n.language as keyof typeof result.traits].map((trait, index) => (
                      <Badge key={index} variant="secondary">{trait}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('mbtiTest.careers')}</h3>
                  <div className="space-y-1">
                    {result.careers[i18n.language as keyof typeof result.careers].map((career, index) => (
                      <Badge key={index} variant="outline">{career}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('mbtiTest.famous')}</h3>
                  <div className="space-y-1">
                    {result.famous[i18n.language as keyof typeof result.famous].map((person, index) => (
                      <Badge key={index} variant="default">{person}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={resetTest} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t('mbtiTest.retake')}
                </Button>
                <Button onClick={() => {/* Share functionality */}} variant="default">
                  <Share2 className="mr-2 h-4 w-4" />
                  {t('mbtiTest.share')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = currentQuestions[currentQuestion];
  if (!currentQ) return null;

  // 테스트 진행 중 화면
  if (selectedStyle && !showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <Button
              onClick={resetTest}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('mbtiTest.backToStart')}
            </Button>
            <div className="text-sm text-gray-500">
              {currentQuestion + 1} / {currentQuestions.length}
            </div>
          </div>

          <Progress value={progress} className="mb-8" />

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center">
                {t('mbtiTest.questionNumber', { number: currentQuestion + 1 })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-center font-medium">
                {currentQ.text[i18n.language as keyof typeof currentQ.text]}
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => handleAnswer(1)}
                  variant="outline"
                  className="w-full p-6 h-auto text-left justify-start"
                >
                  <span className="font-semibold mr-2">A:</span>
                  {currentQ.text[i18n.language as keyof typeof currentQ.text].split(' vs ')[0].replace('A: ', '')}
                </Button>
                
                <Button
                  onClick={() => handleAnswer(2)}
                  variant="outline"
                  className="w-full p-6 h-auto text-left justify-start"
                >
                  <span className="font-semibold mr-2">B:</span>
                  {currentQ.text[i18n.language as keyof typeof currentQ.text].split(' vs ')[1].replace('B: ', '')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 상세 정보 페이지 (기본 화면)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 기존 스타일 선택 화면 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('mbtiTest.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('mbtiTest.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {testStyles.map((style) => (
            <Card
              key={style.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              onClick={() => handleStyleSelect(style.id)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{style.emoji}</div>
                <CardTitle className="text-xl">
                  {style.name[i18n.language as keyof typeof style.name]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {style.description[i18n.language as keyof typeof style.description]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AdSense */}
        <div className="mb-8 flex justify-center">
          <AdSense adSlot="1234567890" className="w-full max-w-4xl" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* MBTI 테스트란 무엇인가요? */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? 'MBTI 성격유형 테스트란 무엇인가요?' : 
               currentLang === 'ja' ? 'MBTI性格タイプテストとは何ですか？' : 
               'What is the MBTI Personality Type Test?'}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                {currentLang === 'ko' ? 
                  'MBTI(Myers-Briggs Type Indicator) 성격유형 테스트는 칼 융의 심리학적 유형론을 바탕으로 개발된 성격 분류 도구입니다. 16가지 고유한 성격 유형으로 사람들을 분류하며, 각 유형은 4가지 핵심 차원의 조합으로 구성됩니다: 외향성(E) vs 내향성(I), 감각(S) vs 직관(N), 사고(T) vs 감정(F), 판단(J) vs 인식(P). 이 테스트는 자기 이해를 높이고, 다른 사람들과의 관계를 개선하며, 적합한 직업이나 학습 스타일을 찾는 데 도움을 줍니다.' :
                 currentLang === 'ja' ? 
                  'MBTI（Myers-Briggs Type Indicator）性格タイプテストは、カール・ユングの心理学的類型論を基に開発された性格分類ツールです。16の独特な性格タイプで人々を分類し、各タイプは4つの核心次元の組み合わせで構成されます：外向性(E) vs 内向性(I)、感覚(S) vs 直感(N)、思考(T) vs 感情(F)、判断(J) vs 知覚(P)。このテストは自己理解を高め、他の人との関係を改善し、適切な職業や学習スタイルを見つけるのに役立ちます。' :
                  'The MBTI (Myers-Briggs Type Indicator) personality type test is a personality classification tool developed based on Carl Jung\'s psychological typology. It classifies people into 16 unique personality types, with each type consisting of a combination of four core dimensions: Extraversion (E) vs Introversion (I), Sensing (S) vs Intuition (N), Thinking (T) vs Feeling (F), and Judging (J) vs Perceiving (P). This test helps increase self-understanding, improve relationships with others, and find suitable careers or learning styles.'
                }
              </p>
              <p>
                {currentLang === 'ko' ? 
                  '우리의 MBTI 테스트는 다양한 스타일과 테마로 제공되어 개인의 취향에 맞는 재미있는 방식으로 성격 유형을 발견할 수 있습니다. 각 스타일은 동일한 과학적 기반을 유지하면서도 독특한 시각과 해석을 제공하여, 같은 결과라도 새로운 관점에서 자신을 이해할 수 있는 기회를 제공합니다.' :
                 currentLang === 'ja' ? 
                  '私たちのMBTIテストは様々なスタイルとテーマで提供され、個人の好みに合った楽しい方法で性格タイプを発見できます。各スタイルは同じ科学的基盤を維持しながら独特な視点と解釈を提供し、同じ結果でも新しい観点から自分を理解する機会を提供します。' :
                  'Our MBTI test is offered in various styles and themes, allowing you to discover your personality type in an engaging way that suits your preferences. Each style maintains the same scientific foundation while providing unique perspectives and interpretations, offering opportunities to understand yourself from new angles even with the same results.'
                }
              </p>
            </div>
          </section>

          {/* 주요 기능 및 특징 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '주요 기능 및 특징' : 
               currentLang === 'ja' ? '主要機能と特徴' : 
               'Key Features and Characteristics'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '다양한 테스트 스타일' : 
                       currentLang === 'ja' ? '様々なテストスタイル' : 
                       'Various Test Styles'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '클래식, 현대적, 감성적 등 10가지 다양한 스타일로 개성 있는 테스트 경험' :
                       currentLang === 'ja' ? 
                        'クラシック、モダン、感性的など10の様々なスタイルで個性的なテスト体験' :
                        'Unique test experience with 10 different styles including classic, modern, and emotional approaches'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '상세한 결과 분석' : 
                       currentLang === 'ja' ? '詳細な結果分析' : 
                       'Detailed Result Analysis'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '16가지 성격 유형별 특성, 추천 직업, 유명인 등 포괄적인 정보 제공' :
                       currentLang === 'ja' ? 
                        '16の性格タイプ別特性、おすすめ職業、有名人など包括的な情報提供' :
                        'Comprehensive information including traits, recommended careers, and famous people for all 16 personality types'
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '과학적 신뢰성' : 
                       currentLang === 'ja' ? '科学的信頼性' : 
                       'Scientific Reliability'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '심리학 이론에 기반한 검증된 질문과 정확한 분석 알고리즘' :
                       currentLang === 'ja' ? 
                        '心理学理論に基づく検証された質問と正確な分析アルゴリズム' :
                        'Validated questions based on psychological theory and accurate analysis algorithms'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Share2 className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {currentLang === 'ko' ? '소셜 공유 기능' : 
                       currentLang === 'ja' ? 'ソーシャル共有機能' : 
                       'Social Sharing Feature'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLang === 'ko' ? 
                        '테스트 결과를 친구들과 쉽게 공유하고 서로의 성격 유형 비교' :
                       currentLang === 'ja' ? 
                        'テスト結果を友達と簡単に共有し、お互いの性格タイプを比較' :
                        'Easily share test results with friends and compare personality types with each other'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AdSense */}
          <div className="flex justify-center">
            <AdSense adSlot="1234567891" className="w-full max-w-4xl" />
          </div>

          {/* 상세 사용법 가이드 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '상세 사용법 가이드' : 
               currentLang === 'ja' ? '詳細使用法ガイド' : 
               'Detailed Usage Guide'}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '1. 테스트 스타일 선택' : 
                   currentLang === 'ja' ? '1. テストスタイル選択' : 
                   '1. Select Test Style'}
                </h3>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? 
                    '10가지 다양한 테스트 스타일 중 자신의 취향에 맞는 것을 선택하세요. 각 스타일은 동일한 심리학적 기반을 가지지만 질문 방식과 결과 표현이 다릅니다. 클래식한 방식부터 창의적이고 감성적인 접근까지 다양한 옵션을 제공합니다.' :
                   currentLang === 'ja' ? 
                    '10の様々なテストスタイルから自分の好みに合うものを選択してください。各スタイルは同じ心理学的基盤を持ちますが、質問方式と結果表現が異なります。クラシックな方式から創造的で感性的なアプローチまで様々なオプションを提供します。' :
                    'Choose from 10 different test styles that suit your preferences. Each style has the same psychological foundation but differs in question format and result presentation. We offer various options from classic approaches to creative and emotional methods.'
                  }
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '2. 질문 응답하기' : 
                   currentLang === 'ja' ? '2. 質問への回答' : 
                   '2. Answering Questions'}
                </h3>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? 
                    '각 질문에 대해 두 개의 선택지 중 자신에게 더 가까운 것을 선택하세요. 정답이나 오답은 없으며, 직관적으로 느끼는 대로 답하는 것이 가장 정확한 결과를 얻는 방법입니다. 진행률 바를 통해 테스트 진행 상황을 확인할 수 있습니다.' :
                   currentLang === 'ja' ? 
                    '各質問について2つの選択肢の中から自分により近いものを選択してください。正答や誤答はなく、直感的に感じるまま答えることが最も正確な結果を得る方法です。進行率バーでテストの進行状況を確認できます。' :
                    'For each question, choose the option that feels closer to you from two choices. There are no right or wrong answers, and answering intuitively is the best way to get accurate results. You can check test progress through the progress bar.'
                  }
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '3. 결과 해석 및 활용' : 
                   currentLang === 'ja' ? '3. 結果解釈と活用' : 
                   '3. Interpreting and Using Results'}
                </h3>
                <p className="text-muted-foreground">
                  {currentLang === 'ko' ? 
                    '테스트 완료 후 자신의 MBTI 유형과 상세한 설명을 확인하세요. 주요 특성, 추천 직업, 유명인 정보를 통해 자신을 더 깊이 이해할 수 있습니다. 결과를 저장하거나 친구들과 공유하여 서로의 성격 유형을 비교해보세요.' :
                   currentLang === 'ja' ? 
                    'テスト完了後、自分のMBTIタイプと詳細な説明を確認してください。主要特性、おすすめ職業、有名人情報を通じて自分をより深く理解できます。結果を保存したり友達と共有してお互いの性格タイプを比較してみてください。' :
                    'After completing the test, check your MBTI type and detailed description. You can understand yourself more deeply through key traits, recommended careers, and famous people information. Save results or share with friends to compare personality types with each other.'
                  }
                </p>
              </div>
            </div>
          </section>

          {/* 활용 예시 */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '활용 예시' : 
               currentLang === 'ja' ? '活用例' : 
               'Usage Examples'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '개인 발전' : 
                   currentLang === 'ja' ? '個人発展' : 
                   'Personal Development'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    '자기 이해 증진, 강점과 약점 파악, 개인적 성장 방향 설정, 스트레스 관리 방법 찾기, 학습 스타일 개선, 의사결정 패턴 이해 등 개인의 내적 성장과 자기계발에 활용할 수 있습니다.' :
                   currentLang === 'ja' ? 
                    '自己理解促進、強みと弱みの把握、個人的成長方向設定、ストレス管理方法探し、学習スタイル改善、意思決定パターン理解など個人の内的成長と自己啓発に活用できます。' :
                    'Can be used for personal inner growth and self-development including enhancing self-understanding, identifying strengths and weaknesses, setting personal growth direction, finding stress management methods, improving learning styles, and understanding decision-making patterns.'
                  }
                </p>
              </div>
              <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
                <h3 className="text-lg font-semibold mb-2">
                  {currentLang === 'ko' ? '관계 개선' : 
                   currentLang === 'ja' ? '関係改善' : 
                   'Relationship Improvement'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    '가족, 친구, 연인, 동료와의 관계에서 서로의 차이점을 이해하고 더 나은 소통 방법을 찾을 수 있습니다. 갈등 해결, 팀워크 향상, 효과적인 협업 방식 개발에 도움이 됩니다.' :
                   currentLang === 'ja' ? 
                    '家族、友人、恋人、同僚との関係でお互いの違いを理解し、より良いコミュニケーション方法を見つけることができます。紛争解決、チームワーク向上、効果的な協業方式開発に役立ちます。' :
                    'Helps understand differences with family, friends, partners, and colleagues, and find better communication methods. Useful for conflict resolution, improving teamwork, and developing effective collaboration methods.'
                  }
                </p>
              </div>
            </div>
          </section>

          {/* AdSense */}
          <div className="flex justify-center">
            <AdSense adSlot="1234567892" className="w-full max-w-4xl" />
          </div>

          {/* 자주 묻는 질문 FAQ */}
          <section className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-bold mb-4">
              {currentLang === 'ko' ? '자주 묻는 질문 (FAQ)' : 
               currentLang === 'ja' ? 'よくある質問 (FAQ)' : 
               'Frequently Asked Questions (FAQ)'}
            </h2>
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {currentLang === 'ko' ? 'Q. MBTI 결과가 얼마나 정확한가요?' : 
                   currentLang === 'ja' ? 'Q. MBTI結果はどれくらい正確ですか？' : 
                   'Q. How accurate are MBTI results?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. MBTI는 심리학적으로 검증된 도구이지만, 개인의 복잡한 성격을 완전히 설명할 수는 없습니다. 자기 이해의 출발점으로 활용하되, 절대적인 기준으로 여기지 말고 참고 자료로 활용하는 것이 좋습니다.' :
                   currentLang === 'ja' ? 
                    'A. MBTIは心理学的に検証されたツールですが、個人の複雑な性格を完全に説明することはできません。自己理解の出発点として活用し、絶対的な基準ではなく参考資料として活用することをお勧めします。' :
                    'A. MBTI is a psychologically validated tool, but it cannot completely explain an individual\'s complex personality. It\'s best used as a starting point for self-understanding and as reference material rather than an absolute standard.'
                  }
                </p>
              </div>
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {currentLang === 'ko' ? 'Q. 테스트를 여러 번 해도 되나요?' : 
                   currentLang === 'ja' ? 'Q. テストを何度も受けても良いですか？' : 
                   'Q. Can I take the test multiple times?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. 네, 다양한 스타일로 여러 번 테스트를 받을 수 있습니다. 시간이 지나면서 자신에 대한 인식이 변할 수 있고, 다른 스타일의 테스트에서 새로운 관점을 발견할 수도 있습니다.' :
                   currentLang === 'ja' ? 
                    'A. はい、様々なスタイルで何度でもテストを受けることができます。時間が経つにつれて自分に対する認識が変わることがあり、異なるスタイルのテストで新しい観点を発見することもあります。' :
                    'A. Yes, you can take the test multiple times with different styles. Your self-perception may change over time, and you might discover new perspectives from different test styles.'
                  }
                </p>
              </div>
              <div className="border-b border-border pb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {currentLang === 'ko' ? 'Q. 16가지 유형 중 가장 좋은 유형이 있나요?' : 
                   currentLang === 'ja' ? 'Q. 16のタイプの中で最も良いタイプはありますか？' : 
                   'Q. Is there a best type among the 16 types?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. 모든 MBTI 유형은 고유한 강점과 가치를 가지고 있습니다. 어떤 유형이 다른 유형보다 우월하다고 할 수 없으며, 각각의 특성이 다른 상황에서 장점이 될 수 있습니다.' :
                   currentLang === 'ja' ? 
                    'A. すべてのMBTIタイプは独特な強みと価値を持っています。どのタイプが他のタイプより優れているということはなく、それぞれの特性が異なる状況で長所となることがあります。' :
                    'A. All MBTI types have unique strengths and values. No type is superior to others, and each characteristic can be an advantage in different situations.'
                  }
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  {currentLang === 'ko' ? 'Q. 결과가 예상과 다르면 어떻게 해야 하나요?' : 
                   currentLang === 'ja' ? 'Q. 結果が予想と異なる場合はどうすれば良いですか？' : 
                   'Q. What should I do if results differ from expectations?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {currentLang === 'ko' ? 
                    'A. 예상과 다른 결과가 나왔다면, 이를 새로운 자기 발견의 기회로 여겨보세요. 결과를 자세히 읽어보고, 어떤 부분이 맞고 어떤 부분이 다른지 생각해보며 자신에 대해 더 깊이 탐구해보시기 바랍니다.' :
                   currentLang === 'ja' ? 
                    'A. 予想と異なる結果が出た場合、これを新しい自己発見の機会として捉えてみてください。結果を詳しく読んで、どの部分が合っていてどの部分が異なるかを考えながら、自分についてより深く探求してみてください。' :
                    'A. If results differ from expectations, consider this as an opportunity for new self-discovery. Read the results carefully, think about which parts fit and which don\'t, and explore yourself more deeply.'
                  }
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}