import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { MSME, MSMEFormData, InvestmentTransaction, DividendRecord } from '@/types';

// ===== COLLECTION REFERENCES =====
const msmesCollection = collection(db, 'msmes');
const investmentsCollection = collection(db, 'investments');
const dividendsCollection = collection(db, 'dividends');

// ===== MSME FUNCTIONS =====

export async function createMSME(data: MSMEFormData, founderWallet: string): Promise<string> {
  const msmeData = {
    ...data,
    amountRaised: 0,
    tokenAddress: '',
    ipfsHash: '',
    status: 'pending',
    riskScore: calculateRiskScore(data),
    founderWallet,
    createdAt: Timestamp.now(),
    imageUrl: '',
  };

  const docRef = await addDoc(msmesCollection, msmeData);
  return docRef.id;
}

export async function getMSME(id: string): Promise<MSME | null> {
  const docRef = doc(db, 'msmes', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as MSME;
  }
  return null;
}

export async function getAllMSMEs(): Promise<MSME[]> {
  const q = query(msmesCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MSME[];
}

export async function getMSMEsByStatus(status: string): Promise<MSME[]> {
  const q = query(msmesCollection, where('status', '==', status));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MSME[];
}

export async function getMSMEsByCity(city: string): Promise<MSME[]> {
  const q = query(msmesCollection, where('city', '==', city));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MSME[];
}

export async function getMSMEsByCategory(category: string): Promise<MSME[]> {
  const q = query(msmesCollection, where('category', '==', category));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MSME[];
}

export async function updateMSME(id: string, data: Partial<MSME>): Promise<void> {
  const docRef = doc(db, 'msmes', id);
  await updateDoc(docRef, data);
}

export async function updateMSMETokenAddress(id: string, tokenAddress: string): Promise<void> {
  await updateMSME(id, { tokenAddress, status: 'fundraising' });
}

export async function approveMSME(id: string): Promise<void> {
  await updateMSME(id, { status: 'approved' });
}

// ===== INVESTMENT FUNCTIONS =====

export async function recordInvestment(data: {
  investorWallet: string;
  msmeId: string;
  msmeName: string;
  amount: number;
  tokensPurchased: string;
  txHash: string;
}): Promise<string> {
  const investmentData = {
    ...data,
    timestamp: Timestamp.now(),
    type: 'purchase',
  };

  const docRef = await addDoc(investmentsCollection, investmentData);
  return docRef.id;
}

export async function getInvestmentsByWallet(wallet: string): Promise<InvestmentTransaction[]> {
  const q = query(investmentsCollection, where('investorWallet', '==', wallet));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as InvestmentTransaction[];
}

export async function getInvestmentsByMSME(msmeId: string): Promise<InvestmentTransaction[]> {
  const q = query(investmentsCollection, where('msmeId', '==', msmeId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as InvestmentTransaction[];
}

// ===== DIVIDEND FUNCTIONS =====

export async function recordDividend(data: {
  msmeId: string;
  msmeName: string;
  totalAmount: number;
  txHash: string;
  recipients: { wallet: string; amount: number }[];
}): Promise<string> {
  const dividendData = {
    ...data,
    timestamp: Timestamp.now(),
  };

  const docRef = await addDoc(dividendsCollection, dividendData);
  return docRef.id;
}

export async function getDividendsByMSME(msmeId: string): Promise<DividendRecord[]> {
  const q = query(dividendsCollection, where('msmeId', '==', msmeId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DividendRecord[];
}

// ===== RISK SCORE CALCULATION =====

function calculateRiskScore(data: MSMEFormData): { score: number; label: string; factors: any[] } {
  const factors = [];
  let totalScore = 0;

  // Factor 1: Business Age (30% weight)
  const age = new Date().getFullYear() - data.foundingYear;
  let ageScore = 0;
  if (age >= 10) ageScore = 90;
  else if (age >= 5) ageScore = 70;
  else if (age >= 3) ageScore = 50;
  else if (age >= 1) ageScore = 30;
  else ageScore = 15;
  factors.push({ name: 'Business Age', score: ageScore, weight: 30 });
  totalScore += ageScore * 0.3;

  // Factor 2: Revenue (25% weight)
  let revenueScore = 0;
  if (data.revenue >= 5000000) revenueScore = 90;
  else if (data.revenue >= 2000000) revenueScore = 70;
  else if (data.revenue >= 1000000) revenueScore = 50;
  else if (data.revenue >= 500000) revenueScore = 35;
  else revenueScore = 20;
  factors.push({ name: 'Annual Revenue', score: revenueScore, weight: 25 });
  totalScore += revenueScore * 0.25;

  // Factor 3: Sector Stability (20% weight)
  const sectorScores: Record<string, number> = {
    food_beverage: 75, textile: 65, technology: 55, agriculture: 70,
    handicraft: 50, manufacturing: 70, services: 60, retail: 65,
    healthcare: 80, education: 75,
  };
  const sectorScore = sectorScores[data.category] || 50;
  factors.push({ name: 'Sector Stability', score: sectorScore, weight: 20 });
  totalScore += sectorScore * 0.2;

  // Factor 4: Team Size (15% weight)
  let teamScore = 0;
  if (data.employees >= 50) teamScore = 85;
  else if (data.employees >= 20) teamScore = 70;
  else if (data.employees >= 10) teamScore = 55;
  else if (data.employees >= 5) teamScore = 40;
  else teamScore = 25;
  factors.push({ name: 'Team Size', score: teamScore, weight: 15 });
  totalScore += teamScore * 0.15;

  // Factor 5: Equity Offered (10% weight)
  let equityScore = 0;
  if (data.equityOffered <= 5) equityScore = 85;
  else if (data.equityOffered <= 10) equityScore = 65;
  else if (data.equityOffered <= 15) equityScore = 45;
  else equityScore = 30;
  factors.push({ name: 'Equity Offered', score: equityScore, weight: 10 });
  totalScore += equityScore * 0.1;

  // Determine label
  const score = Math.round(totalScore);
  let label = 'Speculative';
  if (score >= 70) label = 'Conservative';
  else if (score >= 50) label = 'Moderate';
  else if (score >= 35) label = 'High';

  return { score, label, factors };
}

export { calculateRiskScore };