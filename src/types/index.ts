// ===== MSME Types =====
export interface MSME {
  id: string;
  name: string;
  category: MSMECategory;
  city: string;
  state: string;
  gstNumber: string;
  foundingYear: number;
  description: string;
  revenue: number;
  employees: number;
  targetAmount: number;
  equityOffered: number;
  amountRaised: number;
  tokenAddress: string;
  ipfsHash: string;
  status: MSMEStatus;
  riskScore: RiskScore;
  founderWallet: string;
  createdAt: number;
  imageUrl?: string;
}

export type MSMECategory =
  | 'food_beverage'
  | 'textile'
  | 'technology'
  | 'agriculture'
  | 'handicraft'
  | 'manufacturing'
  | 'services'
  | 'retail'
  | 'healthcare'
  | 'education';

export type MSMEStatus = 'pending' | 'approved' | 'fundraising' | 'funded' | 'refunded';

export interface RiskScore {
  score: number;
  label: RiskLabel;
  factors: RiskFactor[];
}

export type RiskLabel = 'Conservative' | 'Moderate' | 'High' | 'Speculative';

export interface RiskFactor {
  name: string;
  score: number;
  weight: number;
}

// ===== Investor Types =====
export interface Holding {
  msmeId: string;
  msmeName: string;
  tokenAddress: string;
  tokenBalance: string;
  equityPercentage: number;
  investedAmount: number;
  currentValuation: number;
  dividendsReceived: number;
}

export interface DividendRecord {
  id: string;
  msmeId: string;
  msmeName: string;
  amount: number;
  txHash: string;
  timestamp: number;
}

export interface InvestmentTransaction {
  id: string;
  msmeId: string;
  msmeName: string;
  amount: number;
  tokensPurchased: string;
  txHash: string;
  timestamp: number;
  type: 'purchase' | 'dividend' | 'refund';
}

// ===== Governance Types =====
export interface Proposal {
  id: number;
  msmeId: string;
  title: string;
  description: string;
  proposer: string;
  forVotes: string;
  againstVotes: string;
  startTime: number;
  endTime: number;
  executed: boolean;
  status: ProposalStatus;
}

export type ProposalStatus = 'active' | 'passed' | 'rejected' | 'executed';

// ===== Wallet Types =====
export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  balance: string;
}

// ===== Form Types =====
export interface MSMEFormData {
  name: string;
  category: MSMECategory;
  city: string;
  state: string;
  gstNumber: string;
  foundingYear: number;
  description: string;
  revenue: number;
  employees: number;
  targetAmount: number;
  equityOffered: number;
  documents?: File[];
}

// ===== API Response Types =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ===== Category Labels =====
export const CATEGORY_LABELS: Record<MSMECategory, string> = {
  food_beverage: '🍵 Food & Beverage',
  textile: '🧵 Textile & Garments',
  technology: '💻 Technology',
  agriculture: '🌾 Agriculture & Dairy',
  handicraft: '🎨 Handicraft & Artisan',
  manufacturing: '🏭 Manufacturing',
  services: '🔧 Services',
  retail: '🛒 Retail',
  healthcare: '🏥 Healthcare',
  education: '📚 Education',
};

// ===== Indian States =====
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir',
];

// ===== Indian Cities =====
export const MAJOR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Coimbatore',
];