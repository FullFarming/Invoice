import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Share2,
  Search,
  Upload,
  ChevronRight,
  ChevronLeft,
  Menu,
  Info,
} from "lucide-react";

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

const SERVICE_CATALOG: ServiceItem[] = [
  { id: "svc_001", broadCategory: "Leasing",                category: "Lease Renewal",                     workdayProductCode: "PT007", definition: "기존 임대차 계약의 갱신과 관련된 자문 서비스. 임대 조건 재협상, 계약 연장 및 갱신 조건 최적화를 지원합니다." },
  { id: "svc_002", broadCategory: "Leasing",                category: "New Lease",                         workdayProductCode: "PT008", definition: "신규 임대차 계약 체결을 위한 자문 서비스. 공간 탐색, 임대 조건 협상, 계약 체결 전 과정을 지원합니다." },
  { id: "svc_003", broadCategory: "Leasing",                category: "Lease Restructuring",               workdayProductCode: "PT009", definition: "기존 임대차 조건의 재조정 및 재협상 자문 서비스. 임대료, 기간, 인센티브 등 계약 조건 최적화를 지원합니다." },
  { id: "svc_004", broadCategory: "Leasing",                category: "Sublease Advisory",                 workdayProductCode: "PT010", definition: "전대차(Sublease) 관련 자문 서비스. 전대차 공간 물색, 전대차 조건 협상 및 계약 체결을 지원합니다." },
  { id: "svc_005", broadCategory: "Investment Sales",       category: "Office Acquisition",                workdayProductCode: "PT021", definition: "오피스 자산 매입 자문 서비스. 자산 발굴, 실사, 가치 평가, 협상 및 딜 클로징 전 과정을 지원합니다." },
  { id: "svc_006", broadCategory: "Investment Sales",       category: "Office Disposition",                workdayProductCode: "PT022", definition: "오피스 자산 매각 자문 서비스. 매각 전략 수립, 투자자 모집, 협상 및 딜 클로징을 지원합니다." },
  { id: "svc_007", broadCategory: "Investment Sales",       category: "Industrial & Logistics Acquisition", workdayProductCode: "PT023", definition: "물류·산업시설 매입 자문 서비스. 물류센터, 산업단지 등 자산의 매입 전 과정을 지원합니다." },
  { id: "svc_008", broadCategory: "Investment Sales",       category: "Industrial & Logistics Disposition", workdayProductCode: "PT024", definition: "물류·산업시설 매각 자문 서비스. 매각 전략 수립 및 투자자 모집, 협상을 지원합니다." },
  { id: "svc_009", broadCategory: "Investment Sales",       category: "Retail Acquisition",                workdayProductCode: "PT025", definition: "리테일·상업시설 매입 자문 서비스. 상업용 부동산 취득 전략 및 협상을 지원합니다." },
  { id: "svc_010", broadCategory: "Investment Sales",       category: "Hotel Investment",                  workdayProductCode: "PT026", definition: "호텔·숙박 자산 투자 자문 서비스. 호텔 매입·매각 전략 수립 및 딜 클로징을 지원합니다." },
  { id: "svc_011", broadCategory: "Services (PM, FM, PDS)", category: "Property Management",              workdayProductCode: "PT031", definition: "자산 운영 및 임대관리(PM) 서비스. 입주자 관리, 임대 운영, 자산 가치 유지·향상을 위한 종합 관리 서비스입니다." },
  { id: "svc_012", broadCategory: "Services (PM, FM, PDS)", category: "Facility Management",              workdayProductCode: "PT032", definition: "건물 시설물 운영·유지보수(FM) 서비스. 기계, 전기, 소방, 에너지 등 빌딩 시설 전반의 운영 관리를 담당합니다." },
  { id: "svc_013", broadCategory: "Services (PM, FM, PDS)", category: "Project & Design Supervision",     workdayProductCode: "PT033", definition: "프로젝트 설계·시공·감리(PDS) 서비스. 인테리어, 리모델링, 신축 등 프로젝트 전반의 설계 및 공사 관리를 지원합니다." },
  { id: "svc_014", broadCategory: "Consulting",             category: "Valuation",                        workdayProductCode: "PT041", definition: "부동산 자산 감정평가 및 가치산정 자문 서비스. 시장가치, 투자가치, 담보가치 등 다양한 목적의 가치 평가를 수행합니다." },
  { id: "svc_015", broadCategory: "Consulting",             category: "Research & Advisory",              workdayProductCode: "PT042", definition: "시장 동향 조사·분석 및 리서치 보고서 제공 서비스. 섹터별 시장 분석, 임대 시장 동향, 투자 시장 트렌드 등을 제공합니다." },
  { id: "svc_016", broadCategory: "Consulting",             category: "Strategic Consulting",             workdayProductCode: "PT043", definition: "포트폴리오 구성·부동산 전략 수립 자문 서비스. 자산 보유, 처분, 재구성 등 전략적 의사결정을 지원합니다." },
  { id: "svc_017", broadCategory: "Consulting",             category: "Due Diligence",                    workdayProductCode: "PT044", definition: "투자 전 자산 실사(DD) 및 리스크 분석 서비스. 물리적, 법적, 재무적 관점에서 자산의 현황과 리스크를 종합 분석합니다." },
];

interface Step1Data {
  clientName: string;
  buildingAlias: string;
  role: Role;
  broadCategory: BroadCategory;
  serviceId: string;
  contractDate: string;
  coManagers: string;
}

interface ServiceDetails {
  areaM2: string;
  floorInfo: string;
  buildingScale: string;
  deposit: string;
  depositCurrency: Currency;
  monthlyRent: string;
  monthlyRentCurrency: Currency;
  maintenanceFee: string;
  maintenanceFeeCurrency: Currency;
  leaseTerm: string;
  leaseTermUnit: string;
  rentFree: string;
  dealPrice: string;
  dealPriceCurrency: Currency;
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

function formatNumber(val: string): string {
  const n = val.replace(/[^0-9]/g, "");
  return n ? Number(n).toLocaleString("ko-KR") : "";
}

function generateProjectName(step1: Step1Data, selectedSvc: ServiceItem | null): string {
  const parts: string[] = [];
  if (step1.buildingAlias.trim()) parts.push(step1.buildingAlias.trim());
  if (step1.broadCategory) {
    const m: Record<string, string> = { "Leasing": "Leasing", "Investment Sales": "InvSales", "Services (PM, FM, PDS)": "Services", "Consulting": "Consulting" };
    parts.push(m[step1.broadCategory] ?? step1.broadCategory);
  }
  if (selectedSvc) parts.push(`[${selectedSvc.workdayProductCode}]`);
  if (step1.contractDate) parts.push(step1.contractDate.replace(/-/g, "").slice(4));
  return parts.join("_");
}

function TopNav() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
          <Menu className="w-5 h-5" /><span className="text-sm font-medium">메뉴</span>
        </button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <img src="/images/cw-logo.png" alt="Cushman & Wakefield" className="h-8 object-contain" />
      </div>
      <div className="flex items-center gap-3">
        <button className="text-gray-500 hover:text-gray-700"><Bell className="w-5 h-5" /></button>
        <button className="text-gray-500 hover:text-gray-700"><Share2 className="w-5 h-5" /></button>
        <div className="flex items-center rounded-md border border-gray-200 overflow-hidden text-xs font-medium">
          <button className="px-3 py-1.5 bg-[#1a2744] text-white">KR</button>
          <button className="px-3 py-1.5 bg-white text-gray-500 hover:bg-gray-50">En</button>
        </div>
      </div>
    </nav>
  );
}

function StepIndicator({ current }: { current: number }) {
  const steps = ["프로젝트 기본 정보", "상세 정보", "서류 및 완료"];
  return (
    <div className="flex items-center">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${i <= current ? "bg-[#1a2744] text-white" : "bg-white text-gray-400 border-2 border-gray-300"}`}>
              {i + 1}
            </div>
            <span className={`text-xs mt-1.5 whitespace-nowrap ${i === current ? "text-gray-800 font-medium" : "text-gray-400"}`}>{label}</span>
          </div>
          {i < steps.length - 1 && <div className={`h-px w-40 mb-5 mx-1 ${i < current ? "bg-[#1a2744]" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function InfoHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-gray-400 mt-1.5 flex items-start gap-1">
      <Info className="w-3 h-3 shrink-0 mt-px" /><span>{children}</span>
    </p>
  );
}

function NavButtons({ step, onBack, onNext, canNext, nextLabel = "다음 단계" }: {
  step: number; onBack: () => void; onNext: () => void; canNext: boolean; nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mt-10">
      {step > 0 ? (
        <button onClick={onBack} className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-4 h-4" />이전 단계
        </button>
      ) : <div />}
      <button onClick={onNext} disabled={!canNext} className={`flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${canNext ? "bg-[#1a2744] text-white hover:bg-[#253561]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
        {nextLabel}<ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function CurrencyAmountInput({ value, currency, onChange, onCurrencyChange }: {
  value: string; currency: Currency; onChange: (v: string) => void; onCurrencyChange: (v: Currency) => void;
}) {
  return (
    <div className="flex gap-2">
      <Select value={currency} onValueChange={(v) => onCurrencyChange(v as Currency)}>
        <SelectTrigger className="w-20 h-10 text-sm border-gray-300 bg-white"><SelectValue /></SelectTrigger>
        <SelectContent>
          {(["KRW", "USD", "JPY", "EUR"] as Currency[]).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <Input className="flex-1 h-10 text-sm border-gray-300" placeholder="0" value={value} onChange={(e) => onChange(formatNumber(e.target.value))} />
    </div>
  );
}

function UploadBox({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors text-center">
        <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center">
          <Upload className="w-4 h-4 text-blue-500" />
        </div>
        <span className="text-xs text-gray-500">클릭하거나 파일을 드래그하여 업로드하세요.</span>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
    </div>
  );
}

function LeasingFields({ data, onChange }: { data: ServiceDetails; onChange: (d: Partial<ServiceDetails>) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">임대차 정보</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>해당 층</FieldLabel>
          <Input className="h-10 text-sm border-gray-300" placeholder="예: 12F, B1, 3-5F" value={data.floorInfo} onChange={(e) => onChange({ floorInfo: e.target.value })} />
        </div>
        <div>
          <FieldLabel>보증금</FieldLabel>
          <CurrencyAmountInput value={data.deposit} currency={data.depositCurrency} onChange={(v) => onChange({ deposit: v })} onCurrencyChange={(v) => onChange({ depositCurrency: v })} />
        </div>
        <div>
          <FieldLabel>월 임대료</FieldLabel>
          <CurrencyAmountInput value={data.monthlyRent} currency={data.monthlyRentCurrency} onChange={(v) => onChange({ monthlyRent: v })} onCurrencyChange={(v) => onChange({ monthlyRentCurrency: v })} />
        </div>
        <div>
          <FieldLabel>관리비</FieldLabel>
          <CurrencyAmountInput value={data.maintenanceFee} currency={data.maintenanceFeeCurrency} onChange={(v) => onChange({ maintenanceFee: v })} onCurrencyChange={(v) => onChange({ maintenanceFeeCurrency: v })} />
        </div>
        <div>
          <FieldLabel>임대차 기간</FieldLabel>
          <div className="flex gap-2">
            <Input className="flex-1 h-10 text-sm border-gray-300" placeholder="24" value={data.leaseTerm} onChange={(e) => onChange({ leaseTerm: e.target.value })} />
            <Select value={data.leaseTermUnit} onValueChange={(v) => onChange({ leaseTermUnit: v })}>
              <SelectTrigger className="w-20 h-10 text-sm border-gray-300 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="개월">개월</SelectItem>
                <SelectItem value="년">년</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <FieldLabel>Rent Free / Incentive</FieldLabel>
          <Input className="h-10 text-sm border-gray-300" placeholder="예: 2개월 rent free" value={data.rentFree} onChange={(e) => onChange({ rentFree: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function InvestmentSalesFields({ data, onChange }: { data: ServiceDetails; onChange: (d: Partial<ServiceDetails>) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">매입매각 정보</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>건물 규모</FieldLabel>
          <Input className="h-10 text-sm border-gray-300" placeholder="예: B3 / 15F" value={data.buildingScale} onChange={(e) => onChange({ buildingScale: e.target.value })} />
        </div>
        <div>
          <FieldLabel>거래가</FieldLabel>
          <CurrencyAmountInput value={data.dealPrice} currency={data.dealPriceCurrency} onChange={(v) => onChange({ dealPrice: v })} onCurrencyChange={(v) => onChange({ dealPriceCurrency: v })} />
        </div>
        <div>
          <FieldLabel>자산 유형</FieldLabel>
          <Select value={data.assetType} onValueChange={(v) => onChange({ assetType: v })}>
            <SelectTrigger className="h-10 text-sm border-gray-300 bg-white"><SelectValue placeholder="선택" /></SelectTrigger>
            <SelectContent>
              {["Office", "Retail", "Logistics", "Hotel", "Mixed-use", "Land"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <FieldLabel>토지면적 (m²)</FieldLabel>
          <Input className="h-10 text-sm border-gray-300" placeholder="선택 입력" value={data.siteAreaM2} onChange={(e) => onChange({ siteAreaM2: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Cap Rate / 수익률</FieldLabel>
          <Input className="h-10 text-sm border-gray-300" placeholder="예: 4.2%" value={data.capRate} onChange={(e) => onChange({ capRate: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

function OtherServiceFields({ data, onChange }: { data: ServiceDetails; onChange: (d: Partial<ServiceDetails>) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>건물 규모 / 대상 범위</FieldLabel>
        <Input className="h-10 text-sm border-gray-300" placeholder="선택 입력" value={data.buildingScale} onChange={(e) => onChange({ buildingScale: e.target.value })} />
      </div>
      <div>
        <FieldLabel>프로젝트 설명</FieldLabel>
        <Textarea className="text-sm border-gray-300 resize-none" rows={3} placeholder="프로젝트 개요를 간략히 입력하세요" value={data.description} onChange={(e) => onChange({ description: e.target.value })} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className={`text-xs text-right ${bold ? "font-semibold text-gray-900" : "font-medium text-gray-800"}`}>{value}</span>
    </div>
  );
}

function SummaryCard({ step1, step2, selectedSvc }: { step1: Step1Data; step2: Step2Data; selectedSvc: ServiceItem | null }) {
  return (
    <div className="bg-[#eef1f9] rounded-xl p-5 flex flex-col gap-3 sticky top-8">
      <div className="text-sm font-semibold text-gray-700 mb-1">프로젝트 요약</div>
      <div className="flex flex-col gap-2.5">
        {step1.role && <SummaryRow label="Role" value={step1.role} />}
        {step1.broadCategory && <SummaryRow label="Broad Category" value={step1.broadCategory} />}
        {selectedSvc && <SummaryRow label="Service" value={`${selectedSvc.category} (${selectedSvc.workdayProductCode})`} />}
        <SummaryRow label="총 계약금" value={step2.projectFee || "—"} bold />
        {step1.broadCategory === "Leasing" && (
          <>
            {step2.serviceDetails.areaM2 && <SummaryRow label="면적" value={`${step2.serviceDetails.areaM2} m²`} />}
            {step2.serviceDetails.floorInfo && <SummaryRow label="해당 층" value={step2.serviceDetails.floorInfo} />}
            {step2.serviceDetails.deposit && <SummaryRow label="보증금" value={`${step2.serviceDetails.depositCurrency} ${step2.serviceDetails.deposit}`} />}
            {step2.serviceDetails.monthlyRent && <SummaryRow label="월 임대료" value={`${step2.serviceDetails.monthlyRentCurrency} ${step2.serviceDetails.monthlyRent}`} />}
          </>
        )}
        {step1.broadCategory === "Investment Sales" && (
          <>
            {step2.serviceDetails.areaM2 && <SummaryRow label="면적" value={`${step2.serviceDetails.areaM2} m²`} />}
            {step2.serviceDetails.buildingScale && <SummaryRow label="건물 규모" value={step2.serviceDetails.buildingScale} />}
            {step2.serviceDetails.dealPrice && <SummaryRow label="거래가" value={`${step2.serviceDetails.dealPriceCurrency} ${step2.serviceDetails.dealPrice}`} />}
          </>
        )}
      </div>
    </div>
  );
}

const today = new Date().toISOString().split("T")[0];
const defaultDetails: ServiceDetails = {
  areaM2: "", floorInfo: "", buildingScale: "",
  deposit: "", depositCurrency: "KRW",
  monthlyRent: "", monthlyRentCurrency: "KRW",
  maintenanceFee: "", maintenanceFeeCurrency: "KRW",
  leaseTerm: "", leaseTermUnit: "개월",
  rentFree: "", dealPrice: "", dealPriceCurrency: "KRW",
  assetType: "", siteAreaM2: "", capRate: "", description: "",
};

export default function ProjectCreationForm() {
  const [step, setStep] = useState(0);
  const [projectNameOverride, setProjectNameOverride] = useState("");
  const [refundClause, setRefundClause] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [step1, setStep1] = useState<Step1Data>({
    clientName: "", buildingAlias: "",
    role: "", broadCategory: "", serviceId: "",
    contractDate: today, coManagers: "",
  });

  const [step2, setStep2] = useState<Step2Data>({
    currency: "KRW", projectFee: "",
    plusOneIncluded: false, winAnnounce: false,
    serviceDetails: { ...defaultDetails },
  });

  const filteredServices = step1.broadCategory
    ? SERVICE_CATALOG.filter((s) => s.broadCategory === step1.broadCategory)
    : [];
  const selectedSvc = step1.serviceId
    ? SERVICE_CATALOG.find((s) => s.id === step1.serviceId) ?? null
    : null;

  const handleStep1Change = (partial: Partial<Step1Data>) => {
    if (partial.broadCategory && partial.broadCategory !== step1.broadCategory) {
      setStep2((p) => ({ ...p, serviceDetails: { ...defaultDetails } }));
      partial.serviceId = "";
    }
    setStep1((prev) => ({ ...prev, ...partial }));
  };

  const updateDetails = (partial: Partial<ServiceDetails>) => {
    setStep2((p) => ({ ...p, serviceDetails: { ...p.serviceDetails, ...partial } }));
  };

  const autoProjectName = generateProjectName(step1, selectedSvc);
  const finalProjectName = projectNameOverride || autoProjectName;

  const canProceedStep1 = !!step1.clientName && !!step1.buildingAlias && !!step1.role && !!step1.broadCategory && !!step1.serviceId && !!step1.contractDate;
  const canProceedStep2 = !!step2.projectFee;

  const isLeasing = step1.broadCategory === "Leasing";
  const isInvestment = step1.broadCategory === "Investment Sales";

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <TopNav />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 py-20">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">프로젝트가 생성되었습니다</h2>
            <p className="text-sm text-gray-500 mb-1">프로젝트명: <span className="font-semibold text-gray-800">{finalProjectName}</span></p>
            {selectedSvc && <p className="text-sm text-gray-500">서비스: {selectedSvc.category} ({selectedSvc.workdayProductCode})</p>}
          </div>
          <button onClick={() => { setSubmitted(false); setStep(0); setStep1({ clientName: "", buildingAlias: "", role: "", broadCategory: "", serviceId: "", contractDate: today, coManagers: "" }); setStep2({ currency: "KRW", projectFee: "", plusOneIncluded: false, winAnnounce: false, serviceDetails: { ...defaultDetails } }); setProjectNameOverride(""); setRefundClause(false); }}
            className="px-6 py-2.5 bg-[#1a2744] text-white text-sm font-medium rounded-lg hover:bg-[#253561] transition-colors">
            새 프로젝트 생성
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <TopNav />

      <div className="flex-1 max-w-4xl mx-auto w-full px-8 py-8">
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />프로젝트 목록으로 돌아가기
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-1">새 프로젝트 생성</h1>
        <p className="text-sm text-gray-500 mb-8">다음 단계를 따라 프로젝트를 생성하세요.</p>

        <div className="flex justify-center mb-10">
          <StepIndicator current={step} />
        </div>

        {/* STEP 1 */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">어떤 프로젝트인가요?</h2>
            <p className="text-sm text-gray-500 mb-7">고객사와 프로젝트 기본 정보를 입력해 주세요.</p>

            <div className="flex flex-col gap-5">
              <div>
                <FieldLabel required>고객사명 / 사업자번호</FieldLabel>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input className="h-10 text-sm border-gray-300 pl-9" placeholder="고객사를 검색하거나 새로 입력하세요" value={step1.clientName} onChange={(e) => handleStep1Change({ clientName: e.target.value })} />
                </div>
                <InfoHint>이미 등록된 고객사를 검색하거나 새로 추가할 수 있습니다.</InfoHint>
              </div>

              <div>
                <FieldLabel required>빌딩명 / 프로젝트 약칭</FieldLabel>
                <Input className="h-10 text-sm border-gray-300" placeholder="예: SFC, Gangnam Finance Center, ABC Tower 12F" value={step1.buildingAlias} onChange={(e) => handleStep1Change({ buildingAlias: e.target.value })} />
              </div>

              {/* Row 1: Role | Broad Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Role</FieldLabel>
                  <Select value={step1.role} onValueChange={(v) => handleStep1Change({ role: v as Role })}>
                    <SelectTrigger className="h-10 text-sm border-gray-300 bg-white">
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leasing">Leasing</SelectItem>
                      <SelectItem value="Purchase & Sales">Purchase &amp; Sales</SelectItem>
                      <SelectItem value="Services (PM, FM, PDS)">Services (PM, FM, PDS)</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                  <InfoHint>프로젝트명 자동 생성에 사용됩니다.</InfoHint>
                </div>

                <div>
                  <FieldLabel required>Broad Category</FieldLabel>
                  <Select value={step1.broadCategory} onValueChange={(v) => handleStep1Change({ broadCategory: v as BroadCategory })}>
                    <SelectTrigger className="h-10 text-sm border-gray-300 bg-white">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leasing">Leasing</SelectItem>
                      <SelectItem value="Investment Sales">Investment Sales</SelectItem>
                      <SelectItem value="Services (PM, FM, PDS)">Services (PM, FM, PDS)</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                  <InfoHint>Service 목록이 선택한 Broad Category에 맞게 표시됩니다.</InfoHint>
                </div>
              </div>

              {/* Row 2: Service (cascaded) */}
              <div>
                <FieldLabel required>Service</FieldLabel>
                <Select value={step1.serviceId} onValueChange={(v) => handleStep1Change({ serviceId: v })} disabled={!step1.broadCategory}>
                  <SelectTrigger className={`h-10 text-sm border-gray-300 bg-white ${!step1.broadCategory ? "opacity-50" : ""}`}>
                    <SelectValue placeholder={step1.broadCategory ? "Category + Workday Product Code 선택" : "먼저 Broad Category를 선택하세요"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {filteredServices.map((svc) => (
                      <SelectItem key={svc.id} value={svc.id}>
                        <div className="flex items-center gap-2 py-0.5">
                          <span className="inline-flex items-center justify-center rounded bg-[#1a2744] text-white text-[10px] font-bold px-1.5 py-0.5 shrink-0">
                            {svc.workdayProductCode}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{svc.category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!step1.broadCategory && (
                  <InfoHint>Broad Category를 선택하면 해당 카테고리의 Service 목록이 표시됩니다.</InfoHint>
                )}
              </div>

              {/* Row 3: Definition box */}
              {selectedSvc && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <span className="inline-flex items-center justify-center rounded bg-[#1a2744] text-white text-[10px] font-bold px-1.5 py-0.5">
                      {selectedSvc.workdayProductCode}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800 mb-1">{selectedSvc.category}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{selectedSvc.definition}</div>
                  </div>
                </div>
              )}
              {step1.broadCategory && !selectedSvc && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-400 text-center">
                  Service를 선택하면 상세 설명(Definition)이 여기에 표시됩니다.
                </div>
              )}

              {/* Row 4: Contract date | Co-manager */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>용역 계약서 계약일</FieldLabel>
                  <Input type="date" className="h-10 text-sm border-gray-300" value={step1.contractDate} onChange={(e) => handleStep1Change({ contractDate: e.target.value })} />
                  <InfoHint>날짜는 작성 날짜 기준으로 자동 선택됩니다.</InfoHint>
                </div>
                <div>
                  <FieldLabel>공동 담당자</FieldLabel>
                  <Input className="h-10 text-sm border-gray-300" placeholder="공동 관리자 이름 또는 이메일을 입력하세요" value={step1.coManagers} onChange={(e) => handleStep1Change({ coManagers: e.target.value })} />
                </div>
              </div>
            </div>

            <NavButtons step={step} onBack={() => setStep((s) => s - 1)} onNext={() => setStep((s) => s + 1)} canNext={canProceedStep1} />
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-7">프로젝트의 상세 내용을 알려주세요.</h2>
            <div className="flex gap-6">
              <div className="flex-1 flex flex-col gap-5">
                <div>
                  <FieldLabel>면적 (m²)</FieldLabel>
                  <Input className="h-10 text-sm border-gray-300" placeholder="예: 350.5" value={step2.serviceDetails.areaM2} onChange={(e) => updateDetails({ areaM2: e.target.value })} />
                </div>
                {isLeasing && <LeasingFields data={step2.serviceDetails} onChange={updateDetails} />}
                {isInvestment && <InvestmentSalesFields data={step2.serviceDetails} onChange={updateDetails} />}
                {!isLeasing && !isInvestment && <OtherServiceFields data={step2.serviceDetails} onChange={updateDetails} />}
                <div>
                  <FieldLabel required>프로젝트 총 금액</FieldLabel>
                  <CurrencyAmountInput value={step2.projectFee} currency={step2.currency} onChange={(v) => setStep2((p) => ({ ...p, projectFee: v }))} onCurrencyChange={(v) => setStep2((p) => ({ ...p, currency: v }))} />
                  <InfoHint>계약서 상의 전체 금액이며 인보이스는 이 금액 내에서 분할하여 진행 가능합니다.</InfoHint>
                </div>
                <label className="flex items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Checkbox checked={step2.plusOneIncluded} onCheckedChange={(v) => setStep2((p) => ({ ...p, plusOneIncluded: !!v }))} className="border-gray-300" />
                  <span className="text-sm text-gray-700">프로젝트에 Plus One이 포함되어 있나요?</span>
                </label>
                <label className="flex items-center gap-3 px-4 py-3.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Checkbox checked={step2.winAnnounce} onCheckedChange={(v) => setStep2((p) => ({ ...p, winAnnounce: !!v }))} className="border-gray-300" />
                  <span className="text-sm text-gray-700">Win Announce 여부</span>
                </label>
              </div>
              <div className="w-60 shrink-0">
                <SummaryCard step1={step1} step2={step2} selectedSvc={selectedSvc} />
              </div>
            </div>
            <NavButtons step={step} onBack={() => setStep((s) => s - 1)} onNext={() => setStep((s) => s + 1)} canNext={canProceedStep2} />
          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">거의 다 왔습니다.</h2>
            <p className="text-sm text-gray-500 mb-7">계약서 등 필수 서류를 첨부하고 프로젝트명을 확정해 주세요.</p>
            <div className="flex flex-col gap-6">
              <div>
                <FieldLabel required>프로젝트명 (최종 검토)</FieldLabel>
                <Input className="h-10 text-sm border-gray-300" value={projectNameOverride || autoProjectName} onChange={(e) => setProjectNameOverride(e.target.value)} />
                <InfoHint>자동 생성된 프로젝트명을 수정할 수 있습니다.</InfoHint>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox checked={refundClause} onCheckedChange={(v) => setRefundClause(!!v)} className="border-gray-300" />
                <span className="text-sm text-gray-700">Refund Clause Included</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                <UploadBox label="날인된 실계약서 (PDF)" required />
                <UploadBox label="사업자등록증 (PDF/Image)" required />
                <UploadBox label="임대차계약서" />
              </div>
              <div>
                <FieldLabel>기타 문서 (Optional)</FieldLabel>
                <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors text-center">
                  <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-xs text-gray-500">클릭하거나 파일을 드래그하여 업로드하세요.</span>
                  <span className="text-xs text-gray-400">PDF, JPG, PNG 형식의 파일을 최대 5개까지 업로드할 수 있습니다.</span>
                </div>
              </div>
            </div>
            <NavButtons step={step} onBack={() => setStep((s) => s - 1)} onNext={() => setSubmitted(true)} canNext={!!finalProjectName} nextLabel="프로젝트 생성 완료" />
          </div>
        )}
      </div>
    </div>
  );
}
