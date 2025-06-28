import { useTranslation } from 'react-i18next';
import { Calculator } from "@/components/calculator/Calculator";
import { CalculatorHistory } from "@/components/calculator/CalculatorHistory";
import { useCalculator } from "@/hooks/use-calculator";

export default function CalculatorPage() {
  const { t } = useTranslation();
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
          <h2 className="text-2xl font-bold mb-4">계산기 소개</h2>
          <p className="text-muted-foreground leading-relaxed">
            ToolHub.tools의 온라인 계산기는 일상생활과 업무에서 필요한 모든 계산을 빠르고 정확하게 처리할 수 있는 무료 웹 계산기입니다. 
            전문적인 계산 기능과 직관적인 인터페이스를 제공하여 학생, 직장인, 전문가 모두가 편리하게 사용할 수 있습니다. 
            별도의 설치나 다운로드 없이 웹브라우저에서 바로 접속하여 사용할 수 있으며, 모든 기기에서 최적화된 환경을 제공합니다.
          </p>
        </section>

        {/* 주요 기능 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">주요 기능</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">기본 연산 기능</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 기본 사칙연산 (덧셈, 뺄셈, 곱셈, 나눗셈)</li>
                <li>• 소수점 계산 및 음수 변환</li>
                <li>• 연속 계산 및 복합 연산 처리</li>
                <li>• 백스페이스 및 완전 초기화 기능</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">고급 기능</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 계산 기록 저장 및 재사용</li>
                <li>• 키보드 단축키 지원</li>
                <li>• 실시간 연산 표시</li>
                <li>• 모바일 터치 최적화</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 상세 사용법 가이드 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">상세 사용법 가이드</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">1. 기본 입력 방법</h3>
              <p className="text-muted-foreground">
                화면의 숫자 버튼을 클릭하거나 키보드로 직접 입력하여 계산할 수 있습니다. 
                연산자(+, -, *, /)를 선택한 후 다음 숫자를 입력하고 '=' 버튼으로 결과를 확인하세요.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">2. 키보드 단축키 활용</h3>
              <p className="text-muted-foreground">
                키보드의 숫자키와 연산 기호를 직접 사용할 수 있습니다. Enter키는 '='와 같은 기능을 하며, 
                Escape키로 전체 초기화, Backspace키로 마지막 입력을 삭제할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">3. 계산 기록 활용법</h3>
              <p className="text-muted-foreground">
                오른쪽 패널의 계산 기록에서 이전 계산 결과를 확인하고, 
                결과값을 클릭하여 현재 계산에 바로 사용할 수 있습니다. 
                '기록 지우기' 버튼으로 모든 기록을 삭제할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 활용 예시 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">활용 예시</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h3 className="text-lg font-semibold mb-2">일상 생활 계산</h3>
              <p className="text-muted-foreground text-sm">
                쇼핑 할인율 계산, 팁 계산, 가계부 정리, 요리 재료 비율 계산 등 
                일상에서 자주 발생하는 계산을 빠르게 처리할 수 있습니다.
              </p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
              <h3 className="text-lg font-semibold mb-2">업무 및 학습용</h3>
              <p className="text-muted-foreground text-sm">
                수학 문제 풀이, 회계 계산, 통계 데이터 분석, 공학 계산 등 
                전문적인 계산 작업을 효율적으로 수행할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 FAQ */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">Q. 계산 결과가 정확한가요?</h3>
              <p className="text-muted-foreground text-sm">
                A. 네, JavaScript의 정밀한 수치 연산을 통해 높은 정확도를 보장합니다. 
                다만 부동소수점 연산의 특성상 극히 작은 오차가 발생할 수 있습니다.
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">Q. 계산 기록은 어떻게 저장되나요?</h3>
              <p className="text-muted-foreground text-sm">
                A. 계산 기록은 브라우저 세션 동안만 임시 저장되며, 
                페이지를 새로고침하거나 닫으면 기록이 삭제됩니다.
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-semibold mb-2">Q. 모바일에서도 사용할 수 있나요?</h3>
              <p className="text-muted-foreground text-sm">
                A. 네, 모바일과 태블릿에 최적화된 반응형 디자인으로 
                터치 스크린에서도 편리하게 사용할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Q. 복잡한 수식도 계산할 수 있나요?</h3>
              <p className="text-muted-foreground text-sm">
                A. 기본 사칙연산과 괄호를 이용한 복합 계산이 가능합니다. 
                더 복잡한 공학 계산이 필요하시면 전용 공학용 계산기를 이용하시기 바랍니다.
              </p>
            </div>
          </div>
        </section>

        {/* 사용 팁과 요령 */}
        <section className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-4">사용 팁과 요령</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">효율성 팁</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 키보드 단축키를 활용하여 빠른 입력</li>
                <li>• 계산 기록을 활용한 연속 계산</li>
                <li>• C/CE 버튼의 차이점 숙지</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">정확성 팁</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 소수점 계산 시 반올림 확인</li>
                <li>• 큰 수 계산 시 단계별 검증</li>
                <li>• 연산 순서 확인 후 계산</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
