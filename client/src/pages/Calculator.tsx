import { useTranslation } from 'react-i18next';
import { Calculator } from "@/components/calculator/Calculator";
import { CalculatorHistory } from "@/components/calculator/CalculatorHistory";
import { useCalculator } from "@/hooks/use-calculator";
import SEOHead from "@/components/SEOHead";

export default function CalculatorPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { state, operations, calculations } = useCalculator();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">온라인 계산기 - 무료 웹 계산기</h1>
        <p className="text-muted-foreground text-lg mb-6">
          간편하고 정확한 온라인 계산기로 복잡한 계산을 빠르게 처리하세요. 키보드 단축키 지원으로 더욱 효율적인 작업이 가능합니다.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <Calculator 
          currentInput={state.currentInput}
          expression={state.expression}
          onNumberClick={operations.handleNumberInput}
          onOperationClick={operations.handleOperation}
          onClearClick={operations.clear}
          onClearEntryClick={operations.clearEntry}
          onBackspaceClick={operations.backspace}
          onDecimalClick={operations.handleDecimalInput}
          onEqualsClick={operations.calculate}
          onNegateClick={() => operations.negate()}
        />
        
        <CalculatorHistory 
          history={state.history} 
          onClearHistory={calculations.clearHistory}
          onUseResult={calculations.useHistoryResult}
        />
      </div>

      {/* Detailed Content Section */}
      <div className="space-y-12">
        {/* 계산기 소개 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '계산기 소개' : 
             currentLang === 'ja' ? '計算機紹介' : 
             'Calculator Introduction'}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {currentLang === 'ko' ? 
              'ToolHub.tools의 온라인 계산기는 일상생활과 업무에서 필요한 모든 계산을 빠르고 정확하게 처리할 수 있는 무료 웹 계산기입니다. 전문적인 계산 기능과 직관적인 인터페이스를 제공하여 학생, 직장인, 전문가 모두가 편리하게 사용할 수 있습니다. 별도의 설치나 다운로드 없이 웹브라우저에서 바로 접속하여 사용할 수 있으며, 모든 기기에서 최적화된 환경을 제공합니다.' :
             currentLang === 'ja' ? 
              'ToolHub.toolsのオンライン計算機は、日常生活と業務で必要なあらゆる計算を迅速かつ正確に処理できる無料ウェブ計算機です。専門的な計算機能と直感的なインターフェースを提供し、学生、会社員、専門家の皆様が便利にご利用いただけます。別途のインストールやダウンロードなしにウェブブラウザで即座にアクセスして使用でき、全てのデバイスで最適化された環境を提供します。' :
              'ToolHub.tools online calculator is a free web calculator that can quickly and accurately process all calculations needed in daily life and work. It provides professional calculation functions and an intuitive interface that students, office workers, and professionals can all use conveniently. You can access and use it directly in your web browser without any installation or download, and it provides an optimized environment on all devices.'
            }
          </p>
        </section>

        {/* 주요 기능 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '주요 기능' : 
             currentLang === 'ja' ? '主要機能' : 
             'Main Features'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '기본 연산 기능' : 
                 currentLang === 'ja' ? '基本演算機能' : 
                 'Basic Operations'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 기본 사칙연산 (덧셈, 뺄셈, 곱셈, 나눗셈)' : 
                   currentLang === 'ja' ? '• 基本四則演算（加算、減算、乗算、除算）' : 
                   '• Basic arithmetic operations (add, subtract, multiply, divide)'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 소수점 계산 및 음수 변환' : 
                   currentLang === 'ja' ? '• 小数点計算および負数変換' : 
                   '• Decimal calculations and negative number conversion'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 연속 계산 및 복합 연산 처리' : 
                   currentLang === 'ja' ? '• 連続計算および複合演算処理' : 
                   '• Continuous calculations and complex operations'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 백스페이스 및 완전 초기화 기능' : 
                   currentLang === 'ja' ? '• バックスペースおよび完全初期化機能' : 
                   '• Backspace and complete reset functions'}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '고급 기능' : 
                 currentLang === 'ja' ? '高度な機能' : 
                 'Advanced Features'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 계산 기록 저장 및 재사용' : 
                   currentLang === 'ja' ? '• 計算履歴保存および再利用' : 
                   '• Calculation history storage and reuse'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 키보드 단축키 지원' : 
                   currentLang === 'ja' ? '• キーボードショートカット対応' : 
                   '• Keyboard shortcuts support'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 실시간 연산 표시' : 
                   currentLang === 'ja' ? '• リアルタイム演算表示' : 
                   '• Real-time calculation display'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 모바일 터치 최적화' : 
                   currentLang === 'ja' ? '• モバイルタッチ最適化' : 
                   '• Mobile touch optimization'}
                </li>
              </ul>
            </div>
          </div>
        </section>

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
                {currentLang === 'ko' ? '1. 기본 입력 방법' : 
                 currentLang === 'ja' ? '1. 基本入力方法' : 
                 '1. Basic Input Method'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '화면의 숫자 버튼을 클릭하거나 키보드로 직접 입력하여 계산할 수 있습니다. 연산자(+, -, *, /)를 선택한 후 다음 숫자를 입력하고 \'=\' 버튼으로 결과를 확인하세요.' :
                 currentLang === 'ja' ? 
                  '画面の数字ボタンをクリックするか、キーボードで直接入力して計算できます。演算子（+、-、*、/）を選択後、次の数字を入力し、「=」ボタンで結果を確認してください。' :
                  'You can calculate by clicking the number buttons on the screen or typing directly with your keyboard. Select an operator (+, -, *, /), then enter the next number and press the \'=\' button to see the result.'
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '2. 키보드 단축키 활용' : 
                 currentLang === 'ja' ? '2. キーボードショートカット活用' : 
                 '2. Keyboard Shortcuts'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '키보드의 숫자키와 연산 기호를 직접 사용할 수 있습니다. Enter키는 \'=\'와 같은 기능을 하며, Escape키로 전체 초기화, Backspace키로 마지막 입력을 삭제할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  'キーボードの数字キーと演算記号を直接使用できます。Enterキーは「=」と同じ機能で、Escapeキーで全体初期化、Backspaceキーで最後の入力を削除できます。' :
                  'You can directly use number keys and operation symbols on your keyboard. Enter key functions the same as \'=\', Escape key for complete reset, and Backspace key to delete the last input.'
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '3. 계산 기록 활용법' : 
                 currentLang === 'ja' ? '3. 計算履歴活用法' : 
                 '3. Using Calculation History'}
              </h3>
              <p className="text-muted-foreground">
                {currentLang === 'ko' ? 
                  '오른쪽 패널의 계산 기록에서 이전 계산 결과를 확인하고, 결과값을 클릭하여 현재 계산에 바로 사용할 수 있습니다. \'기록 지우기\' 버튼으로 모든 기록을 삭제할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '右パネルの計算履歴で以前の計算結果を確認し、結果値をクリックして現在の計算にすぐ使用できます。「履歴クリア」ボタンで全ての記録を削除できます。' :
                  'Check previous calculation results in the right panel\'s history, and click result values to use them directly in current calculations. Use the \'Clear History\' button to delete all records.'
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
                {currentLang === 'ko' ? '일상 생활 계산' : 
                 currentLang === 'ja' ? '日常生活計算' : 
                 'Daily Life Calculations'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '쇼핑 할인율 계산, 팁 계산, 가계부 정리, 요리 재료 비율 계산 등 일상에서 자주 발생하는 계산을 빠르게 처리할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  'ショッピング割引率計算、チップ計算、家計簿整理、料理材料比率計算など、日常でよく発生する計算を迅速に処理できます。' :
                  'Quickly handle calculations that frequently occur in daily life such as shopping discount rates, tip calculations, budget management, and cooking ingredient ratios.'
                }
              </p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
              <h3 className="text-lg font-semibold mb-2">
                {currentLang === 'ko' ? '업무 및 학습용' : 
                 currentLang === 'ja' ? '業務・学習用' : 
                 'Work & Study'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  '수학 문제 풀이, 회계 계산, 통계 데이터 분석, 공학 계산 등 전문적인 계산 작업을 효율적으로 수행할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  '数学問題解決、会計計算、統計データ分析、工学計算など専門的な計算作業を効率的に実行できます。' :
                  'Efficiently perform professional calculation tasks such as solving math problems, accounting calculations, statistical data analysis, and engineering calculations.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 FAQ */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '자주 묻는 질문 (FAQ)' : 
             currentLang === 'ja' ? 'よくある質問（FAQ）' : 
             'Frequently Asked Questions (FAQ)'}
          </h2>
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 계산 결과가 정확한가요?' : 
                 currentLang === 'ja' ? 'Q. 計算結果は正確ですか？' : 
                 'Q. Are the calculation results accurate?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 네, JavaScript의 정밀한 수치 연산을 통해 높은 정확도를 보장합니다. 다만 부동소수점 연산의 특성상 극히 작은 오차가 발생할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  'A. はい、JavaScriptの精密な数値演算により高い精度を保証します。ただし、浮動小数点演算の特性上、極めて小さな誤差が発生する場合があります。' :
                  'A. Yes, we guarantee high accuracy through JavaScript\'s precise numerical operations. However, extremely small errors may occur due to the nature of floating-point arithmetic.'
                }
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 계산 기록은 어떻게 저장되나요?' : 
                 currentLang === 'ja' ? 'Q. 計算履歴はどのように保存されますか？' : 
                 'Q. How is calculation history stored?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 계산 기록은 브라우저 세션 동안만 임시 저장되며, 페이지를 새로고침하거나 닫으면 기록이 삭제됩니다.' :
                 currentLang === 'ja' ? 
                  'A. 計算履歴はブラウザセッション中のみ一時保存され、ページをリフレッシュしたり閉じたりすると記録が削除されます。' :
                  'A. Calculation history is temporarily stored only during the browser session and will be deleted when you refresh or close the page.'
                }
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 모바일에서도 사용할 수 있나요?' : 
                 currentLang === 'ja' ? 'Q. モバイルでも使用できますか？' : 
                 'Q. Can I use it on mobile devices?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 네, 모바일과 태블릿에 최적화된 반응형 디자인으로 터치 스크린에서도 편리하게 사용할 수 있습니다.' :
                 currentLang === 'ja' ? 
                  'A. はい、モバイルとタブレットに最適化されたレスポンシブデザインで、タッチスクリーンでも便利に使用できます。' :
                  'A. Yes, with a responsive design optimized for mobile and tablets, you can use it conveniently on touch screens.'
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                {currentLang === 'ko' ? 'Q. 복잡한 수식도 계산할 수 있나요?' : 
                 currentLang === 'ja' ? 'Q. 複雑な数式も計算できますか？' : 
                 'Q. Can it calculate complex formulas?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {currentLang === 'ko' ? 
                  'A. 기본 사칙연산과 괄호를 이용한 복합 계산이 가능합니다. 더 복잡한 공학 계산이 필요하시면 전용 공학용 계산기를 이용하시기 바랍니다.' :
                 currentLang === 'ja' ? 
                  'A. 基本四則演算と括弧を使用した複合計算が可能です。より複雑な工学計算が必要な場合は、専用の工学計算機をご利用ください。' :
                  'A. Basic arithmetic operations and complex calculations using parentheses are possible. For more complex engineering calculations, please use a dedicated scientific calculator.'
                }
              </p>
            </div>
          </div>
        </section>

        {/* 사용 팁과 요령 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">
            {currentLang === 'ko' ? '사용 팁과 요령' : 
             currentLang === 'ja' ? '使用ヒントとコツ' : 
             'Usage Tips & Tricks'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '효율성 팁' : 
                 currentLang === 'ja' ? '効率性ヒント' : 
                 'Efficiency Tips'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 키보드 단축키를 활용하여 빠른 입력' : 
                   currentLang === 'ja' ? '• キーボードショートカットで高速入力' : 
                   '• Use keyboard shortcuts for fast input'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 계산 기록을 활용한 연속 계산' : 
                   currentLang === 'ja' ? '• 計算履歴を活用した連続計算' : 
                   '• Use calculation history for continuous calculations'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• C/CE 버튼의 차이점 숙지' : 
                   currentLang === 'ja' ? '• C/CEボタンの違いを把握' : 
                   '• Understand the difference between C/CE buttons'}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {currentLang === 'ko' ? '정확성 팁' : 
                 currentLang === 'ja' ? '正確性ヒント' : 
                 'Accuracy Tips'}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {currentLang === 'ko' ? '• 소수점 계산 시 반올림 확인' : 
                   currentLang === 'ja' ? '• 小数点計算時の四捨五入確認' : 
                   '• Check rounding when calculating decimals'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 큰 수 계산 시 단계별 검증' : 
                   currentLang === 'ja' ? '• 大きな数の計算時は段階的検証' : 
                   '• Verify step by step when calculating large numbers'}
                </li>
                <li>
                  {currentLang === 'ko' ? '• 연산 순서 확인 후 계산' : 
                   currentLang === 'ja' ? '• 演算順序確認後計算' : 
                   '• Check operation order before calculating'}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
