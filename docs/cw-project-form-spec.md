# CW Project Creation Form — AI 구현 스펙 문서

> 이 문서는 Cushman & Wakefield 내부 상업용 부동산 프로젝트 생성 폼의 **전체 구현 스펙**입니다.  
> 목적: AI에게 전달하여 동일한 디자인·기능을 재구현할 수 있도록 작성되었습니다.

---

## 1. 프로젝트 개요 (Project Overview)

| 항목 | 내용 |
|---|---|
| 목적 | Cushman & Wakefield 내부 상업용 부동산 프로젝트 생성 폼 |
| 기술 스택 | React 18 + TypeScript + Tailwind CSS v4 + shadcn/ui + lucide-react |
| 패키지 매니저 | pnpm (모노레포) |
| 라우팅 | wouter — `/` 에 단일 페이지로 마운트 |
| 상태 관리 | React useState (외부 라이브러리 없음) |
| UI 언어 | 한국어 (Korean) |
| 아이콘 라이브러리 | lucide-react |
| 빌드 도구 | Vite |

---

## 2. 디자인 토큰 (Design Tokens)

### 브랜드 컬러

| 용도 | Hex 값 | 설명 |
|---|---|---|
| Primary (CW Navy) | `#1a2744` | 버튼, 스텝 인디케이터 활성, 배지 배경 |
| Primary Hover | `#253561` | 버튼 hover 상태 |
| Summary Card BG | `#eef1f9` | Step 2 우측 요약 카드 배경 |
| Definition Box BG | `#eff6ff` (blue-50) | 서비스 정의 안내 박스 배경 |
| Definition Box Border | `#bfdbfe` (blue-200) | 서비스 정의 안내 박스 테두리 |

### CSS 변수 전체 (HSL, Light Mode — `:root`)

```css
:root {
  /* 기본 */
  --background: 0 0% 100%;           /* 흰색 전체 배경 */
  --foreground: 222 47% 11%;         /* 본문 텍스트 */
  --border: 214 32% 91%;             /* 기본 테두리 색 */
  --input: 214 32% 91%;              /* 입력 필드 테두리 */
  --ring: 219 49% 18%;               /* 포커스 링 */

  /* 카드 */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --card-border: 214 32% 91%;

  /* 팝오버 / 드롭다운 */
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
  --popover-border: 214 32% 91%;

  /* 프라이머리 (CW Navy) */
  --primary: 219 49% 18%;            /* = #1a2744 */
  --primary-foreground: 0 0% 100%;

  /* 세컨더리 */
  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 11%;

  /* Muted */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;

  /* Accent */
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;

  /* Destructive */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;

  /* 차트 */
  --chart-1: 219 49% 18%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;

  /* 반지름 */
  --radius: 0.5rem;                  /* 8px */
}
```

### 폰트

- **Sans-serif:** `Inter` (Google Fonts에서 로드)
- **Fallback:** `sans-serif`
- 전역 적용: `font-sans antialiased`

### Tailwind 텍스트 크기 패턴

| 요소 | Tailwind 클래스 |
|---|---|
| 페이지 제목 (h1) | `text-3xl font-bold text-gray-900` |
| 섹션 제목 (h2) | `text-2xl font-bold text-gray-900` |
| 필드 레이블 | `text-sm font-medium text-gray-700` |
| 필수 별표 | `text-red-500 ml-0.5` |
| 힌트 텍스트 | `text-xs text-gray-400` |
| 섹션 구분 헤더 | `text-xs font-semibold text-gray-400 uppercase tracking-widest` |
| 드롭다운 / 입력값 | `text-sm` |
| 요약 카드 레이블 | `text-xs text-gray-500` |
| 요약 카드 일반 값 | `text-xs font-medium text-gray-800` |
| 요약 카드 강조 값 | `text-xs font-semibold text-gray-900` |
| 서브텍스트 | `text-sm text-gray-500` |
| 네비게이션 버튼 | `text-sm font-medium` |

---

## 3. 레이아웃 구조 (Layout Structure)

```
┌──────────────────────────────────────────────────────────────────┐
│  TopNav  (h-14, bg-white, border-b border-gray-200)              │
│  왼쪽: 햄버거+메뉴 | 구분선 | CW 로고                           │
│  오른쪽: Bell | Share2 | [KR / En] 토글                         │
├──────────────────────────────────────────────────────────────────┤
│  Content Area  (max-w-4xl mx-auto w-full px-8 py-8)             │
│                                                                  │
│  ← 프로젝트 목록으로 돌아가기  (text-sm text-gray-500)          │
│                                                                  │
│  h1: 새 프로젝트 생성                                           │
│  subtitle: 다음 단계를 따라 프로젝트를 생성하세요.              │
│                                                                  │
│  StepIndicator  (flex justify-center mb-10)                     │
│  [●1]──────[○2]──────[○3]                                       │
│  기본정보        상세정보      서류및완료                        │
│                                                                  │
│  Step Content                                                    │
│  ┌─────────────────────────────────────┬────────────────┐        │
│  │  Form Fields  (flex-1)              │ SummaryCard    │        │
│  │  (Step 2에서만 2열 레이아웃 적용)  │ (w-60 sticky) │        │
│  └─────────────────────────────────────┴────────────────┘        │
│                                                                  │
│  NavButtons  (flex justify-between mt-10)                       │
│  [← 이전 단계]                          [다음 단계 →]           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 컴포넌트 명세 (Components)

### 4-1. TopNav

```
위치: 최상단 고정
크기: w-full h-14
배경: bg-white
하단 테두리: border-b border-gray-200
패딩: px-6
레이아웃: flex items-center justify-between

왼쪽 영역 (flex items-center gap-3):
  1. 햄버거 버튼
     - 아이콘: Menu (w-5 h-5 text-gray-600)
     - 텍스트: "메뉴" (text-sm font-medium text-gray-600)
     - hover: text-gray-900
  2. 수직 구분선: w-px h-5 bg-gray-200 mx-1
  3. CW 로고: <img src="/images/cw-logo.png" h-8 object-contain>

오른쪽 영역 (flex items-center gap-3):
  1. Bell 아이콘: w-5 h-5 text-gray-500, hover: text-gray-700
  2. Share2 아이콘: w-5 h-5 text-gray-500, hover: text-gray-700
  3. 언어 토글 버튼 그룹:
     - 컨테이너: flex rounded-md border border-gray-200 overflow-hidden text-xs font-medium
     - KR 버튼 (활성): px-3 py-1.5 bg-[#1a2744] text-white
     - En 버튼 (비활성): px-3 py-1.5 bg-white text-gray-500 hover:bg-gray-50
```

### 4-2. StepIndicator

```
전체: flex items-center (가운데 정렬)
3개 단계: ["프로젝트 기본 정보", "상세 정보", "서류 및 완료"]

각 단계 원형 (i <= current: 활성, i > current: 비활성):
  - 활성/현재: w-9 h-9 rounded-full bg-[#1a2744] text-white text-sm font-semibold
  - 비활성:   w-9 h-9 rounded-full bg-white text-gray-400 border-2 border-gray-300

연결선 (단계 사이):
  - 완료됨: h-px w-40 bg-[#1a2744] mb-5 mx-1
  - 미완료: h-px w-40 bg-gray-200 mb-5 mx-1

레이블:
  - 현재 단계: text-xs mt-1.5 text-gray-800 font-medium whitespace-nowrap
  - 나머지: text-xs mt-1.5 text-gray-400 whitespace-nowrap
```

### 4-3. FieldLabel

```tsx
<label className="block text-sm font-medium text-gray-700 mb-1.5">
  {children}
  {required && <span className="text-red-500 ml-0.5">*</span>}
</label>
```

Props: `children: React.ReactNode`, `required?: boolean`

### 4-4. InfoHint

```tsx
<p className="text-xs text-gray-400 mt-1.5 flex items-start gap-1">
  <Info className="w-3 h-3 shrink-0 mt-px" />
  <span>{children}</span>
</p>
```

Props: `children: React.ReactNode`  
아이콘: lucide-react `Info` (w-3 h-3)

### 4-5. NavButtons

```
전체: flex items-center justify-between mt-10

이전 단계 버튼 (step > 0일 때만 표시, 아니면 <div />):
  - 아이콘: ChevronLeft w-4 h-4 (왼쪽)
  - 텍스트: "이전 단계"
  - 스타일: px-5 py-2.5 text-sm font-medium text-gray-600
            bg-white border border-gray-300 rounded-lg
            hover:bg-gray-50 transition-colors

다음/완료 버튼:
  - 활성 (canNext=true): bg-[#1a2744] text-white hover:bg-[#253561]
  - 비활성 (canNext=false): bg-gray-200 text-gray-400 cursor-not-allowed
  - 아이콘: ChevronRight w-4 h-4 (오른쪽)
  - 텍스트: nextLabel prop (기본값: "다음 단계", Step 3: "프로젝트 생성 완료")
  - 스타일: flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors
```

Props: `step: number`, `onBack: () => void`, `onNext: () => void`, `canNext: boolean`, `nextLabel?: string`

### 4-6. CurrencyAmountInput

```
전체: flex gap-2

왼쪽 — 통화 선택 (shadcn Select):
  - 너비: w-20 h-10
  - 옵션: ["KRW", "USD", "JPY", "EUR"]
  - 스타일: text-sm border-gray-300 bg-white

오른쪽 — 금액 입력 (shadcn Input):
  - 너비: flex-1 h-10
  - placeholder: "0"
  - 스타일: text-sm border-gray-300
  - 입력 처리: formatNumber() 적용 → 한국 통화 포맷 (1,000,000)
```

Props: `value: string`, `currency: Currency`, `onChange: (v: string) => void`, `onCurrencyChange: (v: Currency) => void`

### 4-7. UploadBox

```
전체: flex flex-col gap-1

내부 드롭 존:
  - 테두리: border border-dashed border-gray-300 rounded-lg p-6
  - hover: hover:border-gray-400 hover:bg-gray-50 transition-colors
  - 레이아웃: flex flex-col items-center gap-2 cursor-pointer text-center

아이콘 컨테이너: w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center
  → Upload 아이콘 w-4 h-4 text-blue-500

안내 텍스트:
  - "클릭하거나 파일을 드래그하여 업로드하세요." (text-xs text-gray-500)
  - hint prop (선택): text-xs text-gray-400
```

Props: `label: string`, `required?: boolean`, `hint?: string`

### 4-8. SummaryCard (Step 2 우측 패널)

```
컨테이너:
  - 배경: bg-[#eef1f9]
  - 형태: rounded-xl p-5
  - 위치: sticky top-8
  - 너비: w-60 shrink-0 (부모에서 지정)

헤더: "프로젝트 요약" (text-sm font-semibold text-gray-700 mb-1)

항목 목록 (flex flex-col gap-2.5):
  조건부 표시 — 값이 있을 때만 렌더링:
  - Role
  - Broad Category
  - Service: "{category} ({workdayProductCode})"
  - 총 계약금 (bold=true)
  - Leasing일 때: 면적, 해당 층, 보증금 "{depositCurrency} {deposit}", 월 임대료
  - Investment Sales일 때: 면적, 건물 규모, 거래가 "{dealPriceCurrency} {dealPrice}"

SummaryRow 스타일:
  - 컨테이너: flex justify-between items-start gap-2
  - 레이블: text-xs text-gray-500 shrink-0
  - 일반 값: text-xs text-right font-medium text-gray-800
  - 강조 값 (bold): text-xs text-right font-semibold text-gray-900
```

### 4-9. ServiceDefinitionBox (Row 3 — 서비스 선택 후 자동 표시)

```
[A] 아직 선택 안 됨 (broadCategory 있고, serviceId 없을 때):
  - 스타일: rounded-lg border border-gray-200 bg-gray-50 p-4
  - 내용: "Service를 선택하면 상세 설명(Definition)이 여기에 표시됩니다."
  - 텍스트: text-sm text-gray-400 text-center

[B] 선택 완료 (serviceId 있을 때):
  - 스타일: rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3
  - 왼쪽: shrink-0 mt-0.5
    → 코드 배지: inline-flex rounded bg-[#1a2744] text-white text-[10px] font-bold px-1.5 py-0.5
    → 내용: selectedSvc.workdayProductCode (예: "PT008")
  - 오른쪽:
    → 제목: text-sm font-semibold text-gray-800 mb-1 (selectedSvc.category)
    → 설명: text-sm text-gray-600 leading-relaxed (selectedSvc.definition)
```

---

## 5. 3단계 폼 구조 (Form Steps)

### Step 1 — 프로젝트 기본 정보

**제목:** "어떤 프로젝트인가요?"  
**부제:** "고객사와 프로젝트 기본 정보를 입력해 주세요."

**필드 배치 (위에서 아래):**

| # | 필드명 | 컴포넌트 | 레이아웃 | 필수 | 힌트 |
|---|---|---|---|---|---|
| 1 | 고객사명 / 사업자번호 | Input + Search 아이콘 (left-3) | full width | ✅ | "이미 등록된 고객사를 검색하거나 새로 추가할 수 있습니다." |
| 2 | 빌딩명 / 프로젝트 약칭 | Input | full width | ✅ | — |
| 3 | Role | Select | grid cols-2 (왼쪽) | ✅ | "프로젝트명 자동 생성에 사용됩니다." |
| 4 | Broad Category | Select | grid cols-2 (오른쪽) | ✅ | "Service 목록이 선택한 Broad Category에 맞게 표시됩니다." |
| 5 | Service | Select (cascaded) | full width | ✅ | "Broad Category를 선택하면 해당 카테고리의 Service 목록이 표시됩니다." |
| 6 | Definition 박스 | 읽기 전용 표시 | full width | — | — |
| 7 | 용역 계약서 계약일 | Input type="date" | grid cols-2 (왼쪽) | ✅ | "날짜는 작성 날짜 기준으로 자동 선택됩니다." |
| 8 | 공동 담당자 | Input | grid cols-2 (오른쪽) | ❌ | — |

**Role 드롭다운 옵션:**
```
Leasing
Purchase & Sales
Services (PM, FM, PDS)
Consulting
```

**Broad Category 드롭다운 옵션:**
```
Leasing
Investment Sales
Services (PM, FM, PDS)
Consulting
```

**Service 드롭다운 — 각 아이템 렌더링:**
```tsx
<div className="flex items-center gap-2 py-0.5">
  <span className="inline-flex items-center justify-center rounded bg-[#1a2744] text-white text-[10px] font-bold px-1.5 py-0.5 shrink-0">
    {svc.workdayProductCode}  {/* 예: PT008 */}
  </span>
  <span className="text-sm font-medium text-gray-900">{svc.category}</span>
</div>
```

**Cascade 규칙:**
- broadCategory가 없으면 Service Select는 `disabled` + opacity-50
- broadCategory가 변경되면: `serviceId = ""` + Step 2 serviceDetails 전체 초기화

**Step 1 → Step 2 진행 조건:**
```typescript
const canProceedStep1 = 
  !!step1.clientName &&
  !!step1.buildingAlias &&
  !!step1.role &&
  !!step1.broadCategory &&
  !!step1.serviceId &&
  !!step1.contractDate;
```

---

### Step 2 — 상세 정보

**제목:** "프로젝트의 상세 내용을 알려주세요."  
**레이아웃:** `flex gap-6` → 왼쪽 폼(flex-1) + 오른쪽 SummaryCard(w-60)

#### 공통 상단 필드 (모든 Broad Category):
- 면적 (m²): Input (full width)

#### A. `broadCategory === "Leasing"` → LeasingFields

섹션 헤더: `"임대차 정보"` (text-xs font-semibold text-gray-400 uppercase tracking-widest)

`grid grid-cols-2 gap-4` 배치:

| 필드 | 컴포넌트 |
|---|---|
| 해당 층 | Input, placeholder: "예: 12F, B1, 3-5F" |
| 보증금 | CurrencyAmountInput |
| 월 임대료 | CurrencyAmountInput |
| 관리비 | CurrencyAmountInput |
| 임대차 기간 | Input(flex-1) + "개월/년" Select(w-20) |
| Rent Free / Incentive | Input, placeholder: "예: 2개월 rent free" |

#### B. `broadCategory === "Investment Sales"` → InvestmentSalesFields

섹션 헤더: `"매입매각 정보"` (동일 스타일)

`grid grid-cols-2 gap-4` 배치:

| 필드 | 컴포넌트 |
|---|---|
| 건물 규모 | Input, placeholder: "예: B3 / 15F" |
| 거래가 | CurrencyAmountInput |
| 자산 유형 | Select: Office / Retail / Logistics / Hotel / Mixed-use / Land |
| 토지면적 (m²) | Input, placeholder: "선택 입력" |
| Cap Rate / 수익률 | Input, placeholder: "예: 4.2%" |

#### C. 그 외 (`Services`, `Consulting`) → OtherServiceFields

| 필드 | 컴포넌트 |
|---|---|
| 건물 규모 / 대상 범위 | Input (full width) |
| 프로젝트 설명 | Textarea rows=3, resize-none |

#### 공통 하단 필드 (모든 Broad Category):

| 필드 | 컴포넌트 | 필수 |
|---|---|---|
| 프로젝트 총 금액 | CurrencyAmountInput (full) | ✅ |
| Plus One 포함 여부 | Checkbox + 레이블 카드 | ❌ |
| Win Announce 여부 | Checkbox + 레이블 카드 | ❌ |

**체크박스 카드 스타일:**
```
flex items-center gap-3 px-4 py-3.5
border border-gray-200 rounded-lg
cursor-pointer hover:bg-gray-50 transition-colors
```

**Step 2 → Step 3 진행 조건:**
```typescript
const canProceedStep2 = !!step2.projectFee;
```

---

### Step 3 — 서류 및 완료

**제목:** "거의 다 왔습니다."  
**부제:** "계약서 등 필수 서류를 첨부하고 프로젝트명을 확정해 주세요."

| 요소 | 내용 |
|---|---|
| 프로젝트명 (최종 검토) | Input — 자동 생성값 표시, 사용자가 직접 수정 가능 |
| Refund Clause Included | Checkbox + 텍스트 (카드 없음, 단독 label) |
| 날인된 실계약서 (PDF) | UploadBox (required) |
| 사업자등록증 (PDF/Image) | UploadBox (required) |
| 임대차계약서 | UploadBox |
| 기타 문서 (Optional) | 별도 대형 UploadBox (full width, p-8) |

업로드 박스 3개 그리드: `grid grid-cols-3 gap-4`

**Step 3 → 완료 진행 조건:**
```typescript
const canFinish = !!finalProjectName;  // 자동생성 or 수정값
```

---

### 완료 화면 (submitted === true)

```
레이아웃: flex-1 flex flex-col items-center justify-center gap-6 px-8 py-20

1. 성공 아이콘 원:
   w-16 h-16 rounded-full bg-green-100 flex items-center justify-center
   → SVG checkmark (w-8 h-8 text-green-600)
   → path: "M5 13l4 4L19 7"

2. 텍스트 블록 (text-center):
   - "프로젝트가 생성되었습니다" (text-2xl font-bold text-gray-900 mb-2)
   - "프로젝트명: {finalProjectName}" (text-sm text-gray-500)
   - "서비스: {category} ({workdayProductCode})" (text-sm text-gray-500)

3. "새 프로젝트 생성" 버튼:
   px-6 py-2.5 bg-[#1a2744] text-white text-sm font-medium rounded-lg
   hover:bg-[#253561] transition-colors
   → 클릭 시: 모든 state 초기화 후 Step 0 복귀
```

---

## 6. 서비스 카탈로그 전체 (Service Catalog)

```typescript
interface ServiceItem {
  id: string;               // "svc_001" ~ "svc_017"
  broadCategory: BroadCategory;
  category: string;         // 드롭다운 표시명
  workdayProductCode: string; // 코드 배지 표시
  definition: string;       // Definition 박스 한국어 설명
}
```

| id | broadCategory | category | code | definition |
|---|---|---|---|---|
| svc_001 | Leasing | Lease Renewal | PT007 | 기존 임대차 계약의 갱신과 관련된 자문 서비스. 임대 조건 재협상, 계약 연장 및 갱신 조건 최적화를 지원합니다. |
| svc_002 | Leasing | New Lease | PT008 | 신규 임대차 계약 체결을 위한 자문 서비스. 공간 탐색, 임대 조건 협상, 계약 체결 전 과정을 지원합니다. |
| svc_003 | Leasing | Lease Restructuring | PT009 | 기존 임대차 조건의 재조정 및 재협상 자문 서비스. 임대료, 기간, 인센티브 등 계약 조건 최적화를 지원합니다. |
| svc_004 | Leasing | Sublease Advisory | PT010 | 전대차(Sublease) 관련 자문 서비스. 전대차 공간 물색, 전대차 조건 협상 및 계약 체결을 지원합니다. |
| svc_005 | Investment Sales | Office Acquisition | PT021 | 오피스 자산 매입 자문 서비스. 자산 발굴, 실사, 가치 평가, 협상 및 딜 클로징 전 과정을 지원합니다. |
| svc_006 | Investment Sales | Office Disposition | PT022 | 오피스 자산 매각 자문 서비스. 매각 전략 수립, 투자자 모집, 협상 및 딜 클로징을 지원합니다. |
| svc_007 | Investment Sales | Industrial & Logistics Acquisition | PT023 | 물류·산업시설 매입 자문 서비스. 물류센터, 산업단지 등 자산의 매입 전 과정을 지원합니다. |
| svc_008 | Investment Sales | Industrial & Logistics Disposition | PT024 | 물류·산업시설 매각 자문 서비스. 매각 전략 수립 및 투자자 모집, 협상을 지원합니다. |
| svc_009 | Investment Sales | Retail Acquisition | PT025 | 리테일·상업시설 매입 자문 서비스. 상업용 부동산 취득 전략 및 협상을 지원합니다. |
| svc_010 | Investment Sales | Hotel Investment | PT026 | 호텔·숙박 자산 투자 자문 서비스. 호텔 매입·매각 전략 수립 및 딜 클로징을 지원합니다. |
| svc_011 | Services (PM, FM, PDS) | Property Management | PT031 | 자산 운영 및 임대관리(PM) 서비스. 입주자 관리, 임대 운영, 자산 가치 유지·향상을 위한 종합 관리 서비스입니다. |
| svc_012 | Services (PM, FM, PDS) | Facility Management | PT032 | 건물 시설물 운영·유지보수(FM) 서비스. 기계, 전기, 소방, 에너지 등 빌딩 시설 전반의 운영 관리를 담당합니다. |
| svc_013 | Services (PM, FM, PDS) | Project & Design Supervision | PT033 | 프로젝트 설계·시공·감리(PDS) 서비스. 인테리어, 리모델링, 신축 등 프로젝트 전반의 설계 및 공사 관리를 지원합니다. |
| svc_014 | Consulting | Valuation | PT041 | 부동산 자산 감정평가 및 가치산정 자문 서비스. 시장가치, 투자가치, 담보가치 등 다양한 목적의 가치 평가를 수행합니다. |
| svc_015 | Consulting | Research & Advisory | PT042 | 시장 동향 조사·분석 및 리서치 보고서 제공 서비스. 섹터별 시장 분석, 임대 시장 동향, 투자 시장 트렌드 등을 제공합니다. |
| svc_016 | Consulting | Strategic Consulting | PT043 | 포트폴리오 구성·부동산 전략 수립 자문 서비스. 자산 보유, 처분, 재구성 등 전략적 의사결정을 지원합니다. |
| svc_017 | Consulting | Due Diligence | PT044 | 투자 전 자산 실사(DD) 및 리스크 분석 서비스. 물리적, 법적, 재무적 관점에서 자산의 현황과 리스크를 종합 분석합니다. |

---

## 7. 비즈니스 로직 (Business Logic)

### 7-1. 프로젝트명 자동 생성

```typescript
function generateProjectName(step1: Step1Data, selectedSvc: ServiceItem | null): string {
  const parts: string[] = [];

  // 1. 빌딩 약칭
  if (step1.buildingAlias.trim()) parts.push(step1.buildingAlias.trim());

  // 2. Broad Category 축약
  if (step1.broadCategory) {
    const map: Record<string, string> = {
      "Leasing":                "Leasing",
      "Investment Sales":       "InvSales",
      "Services (PM, FM, PDS)": "Services",
      "Consulting":             "Consulting",
    };
    parts.push(map[step1.broadCategory] ?? step1.broadCategory);
  }

  // 3. Workday Product Code
  if (selectedSvc) parts.push(`[${selectedSvc.workdayProductCode}]`);

  // 4. 날짜 MMDD
  if (step1.contractDate) {
    parts.push(step1.contractDate.replace(/-/g, "").slice(4)); // "2026-04-02" → "0402"
  }

  return parts.join("_");
}

// 예시 결과:
// SFC_Leasing_[PT008]_0402
// GFC_InvSales_[PT021]_1215
// ABC_Services_[PT031]_0901
```

### 7-2. 숫자 포맷 (한국 통화)

```typescript
function formatNumber(val: string): string {
  const n = val.replace(/[^0-9]/g, "");  // 숫자만 추출
  return n ? Number(n).toLocaleString("ko-KR") : "";
  // "1000000" → "1,000,000"
  // "50000000" → "50,000,000"
}
```

### 7-3. 단계별 진행 Validation

```typescript
// Step 1 → Step 2
const canProceedStep1 =
  !!step1.clientName &&
  !!step1.buildingAlias &&
  !!step1.role &&
  !!step1.broadCategory &&
  !!step1.serviceId &&
  !!step1.contractDate;

// Step 2 → Step 3
const canProceedStep2 = !!step2.projectFee;

// Step 3 → 완료
const canFinish = !!finalProjectName; // projectNameOverride || autoProjectName
```

### 7-4. Broad Category 변경 시 연쇄 초기화

```typescript
const handleStep1Change = (partial: Partial<Step1Data>) => {
  // broadCategory가 변경될 때만 실행
  if (partial.broadCategory && partial.broadCategory !== step1.broadCategory) {
    // Service 선택 초기화
    partial.serviceId = "";
    // Step 2 서비스 상세 전체 초기화
    setStep2((p) => ({ ...p, serviceDetails: { ...defaultDetails } }));
  }
  setStep1((prev) => ({ ...prev, ...partial }));
};
```

### 7-5. 기본 초기값 (defaultDetails)

```typescript
const defaultDetails: ServiceDetails = {
  areaM2: "",
  floorInfo: "",
  buildingScale: "",
  deposit: "",         depositCurrency: "KRW",
  monthlyRent: "",     monthlyRentCurrency: "KRW",
  maintenanceFee: "",  maintenanceFeeCurrency: "KRW",
  leaseTerm: "",       leaseTermUnit: "개월",
  rentFree: "",
  dealPrice: "",       dealPriceCurrency: "KRW",
  assetType: "",
  siteAreaM2: "",
  capRate: "",
  description: "",
};

// contractDate 기본값: 오늘 날짜
const today = new Date().toISOString().split("T")[0]; // "2026-04-02"
```

---

## 8. shadcn/ui 컴포넌트 목록

| 컴포넌트 | import 경로 | 사용처 |
|---|---|---|
| `Input` | `@/components/ui/input` | 모든 텍스트 입력 |
| `Textarea` | `@/components/ui/textarea` | 프로젝트 설명 (Services/Consulting) |
| `Checkbox` | `@/components/ui/checkbox` | Plus One, Win Announce, Refund Clause |
| `Select` | `@/components/ui/select` | 모든 드롭다운 |
| `SelectTrigger` | `@/components/ui/select` | 드롭다운 트리거 버튼 |
| `SelectContent` | `@/components/ui/select` | 드롭다운 옵션 컨테이너 |
| `SelectItem` | `@/components/ui/select` | 드롭다운 개별 옵션 |
| `SelectValue` | `@/components/ui/select` | 선택된 값 표시 |
| `Toaster` | `@/components/ui/toaster` | 전역 토스트 (App.tsx) |
| `TooltipProvider` | `@/components/ui/tooltip` | 전역 툴팁 래퍼 (App.tsx) |

---

## 9. lucide-react 아이콘 목록

| 아이콘 이름 | 크기 | 색상 | 사용처 |
|---|---|---|---|
| `Menu` | `w-5 h-5` | `text-gray-600` | TopNav 햄버거 메뉴 |
| `Bell` | `w-5 h-5` | `text-gray-500` | TopNav 알림 버튼 |
| `Share2` | `w-5 h-5` | `text-gray-500` | TopNav 공유 버튼 |
| `Search` | `w-4 h-4` | `text-gray-400` | 고객사 검색 입력 (absolute left-3) |
| `Upload` | `w-4 h-4` | `text-blue-500` | 파일 업로드 박스 아이콘 |
| `ChevronLeft` | `w-4 h-4` | 버튼 상속 | 이전 단계 버튼 / 목록 복귀 링크 |
| `ChevronRight` | `w-4 h-4` | 버튼 상속 | 다음 단계 버튼 |
| `Info` | `w-3 h-3` | `text-gray-400` | InfoHint 아이콘 (shrink-0 mt-px) |

---

## 10. 상태 관리 (State Management)

### TypeScript 타입 정의

```typescript
type Role = "Leasing" | "Purchase & Sales" | "Services (PM, FM, PDS)" | "Consulting" | "";
type BroadCategory = "Leasing" | "Investment Sales" | "Services (PM, FM, PDS)" | "Consulting" | "";
type Currency = "KRW" | "USD" | "JPY" | "EUR";

interface ServiceItem {
  id: string;
  broadCategory: BroadCategory;
  category: string;
  workdayProductCode: string;
  definition: string;
}

interface Step1Data {
  clientName: string;
  buildingAlias: string;
  role: Role;
  broadCategory: BroadCategory;
  serviceId: string;
  contractDate: string;  // "YYYY-MM-DD"
  coManagers: string;
}

interface ServiceDetails {
  areaM2: string;
  floorInfo: string;
  buildingScale: string;
  deposit: string;           depositCurrency: Currency;
  monthlyRent: string;       monthlyRentCurrency: Currency;
  maintenanceFee: string;    maintenanceFeeCurrency: Currency;
  leaseTerm: string;         leaseTermUnit: string;  // "개월" | "년"
  rentFree: string;
  dealPrice: string;         dealPriceCurrency: Currency;
  assetType: string;
  siteAreaM2: string;
  capRate: string;
  description: string;
}

interface Step2Data {
  currency: Currency;
  projectFee: string;
  plusOneIncluded: boolean;
  winAnnounce: boolean;
  serviceDetails: ServiceDetails;
}
```

### useState 구조 (최상위 컴포넌트)

```typescript
export default function ProjectCreationForm() {
  // 폼 진행 상태
  const [step, setStep] = useState(0);                      // 0 | 1 | 2
  const [submitted, setSubmitted] = useState(false);         // 완료 화면 전환

  // Step 3 전용
  const [projectNameOverride, setProjectNameOverride] = useState("");
  const [refundClause, setRefundClause] = useState(false);

  // Step 1 데이터
  const [step1, setStep1] = useState<Step1Data>({
    clientName: "", buildingAlias: "",
    role: "", broadCategory: "", serviceId: "",
    contractDate: today,  // 오늘 날짜 자동 설정
    coManagers: "",
  });

  // Step 2 데이터
  const [step2, setStep2] = useState<Step2Data>({
    currency: "KRW", projectFee: "",
    plusOneIncluded: false, winAnnounce: false,
    serviceDetails: { ...defaultDetails },
  });

  // 파생 상태 (derived — useState 없음)
  const filteredServices = step1.broadCategory
    ? SERVICE_CATALOG.filter((s) => s.broadCategory === step1.broadCategory)
    : [];
  const selectedSvc = step1.serviceId
    ? SERVICE_CATALOG.find((s) => s.id === step1.serviceId) ?? null
    : null;
  const autoProjectName = generateProjectName(step1, selectedSvc);
  const finalProjectName = projectNameOverride || autoProjectName;
  const isLeasing = step1.broadCategory === "Leasing";
  const isInvestment = step1.broadCategory === "Investment Sales";
}
```

---

## 11. 전체 파일 구조 (File Tree)

```
artifacts/cw-project-form/
├── public/
│   └── images/
│       └── cw-logo.png              # CW 컬러 로고
│                                    # 빨간 건물 아이콘 + 회색 Cushman & Wakefield 텍스트
│                                    # 투명 배경, 흰 navbar 위에 배치
├── src/
│   ├── main.tsx                     # React 앱 진입점
│   ├── App.tsx                      # Router + QueryClient + TooltipProvider
│   ├── index.css                    # Tailwind v4 + CSS 변수 테마
│   ├── lib/
│   │   └── utils.ts                 # shadcn cn() 유틸
│   ├── pages/
│   │   ├── ProjectCreationForm.tsx  # 메인 폼 컴포넌트 (전체 로직 포함)
│   │   └── not-found.tsx            # 404 페이지
│   ├── hooks/
│   │   ├── use-toast.ts             # 토스트 훅
│   │   └── use-mobile.tsx           # 모바일 감지 훅
│   └── components/
│       └── ui/                      # shadcn/ui 컴포넌트 디렉토리
│           ├── input.tsx
│           ├── textarea.tsx
│           ├── checkbox.tsx
│           ├── select.tsx
│           ├── label.tsx
│           ├── button.tsx
│           ├── toaster.tsx
│           ├── tooltip.tsx
│           └── ...                  # 기타 shadcn 컴포넌트
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### App.tsx 핵심 구조

```tsx
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProjectCreationForm from "@/pages/ProjectCreationForm";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/" component={ProjectCreationForm} />
            <Route component={NotFound} />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

---

## 12. AI 구현 우선순위 (Implementation Priority)

다음 순서로 구현하면 의존성 문제 없이 완성할 수 있습니다.

| # | 작업 | 핵심 포인트 |
|---|---|---|
| 1 | CSS 변수 + Tailwind 테마 설정 | `--primary: 219 49% 18%` = `#1a2744` |
| 2 | TypeScript 타입 정의 | `Role`, `BroadCategory`, `Currency`, `ServiceItem`, `Step1Data`, `ServiceDetails`, `Step2Data` |
| 3 | `SERVICE_CATALOG` 배열 | 17개 항목 전체, id/broadCategory/category/workdayProductCode/definition |
| 4 | 유틸 함수 | `formatNumber()` (ko-KR), `generateProjectName()` |
| 5 | `TopNav` 컴포넌트 | CW 로고 + KR/En 토글 |
| 6 | `StepIndicator` 컴포넌트 | 3단계 원형 + 연결선 |
| 7 | 소형 공통 컴포넌트 | `FieldLabel`, `InfoHint`, `NavButtons`, `CurrencyAmountInput`, `UploadBox` |
| 8 | **Step 1** 구현 | Cascade Select + ServiceDefinitionBox + Validation |
| 9 | **Step 2** 구현 | 3종 동적 분기 필드 + `SummaryCard` sticky 패널 |
| 10 | **Step 3 + 완료 화면** | UploadBox 4개 + 프로젝트명 최종 확인 + submitted 상태 |

---

*최종 업데이트: 2026-04-02*  
*대상 시스템: Cushman & Wakefield 내부 CRE 프로젝트 관리 시스템*
