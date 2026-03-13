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
} from "lucide-react";

type BroadCategory = "Leasing" | "Purchase & Sales" | "Services (PM, FM, PDS)" | "Consulting" | "";
type Currency = "KRW" | "USD" | "JPY" | "EUR";

interface ProductItem {
  code: string;
  name: string;
  label: string;
  hint: string;
}

const PRODUCT_CATALOG: Record<string, ProductItem[]> = {
  "Leasing": [
    { code: "PT007", name: "Office Leasing",                label: "Office (PT007)",                hint: "오피스 빌딩 임차·임대 중개 및 자문 서비스" },
    { code: "PT008", name: "Retail Leasing",                label: "Retail (PT008)",                hint: "상업시설·리테일 공간 임차·임대 중개 및 자문" },
    { code: "PT009", name: "Industrial & Logistics Leasing",label: "Industrial & Logistics (PT009)", hint: "물류센터·산업시설 임차·임대 중개 및 자문" },
    { code: "PT010", name: "Land Leasing",                  label: "Land (PT010)",                  hint: "토지 임차·임대 중개 및 자문 서비스" },
  ],
  "Purchase & Sales": [
    { code: "PT001", name: "Office Investment",             label: "Office (PT001)",                hint: "오피스 빌딩 매입·매각 투자 자문 서비스" },
    { code: "PT002", name: "Retail Investment",             label: "Retail (PT002)",                hint: "리테일·상업시설 매입·매각 투자 자문" },
    { code: "PT003", name: "Industrial & Logistics Inv.",   label: "Industrial & Logistics (PT003)",hint: "물류센터·산업시설 매입·매각 투자 자문" },
    { code: "PT004", name: "Hotel Investment",              label: "Hotel (PT004)",                 hint: "호텔·숙박시설 매입·매각 투자 자문" },
    { code: "PT005", name: "Land Purchase & Sales",         label: "Land (PT005)",                  hint: "토지 매입·매각 중개 및 투자 자문" },
    { code: "PT006", name: "Mixed-use Investment",          label: "Mixed-use (PT006)",             hint: "복합용도 자산 매입·매각 투자 자문" },
  ],
  "Services (PM, FM, PDS)": [
    { code: "PT011", name: "Property Management",           label: "Property Management / PM (PT011)", hint: "자산 운영·임대관리·입주자 서비스 등 종합 PM" },
    { code: "PT012", name: "Facility Management",           label: "Facility Management / FM (PT012)", hint: "건물 시설물 운영·유지보수·에너지 관리 FM" },
    { code: "PT013", name: "Project & Design Supervision",  label: "Project & Design Supervision / PDS (PT013)", hint: "프로젝트 설계·시공·인테리어 감리 PDS" },
  ],
  "Consulting": [
    { code: "PT014", name: "Valuation",                     label: "Valuation (PT014)",             hint: "부동산 자산 감정평가 및 가치산정 자문" },
    { code: "PT015", name: "Research & Advisory",           label: "Research & Advisory (PT015)",   hint: "시장 동향 조사·분석 및 리서치 보고서 제공" },
    { code: "PT016", name: "Strategic Consulting",          label: "Strategic Consulting (PT016)",  hint: "포트폴리오 구성·부동산 전략 수립 자문" },
    { code: "PT017", name: "Due Diligence",                 label: "Due Diligence (PT017)",         hint: "투자 전 자산 실사 및 리스크 분석 서비스" },
  ],
};

interface Step1Data {
  clientName: string;
  buildingAlias: string;
  boardCategory: BroadCategory;
  productCode: string;
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

function generateProjectName(step1: Step1Data): string {
  const parts: string[] = [];
  const alias = step1.buildingAlias.trim();
  if (alias) parts.push(alias);
  if (step1.boardCategory) {
    const catMap: Record<string, string> = {
      "Leasing": "Leasing",
      "Purchase & Sales": "P&S",
      "Services (PM, FM, PDS)": "Services",
      "Consulting": "Consulting",
    };
    parts.push(catMap[step1.boardCategory] || step1.boardCategory);
  }
  if (step1.productCode) parts.push(`[${step1.productCode}]`);
  if (step1.contractDate) {
    const d = step1.contractDate.replace(/-/g, "").slice(4);
    parts.push(d);
  }
  return parts.join("_") || "";
}

function TopNav() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
          <Menu className="w-5 h-5" />
          <span className="text-sm font-medium">메뉴</span>
        </button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <img
          src="/__mockup/images/cw-logo.png"
          alt="Cushman & Wakefield"
          className="h-6 object-contain"
          style={{ filter: "invert(1) brightness(0)" }}
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="text-gray-500 hover:text-gray-700">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <Share2 className="w-5 h-5" />
        </button>
        <div className="flex items-center rounded-md border border-gray-200 overflow-hidden text-xs font-medium">
          <button className="px-3 py-1.5 bg-gray-900 text-white">KR</button>
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
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                i === current || i < current
                  ? "bg-[#1a2744] text-white"
                  : "bg-white text-gray-400 border-2 border-gray-300"
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-xs mt-1.5 whitespace-nowrap ${i === current ? "text-gray-800 font-medium" : "text-gray-400"}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px w-40 mb-5 mx-1 ${i < current ? "bg-[#1a2744]" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function InfoHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-gray-400 mt-1.5 flex items-start gap-1">
      <span className="inline-flex w-3.5 h-3.5 rounded-full border border-gray-400 items-center justify-center text-[9px] leading-none font-bold shrink-0 mt-px">i</span>
      <span>{children}</span>
    </p>
  );
}

function NavButtons({
  step, onBack, onNext, canNext, nextLabel = "다음 단계",
}: {
  step: number; onBack: () => void; onNext: () => void; canNext: boolean; nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mt-10">
      {step > 0 ? (
        <button onClick={onBack} className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-4 h-4" /> 이전 단계
        </button>
      ) : <div />}
      <button onClick={onNext} disabled={!canNext} className={`flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${canNext ? "bg-[#1a2744] text-white hover:bg-[#253561]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
        {nextLabel} <ChevronRight className="w-4 h-4" />
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
        <SelectTrigger className="w-20 h-10 text-sm border-gray-300 bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="KRW">KRW</SelectItem>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="JPY">JPY</SelectItem>
          <SelectItem value="EUR">EUR</SelectItem>
        </SelectContent>
      </Select>
      <Input className="flex-1 h-10 text-sm border-gray-300" placeholder="0" value={value} onChange={(e) => onChange(formatNumber(e.target.value))} />
    </div>
  );
}

function ServiceSelector({
  boardCategory, productCode,
  onBoardChange, onProductChange,
}: {
  boardCategory: BroadCategory; productCode: string;
  onBoardChange: (v: BroadCategory) => void; onProductChange: (v: string) => void;
}) {
  const products = boardCategory ? PRODUCT_CATALOG[boardCategory] ?? [] : [];
  const selectedProduct = products.find((p) => p.code === productCode);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Board Category</FieldLabel>
          <Select
            value={boardCategory}
            onValueChange={(v) => {
              onBoardChange(v as BroadCategory);
              onProductChange("");
            }}
          >
            <SelectTrigger className="h-10 text-sm border-gray-300 bg-white">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Leasing">Leasing</SelectItem>
              <SelectItem value="Purchase & Sales">Purchase &amp; Sales</SelectItem>
              <SelectItem value="Services (PM, FM, PDS)">Services (PM, FM, PDS)</SelectItem>
              <SelectItem value="Consulting">Consulting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <FieldLabel required={!!boardCategory}>Category &amp; Product Code</FieldLabel>
          <Select
            value={productCode}
            onValueChange={onProductChange}
            disabled={!boardCategory}
          >
            <SelectTrigger className={`h-10 text-sm border-gray-300 bg-white ${!boardCategory ? "opacity-50" : ""}`}>
              <SelectValue placeholder={boardCategory ? "세부 카테고리 선택" : "Board Category를 먼저 선택하세요"} />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {products.map((p) => (
                <SelectItem key={p.code} value={p.code}>
                  <div className="flex flex-col py-0.5">
                    <span className="font-medium text-sm text-gray-900">{p.label}</span>
                    <span className="text-xs text-gray-400 mt-0.5 leading-snug">{p.hint}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedProduct && (
            <div className="mt-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-100 rounded-md flex items-start gap-1.5">
              <span className="inline-flex w-4 h-4 rounded shrink-0 bg-[#1a2744] text-white items-center justify-center text-[9px] font-bold mt-px">
                {selectedProduct.code.slice(-2)}
              </span>
              <span className="text-xs text-blue-700 leading-snug">{selectedProduct.hint}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UploadBox({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors text-center">
        <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center">
          <Upload className="w-4 h-4 text-blue-500" />
        </div>
        <span className="text-xs text-gray-500">클릭하거나 파일을 드래그하여 업로드하세요.</span>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
    </div>
  );
}

function LeasingServiceFields({ data, onChange }: { data: ServiceDetails; onChange: (d: Partial<ServiceDetails>) => void }) {
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

function PurchaseSalesFields({ data, onChange }: { data: ServiceDetails; onChange: (d: Partial<ServiceDetails>) => void }) {
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
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Logistics">Logistics</SelectItem>
              <SelectItem value="Hotel">Hotel</SelectItem>
              <SelectItem value="Mixed-use">Mixed-use</SelectItem>
              <SelectItem value="Land">Land</SelectItem>
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

function SummaryCard({ step1, step2 }: { step1: Step1Data; step2: Step2Data }) {
  const selectedProduct = step1.boardCategory && step1.productCode
    ? PRODUCT_CATALOG[step1.boardCategory]?.find((p) => p.code === step1.productCode)
    : null;
  const svcLabel = selectedProduct
    ? `${step1.boardCategory} / ${selectedProduct.name} (${selectedProduct.code})`
    : step1.boardCategory || "—";

  return (
    <div className="bg-[#eef1f9] rounded-xl p-5 flex flex-col gap-3">
      <div className="text-sm font-semibold text-gray-700 mb-1">프로젝트 요약</div>
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-start gap-2">
          <span className="text-xs text-gray-500 shrink-0">Board Category</span>
          <span className="text-xs font-medium text-gray-800 text-right">{step1.boardCategory || "—"}</span>
        </div>
        {selectedProduct && (
          <div className="flex justify-between items-start gap-2">
            <span className="text-xs text-gray-500 shrink-0">Product</span>
            <span className="text-xs font-medium text-gray-800 text-right">{selectedProduct.label}</span>
          </div>
        )}
        <div className="flex justify-between items-start gap-2">
          <span className="text-xs text-gray-500 shrink-0">총 계약금</span>
          <span className="text-xs font-semibold text-gray-900 text-right">{step2.projectFee || "—"}</span>
        </div>

        {step1.boardCategory === "Leasing" && (
          <>
            {step2.serviceDetails.areaM2 && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-gray-500 shrink-0">면적</span>
                <span className="text-xs font-medium text-gray-800 text-right">{step2.serviceDetails.areaM2} m²</span>
              </div>
            )}
            {step2.serviceDetails.floorInfo && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-gray-500 shrink-0">해당 층</span>
                <span className="text-xs font-medium text-gray-800 text-right">{step2.serviceDetails.floorInfo}</span>
              </div>
            )}
            {step2.serviceDetails.deposit && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-gray-500 shrink-0">보증금</span>
                <span className="text-xs font-medium text-gray-800 text-right">{step2.serviceDetails.depositCurrency} {step2.serviceDetails.deposit}</span>
              </div>
            )}
            {step2.serviceDetails.monthlyRent && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-gray-500 shrink-0">월 임대료</span>
                <span className="text-xs font-medium text-gray-800 text-right">{step2.serviceDetails.monthlyRentCurrency} {step2.serviceDetails.monthlyRent}</span>
              </div>
            )}
          </>
        )}
        {step1.boardCategory === "Purchase & Sales" && (
          <>
            {step2.serviceDetails.areaM2 && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-gray-500 shrink-0">면적</span>
                <span className="text-xs font-medium text-gray-800 text-right">{step2.serviceDetails.areaM2} m²</span>
              </div>
            )}
            {step2.serviceDetails.buildingScale && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-gray-500 shrink-0">건물 규모</span>
                <span className="text-xs font-medium text-gray-800 text-right">{step2.serviceDetails.buildingScale}</span>
              </div>
            )}
            {step2.serviceDetails.dealPrice && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-gray-500 shrink-0">거래가</span>
                <span className="text-xs font-medium text-gray-800 text-right">{step2.serviceDetails.dealPriceCurrency} {step2.serviceDetails.dealPrice}</span>
              </div>
            )}
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

export function ProjectCreationForm() {
  const [step, setStep] = useState(0);
  const [projectNameOverride, setProjectNameOverride] = useState("");
  const [refundClause, setRefundClause] = useState(false);

  const [step1, setStep1] = useState<Step1Data>({
    clientName: "", buildingAlias: "",
    boardCategory: "", productCode: "",
    contractDate: today, coManagers: "",
  });

  const [step2, setStep2] = useState<Step2Data>({
    currency: "KRW", projectFee: "",
    plusOneIncluded: false, winAnnounce: false,
    serviceDetails: { ...defaultDetails },
  });

  const handleStep1Change = (partial: Partial<Step1Data>) => {
    if (partial.boardCategory && partial.boardCategory !== step1.boardCategory) {
      setStep2((prev) => ({ ...prev, serviceDetails: { ...defaultDetails } }));
    }
    setStep1((prev) => ({ ...prev, ...partial }));
  };

  const updateDetails = (partial: Partial<ServiceDetails>) => {
    setStep2((prev) => ({ ...prev, serviceDetails: { ...prev.serviceDetails, ...partial } }));
  };

  const autoProjectName = generateProjectName(step1);
  const finalProjectName = projectNameOverride || autoProjectName;

  const canProceedStep1 = !!step1.clientName && !!step1.buildingAlias && !!step1.boardCategory && !!step1.productCode && !!step1.contractDate;
  const canProceedStep2 = !!step2.projectFee;

  const isLeasing = step1.boardCategory === "Leasing";
  const isPurchaseSales = step1.boardCategory === "Purchase & Sales";

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <TopNav />

      <div className="flex-1 max-w-4xl mx-auto w-full px-8 py-8">
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ChevronLeft className="w-4 h-4" /> 프로젝트 목록으로 돌아가기
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-1">새 프로젝트 생성</h1>
        <p className="text-sm text-gray-500 mb-8">다음 단계를 따라 프로젝트를 생성하세요.</p>

        <div className="flex justify-center mb-10">
          <StepIndicator current={step} />
        </div>

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

              <ServiceSelector
                boardCategory={step1.boardCategory}
                productCode={step1.productCode}
                onBoardChange={(v) => handleStep1Change({ boardCategory: v })}
                onProductChange={(v) => handleStep1Change({ productCode: v })}
              />
              <InfoHint>선택한 Board Category와 Product Code는 프로젝트명 자동 생성에 사용됩니다.</InfoHint>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>용역 계약서 계약일</FieldLabel>
                  <Input type="date" className="h-10 text-sm border-gray-300" value={step1.contractDate} onChange={(e) => handleStep1Change({ contractDate: e.target.value })} />
                  <InfoHint>날짜는 작성 날짜 기준으로 자동 선택됩니다.</InfoHint>
                </div>
                <div>
                  <FieldLabel>공동 담당자</FieldLabel>
                  <div className="relative">
                    <Input className="h-10 text-sm border-gray-300 pr-8" placeholder="공동 관리자 이름 또는 이메일을 입력하세요" value={step1.coManagers} onChange={(e) => handleStep1Change({ coManagers: e.target.value })} />
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            <NavButtons step={step} onBack={() => setStep((s) => s - 1)} onNext={() => setStep((s) => s + 1)} canNext={canProceedStep1} />
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-7">프로젝트의 상세 내용을 알려주세요.</h2>

            <div className="flex gap-6">
              <div className="flex-1 flex flex-col gap-5">
                <div>
                  <FieldLabel>면적 (m²)</FieldLabel>
                  <Input className="h-10 text-sm border-gray-300" placeholder="예: 350.5" value={step2.serviceDetails.areaM2} onChange={(e) => updateDetails({ areaM2: e.target.value })} />
                </div>

                {isLeasing && <LeasingServiceFields data={step2.serviceDetails} onChange={updateDetails} />}
                {isPurchaseSales && <PurchaseSalesFields data={step2.serviceDetails} onChange={updateDetails} />}
                {!isLeasing && !isPurchaseSales && <OtherServiceFields data={step2.serviceDetails} onChange={updateDetails} />}

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
                <SummaryCard step1={step1} step2={step2} />
              </div>
            </div>

            <NavButtons step={step} onBack={() => setStep((s) => s - 1)} onNext={() => setStep((s) => s + 1)} canNext={canProceedStep2} />
          </div>
        )}

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
                <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors text-center">
                  <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-xs text-gray-500">클릭하거나 파일을 드래그하여 업로드하세요.</span>
                  <span className="text-xs text-gray-400">PDF, JPG, PNG 형식의 파일을 최대 5개까지 업로드할 수 있습니다.</span>
                </div>
              </div>
            </div>

            <NavButtons step={step} onBack={() => setStep((s) => s - 1)} onNext={() => {}} canNext={!!finalProjectName} nextLabel="다음 단계" />
          </div>
        )}
      </div>
    </div>
  );
}
