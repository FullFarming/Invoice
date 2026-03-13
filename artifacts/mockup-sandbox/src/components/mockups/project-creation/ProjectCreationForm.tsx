import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ChevronRight,
  ChevronLeft,
  Check,
  FileText,
  Upload,
  Users,
  CalendarIcon,
  X,
} from "lucide-react";

type Service = "Leasing" | "Investment Sales" | "Valuation" | "Project Management" | "기타" | "";
type Role = "Landlord" | "Tenant" | "Buyer" | "Seller" | "Investor" | "Advisory" | "";
type Currency = "KRW" | "USD" | "JPY" | "EUR";

interface Step1Data {
  clientName: string;
  businessNumber: string;
  buildingName: string;
  projectAlias: string;
  role: Role;
  service: Service;
  contractDate: string;
  coManagers: string[];
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
  notes: string;
  serviceDetails: ServiceDetails;
}

const STEP_LABELS = ["기본 정보", "상세 정보", "서류 및 완료"];

function formatNumber(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  return num ? Number(num).toLocaleString("ko-KR") : "";
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              i < current
                ? "bg-red-600 text-white"
                : i === current
                ? "bg-red-600 text-white ring-4 ring-red-100"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {i < current ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`h-0.5 w-16 transition-all ${
                i < current ? "bg-red-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CurrencyInput({
  label,
  value,
  currency,
  required,
  onChange,
  onCurrencyChange,
  placeholder = "0",
}: {
  label: string;
  value: string;
  currency: Currency;
  required?: boolean;
  onChange: (v: string) => void;
  onCurrencyChange: (v: Currency) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      <div className="flex gap-2">
        <Select value={currency} onValueChange={(v) => onCurrencyChange(v as Currency)}>
          <SelectTrigger className="w-24 h-9 text-xs bg-white border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="KRW">KRW</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="JPY">JPY</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
          </SelectContent>
        </Select>
        <Input
          className="flex-1 h-9 text-sm bg-white border-gray-200"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(formatNumber(e.target.value))}
        />
      </div>
    </div>
  );
}

function FieldGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

function LeasingFields({
  data,
  onChange,
}: {
  data: ServiceDetails;
  onChange: (d: Partial<ServiceDetails>) => void;
}) {
  return (
    <>
      <div className="col-span-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          임대차 정보
        </div>
      </div>
      <FieldGroup label="면적 (m²)" required>
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="예: 350.5"
          value={data.areaM2}
          onChange={(e) => onChange({ areaM2: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="해당 층" required>
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="예: 12F, B1, 3-5F"
          value={data.floorInfo}
          onChange={(e) => onChange({ floorInfo: e.target.value })}
        />
      </FieldGroup>
      <CurrencyInput
        label="보증금"
        required
        value={data.deposit}
        currency={data.depositCurrency}
        onChange={(v) => onChange({ deposit: v })}
        onCurrencyChange={(v) => onChange({ depositCurrency: v })}
      />
      <CurrencyInput
        label="월 임대료"
        required
        value={data.monthlyRent}
        currency={data.monthlyRentCurrency}
        onChange={(v) => onChange({ monthlyRent: v })}
        onCurrencyChange={(v) => onChange({ monthlyRentCurrency: v })}
      />
      <CurrencyInput
        label="관리비"
        value={data.maintenanceFee}
        currency={data.maintenanceFeeCurrency}
        onChange={(v) => onChange({ maintenanceFee: v })}
        onCurrencyChange={(v) => onChange({ maintenanceFeeCurrency: v })}
      />
      <FieldGroup label="임대차 기간">
        <div className="flex gap-2">
          <Input
            className="flex-1 h-9 text-sm bg-white border-gray-200"
            placeholder="예: 24"
            value={data.leaseTerm}
            onChange={(e) => onChange({ leaseTerm: e.target.value })}
          />
          <Select value={data.leaseTermUnit} onValueChange={(v) => onChange({ leaseTermUnit: v })}>
            <SelectTrigger className="w-20 h-9 text-xs bg-white border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="개월">개월</SelectItem>
              <SelectItem value="년">년</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FieldGroup>
      <FieldGroup label="Rent Free / Incentive">
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="예: 2개월 rent free"
          value={data.rentFree}
          onChange={(e) => onChange({ rentFree: e.target.value })}
        />
      </FieldGroup>
    </>
  );
}

function InvestmentSalesFields({
  data,
  role,
  onChange,
}: {
  data: ServiceDetails;
  role: Role;
  onChange: (d: Partial<ServiceDetails>) => void;
}) {
  const dealLabel =
    role === "Buyer" ? "매입가" : role === "Seller" ? "매각가" : "거래가";

  return (
    <>
      <div className="col-span-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          매입매각 정보
        </div>
      </div>
      <FieldGroup label="면적 (m²)" required>
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="연면적 또는 대상 면적"
          value={data.areaM2}
          onChange={(e) => onChange({ areaM2: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="건물 규모" required>
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="예: B3 / 15F"
          value={data.buildingScale}
          onChange={(e) => onChange({ buildingScale: e.target.value })}
        />
      </FieldGroup>
      <CurrencyInput
        label={dealLabel}
        required
        value={data.dealPrice}
        currency={data.dealPriceCurrency}
        onChange={(v) => onChange({ dealPrice: v })}
        onCurrencyChange={(v) => onChange({ dealPriceCurrency: v })}
      />
      <FieldGroup label="자산 유형">
        <Select value={data.assetType} onValueChange={(v) => onChange({ assetType: v })}>
          <SelectTrigger className="h-9 text-sm bg-white border-gray-200">
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Office">Office</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
            <SelectItem value="Logistics">Logistics</SelectItem>
            <SelectItem value="Hotel">Hotel</SelectItem>
            <SelectItem value="Mixed-use">Mixed-use</SelectItem>
            <SelectItem value="Land">Land</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup label="토지면적 (m²)">
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="선택 입력"
          value={data.siteAreaM2}
          onChange={(e) => onChange({ siteAreaM2: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Cap Rate / 수익률">
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="예: 4.2%"
          value={data.capRate}
          onChange={(e) => onChange({ capRate: e.target.value })}
        />
      </FieldGroup>
    </>
  );
}

function OtherServiceFields({
  data,
  onChange,
}: {
  data: ServiceDetails;
  onChange: (d: Partial<ServiceDetails>) => void;
}) {
  return (
    <>
      <div className="col-span-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          프로젝트 정보
        </div>
      </div>
      <FieldGroup label="면적 (m²)">
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="선택 입력"
          value={data.areaM2}
          onChange={(e) => onChange({ areaM2: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="건물 규모 / 대상 범위">
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="선택 입력"
          value={data.buildingScale}
          onChange={(e) => onChange({ buildingScale: e.target.value })}
        />
      </FieldGroup>
      <div className="col-span-2">
        <FieldGroup label="프로젝트 설명">
          <Textarea
            className="text-sm bg-white border-gray-200 resize-none"
            rows={3}
            placeholder="프로젝트 개요를 간략히 입력하세요"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </FieldGroup>
      </div>
    </>
  );
}

function ProjectSummaryCard({
  step1,
  step2,
}: {
  step1: Step1Data;
  step2: Step2Data;
}) {
  const { service, role, buildingName, projectAlias } = step1;
  const { serviceDetails, projectFee, currency } = step2;

  const projectName =
    [buildingName, projectAlias].filter(Boolean).join(" — ") || "프로젝트명 미입력";

  return (
    <div className="bg-gray-900 rounded-xl p-5 h-full flex flex-col gap-4 text-white">
      <div className="flex items-center gap-2 mb-1">
        <Building2 className="w-4 h-4 text-red-400" />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          프로젝트 요약
        </span>
      </div>

      <div>
        <div className="text-base font-bold text-white leading-snug">{projectName}</div>
        {step1.clientName && (
          <div className="text-xs text-gray-400 mt-0.5">{step1.clientName}</div>
        )}
      </div>

      {(role || service) && (
        <div className="flex gap-2 flex-wrap">
          {role && (
            <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs">
              {role}
            </Badge>
          )}
          {service && (
            <Badge className="bg-gray-700 text-gray-300 border-gray-600 text-xs">
              {service}
            </Badge>
          )}
        </div>
      )}

      <div className="border-t border-gray-700 pt-3 flex flex-col gap-2.5">
        {projectFee && (
          <SummaryRow label="총 계약금" value={`${currency} ${projectFee}`} highlight />
        )}

        {service === "Leasing" && (
          <>
            {serviceDetails.areaM2 && (
              <SummaryRow label="면적" value={`${serviceDetails.areaM2} m²`} />
            )}
            {serviceDetails.floorInfo && (
              <SummaryRow label="해당 층" value={serviceDetails.floorInfo} />
            )}
            {serviceDetails.deposit && (
              <SummaryRow
                label="보증금"
                value={`${serviceDetails.depositCurrency} ${serviceDetails.deposit}`}
              />
            )}
            {serviceDetails.monthlyRent && (
              <SummaryRow
                label="월 임대료"
                value={`${serviceDetails.monthlyRentCurrency} ${serviceDetails.monthlyRent}`}
              />
            )}
          </>
        )}

        {service === "Investment Sales" && (
          <>
            {serviceDetails.areaM2 && (
              <SummaryRow label="면적" value={`${serviceDetails.areaM2} m²`} />
            )}
            {serviceDetails.buildingScale && (
              <SummaryRow label="건물 규모" value={serviceDetails.buildingScale} />
            )}
            {serviceDetails.dealPrice && (
              <SummaryRow
                label="거래가"
                value={`${serviceDetails.dealPriceCurrency} ${serviceDetails.dealPrice}`}
              />
            )}
          </>
        )}

        {service !== "Leasing" && service !== "Investment Sales" && serviceDetails.areaM2 && (
          <SummaryRow label="면적" value={`${serviceDetails.areaM2} m²`} />
        )}
      </div>

      {(step2.plusOneIncluded || step2.winAnnounce) && (
        <div className="border-t border-gray-700 pt-3 flex flex-col gap-1.5">
          {step2.plusOneIncluded && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Check className="w-3 h-3" /> Plus One 포함
            </div>
          )}
          {step2.winAnnounce && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <Check className="w-3 h-3" /> Win Announce 예정
            </div>
          )}
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          계약일: {step1.contractDate || "—"}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span
        className={`text-xs font-medium text-right truncate ${
          highlight ? "text-red-400" : "text-gray-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Step1({
  data,
  onChange,
}: {
  data: Step1Data;
  onChange: (d: Partial<Step1Data>) => void;
}) {
  const [managerInput, setManagerInput] = useState("");

  const addManager = () => {
    const name = managerInput.trim();
    if (name && !data.coManagers.includes(name)) {
      onChange({ coManagers: [...data.coManagers, name] });
      setManagerInput("");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <FieldGroup label="고객사명" required>
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="고객사명을 입력하세요"
          value={data.clientName}
          onChange={(e) => onChange({ clientName: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="사업자번호">
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="000-00-00000"
          value={data.businessNumber}
          onChange={(e) => onChange({ businessNumber: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="빌딩명" required>
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="예: Gangnam Finance Center"
          value={data.buildingName}
          onChange={(e) => onChange({ buildingName: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="프로젝트 약칭" required>
        <Input
          className="h-9 text-sm bg-white border-gray-200"
          placeholder="예: GFC, ABC Tower 12F"
          value={data.projectAlias}
          onChange={(e) => onChange({ projectAlias: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="Role" required>
        <Select
          value={data.role}
          onValueChange={(v) => onChange({ role: v as Role })}
        >
          <SelectTrigger className="h-9 text-sm bg-white border-gray-200">
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Landlord">Landlord</SelectItem>
            <SelectItem value="Tenant">Tenant</SelectItem>
            <SelectItem value="Buyer">Buyer</SelectItem>
            <SelectItem value="Seller">Seller</SelectItem>
            <SelectItem value="Investor">Investor</SelectItem>
            <SelectItem value="Advisory">Advisory</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup label="Service" required>
        <Select
          value={data.service}
          onValueChange={(v) => onChange({ service: v as Service })}
        >
          <SelectTrigger className="h-9 text-sm bg-white border-gray-200">
            <SelectValue placeholder="선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Leasing">Leasing</SelectItem>
            <SelectItem value="Investment Sales">Investment Sales</SelectItem>
            <SelectItem value="Valuation">Valuation</SelectItem>
            <SelectItem value="Project Management">Project Management</SelectItem>
            <SelectItem value="기타">기타</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup label="용역 계약서 계약일" required>
        <Input
          type="date"
          className="h-9 text-sm bg-white border-gray-200"
          value={data.contractDate}
          onChange={(e) => onChange({ contractDate: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup label="공동 담당자">
        <div className="flex gap-2">
          <Input
            className="h-9 text-sm bg-white border-gray-200 flex-1"
            placeholder="이름 입력 후 추가"
            value={managerInput}
            onChange={(e) => setManagerInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addManager()}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addManager}
            className="h-9 px-3 text-xs border-gray-200"
          >
            추가
          </Button>
        </div>
        {data.coManagers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {data.coManagers.map((m) => (
              <Badge
                key={m}
                variant="secondary"
                className="text-xs gap-1 pl-2 pr-1"
              >
                <Users className="w-3 h-3" />
                {m}
                <button
                  onClick={() =>
                    onChange({
                      coManagers: data.coManagers.filter((x) => x !== m),
                    })
                  }
                  className="hover:text-red-500 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </FieldGroup>
    </div>
  );
}

function Step2({
  step1,
  data,
  onChange,
}: {
  step1: Step1Data;
  data: Step2Data;
  onChange: (d: Partial<Step2Data>) => void;
}) {
  const updateDetails = (partial: Partial<ServiceDetails>) => {
    onChange({ serviceDetails: { ...data.serviceDetails, ...partial } });
  };

  const isLeasing = step1.service === "Leasing";
  const isInvestment = step1.service === "Investment Sales";

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      <CurrencyInput
        label="프로젝트 총 금액"
        required
        value={data.projectFee}
        currency={data.currency}
        onChange={(v) => onChange({ projectFee: v })}
        onCurrencyChange={(v) => onChange({ currency: v })}
      />
      <div />

      {isLeasing && (
        <LeasingFields data={data.serviceDetails} onChange={updateDetails} />
      )}
      {isInvestment && (
        <InvestmentSalesFields
          data={data.serviceDetails}
          role={step1.role}
          onChange={updateDetails}
        />
      )}
      {!isLeasing && !isInvestment && (
        <OtherServiceFields data={data.serviceDetails} onChange={updateDetails} />
      )}

      <div className="col-span-2 border-t border-gray-100 pt-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          옵션
        </div>
        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={data.plusOneIncluded}
              onCheckedChange={(v) => onChange({ plusOneIncluded: !!v })}
              className="border-gray-300"
            />
            <span className="text-sm text-gray-700">Plus One 포함</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={data.winAnnounce}
              onCheckedChange={(v) => onChange({ winAnnounce: !!v })}
              className="border-gray-300"
            />
            <span className="text-sm text-gray-700">Win Announce 예정</span>
          </label>
        </div>
      </div>

      <div className="col-span-2">
        <FieldGroup label="비고 (내부 메모)">
          <Textarea
            className="text-sm bg-white border-gray-200 resize-none"
            rows={2}
            placeholder="내부 참고용 메모를 입력하세요"
            value={data.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </FieldGroup>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        서류 업로드
      </div>
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center gap-3 text-center hover:border-red-300 hover:bg-red-50/30 transition-colors cursor-pointer group">
        <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
          <Upload className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700">파일을 드래그하거나 클릭하여 업로드</div>
          <div className="text-xs text-gray-400 mt-0.5">
            용역 계약서, 제안서 등 관련 문서 (PDF, DOCX, XLSX)
          </div>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 text-center hover:border-red-300 hover:bg-red-50/30 transition-colors cursor-pointer group">
        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors">
          <FileText className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700">추가 첨부파일</div>
          <div className="text-xs text-gray-400 mt-0.5">건물 사진, 도면 등</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
        <div className="text-sm text-gray-600">
          파일 업로드는 선택 사항입니다. 지금 건너뛰고 나중에 추가할 수 있습니다.
        </div>
      </div>
    </div>
  );
}

const today = new Date().toISOString().split("T")[0];

export function ProjectCreationForm() {
  const [step, setStep] = useState(0);

  const [step1, setStep1] = useState<Step1Data>({
    clientName: "",
    businessNumber: "",
    buildingName: "",
    projectAlias: "",
    role: "",
    service: "",
    contractDate: today,
    coManagers: [],
  });

  const [step2, setStep2] = useState<Step2Data>({
    currency: "KRW",
    projectFee: "",
    plusOneIncluded: false,
    winAnnounce: false,
    notes: "",
    serviceDetails: {
      areaM2: "",
      floorInfo: "",
      buildingScale: "",
      deposit: "",
      depositCurrency: "KRW",
      monthlyRent: "",
      monthlyRentCurrency: "KRW",
      maintenanceFee: "",
      maintenanceFeeCurrency: "KRW",
      leaseTerm: "",
      leaseTermUnit: "개월",
      rentFree: "",
      dealPrice: "",
      dealPriceCurrency: "KRW",
      assetType: "",
      siteAreaM2: "",
      capRate: "",
      description: "",
    },
  });

  const handleStep1Change = (partial: Partial<Step1Data>) => {
    if (partial.service && partial.service !== step1.service) {
      setStep2((prev) => ({
        ...prev,
        serviceDetails: {
          areaM2: "",
          floorInfo: "",
          buildingScale: "",
          deposit: "",
          depositCurrency: "KRW",
          monthlyRent: "",
          monthlyRentCurrency: "KRW",
          maintenanceFee: "",
          maintenanceFeeCurrency: "KRW",
          leaseTerm: "",
          leaseTermUnit: "개월",
          rentFree: "",
          dealPrice: "",
          dealPriceCurrency: "KRW",
          assetType: "",
          siteAreaM2: "",
          capRate: "",
          description: "",
        },
      }));
    }
    setStep1((prev) => ({ ...prev, ...partial }));
  };

  const canProceed = () => {
    if (step === 0) {
      return (
        step1.clientName &&
        step1.buildingName &&
        step1.projectAlias &&
        step1.role &&
        step1.service &&
        step1.contractDate
      );
    }
    if (step === 1) {
      return !!step2.projectFee;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gray-900 px-8 py-4 flex items-center gap-3">
        <img
          src="/__mockup/images/cw-logo.png"
          alt="Cushman & Wakefield"
          className="h-7 object-contain"
        />
      </header>

      <div className="flex-1 px-8 py-8 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">새 프로젝트 생성</h1>
              <p className="text-sm text-gray-500 mt-1">
                {STEP_LABELS[step]} — Step {step + 1} / {STEP_LABELS.length}
              </p>
            </div>
            <StepIndicator current={step} total={STEP_LABELS.length} />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            {step === 0 && (
              <Step1 data={step1} onChange={handleStep1Change} />
            )}
            {step === 1 && (
              <Step2
                step1={step1}
                data={step2}
                onChange={(p) => setStep2((prev) => ({ ...prev, ...p }))}
              />
            )}
            {step === 2 && <Step3 />}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
                className="gap-1.5 text-gray-600"
              >
                <ChevronLeft className="w-4 h-4" /> 이전
              </Button>
              {step < STEP_LABELS.length - 1 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="bg-red-600 hover:bg-red-700 text-white gap-1.5"
                >
                  다음 <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button className="bg-red-600 hover:bg-red-700 text-white gap-1.5">
                  <Check className="w-4 h-4" /> 프로젝트 생성 완료
                </Button>
              )}
            </div>
          </div>

          <div className="w-64 shrink-0">
            <ProjectSummaryCard step1={step1} step2={step2} />
          </div>
        </div>
      </div>
    </div>
  );
}
