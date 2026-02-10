const API_BASE = process.env.NETXL_API_BASE_URL || 'https://api.netxl.com';
const API_KEY = process.env.NETXL_API_KEY || '';

async function fetchNetXL<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'X-API-KEY': API_KEY,
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`NetXL API error: ${res.status} ${path}`);
  return res.json();
}

export interface NetXLProduct {
  sku: string;
  ean: string;
  name: string;
  manufacturer: string;
  store_url: string;
  categories: string[];
  images: { is_primary: boolean; url?: string }[];
  availability: { available: number };
  single_unit_cost: number;
  five_plus_unit_cost: number;
  ten_plus_unit_cost: number;
  consumer_unit_cost?: number;
  weight_kg: number;
  box_width_mm: number;
  box_height_mm: number;
  box_length_mm: number;
  attributes: Record<string, string>;
}

export interface NetXLOrderItem {
  id: number;
  product: {
    sku: string;
    ean?: string;
    availability?: { available: number };
  };
  quantity: number;
  cost_net: number;
  cost_tax: number;
  serial_numbers: string[];
}

export interface NetXLShipping {
  method_id: number;
  contact_email: string;
  contact_phone?: string;
  tracking_number?: string;
  cost_net: number;
  cost_tax: number;
}

export interface NetXLOrder {
  id: number;
  order_reference: string;
  customer_reference: string;
  cost_net: number;
  cost_tax: number;
  cost_gross: number;
  created_on: string;
  items: NetXLOrderItem[];
  shipping: NetXLShipping[];
}

export interface NetXLCredit {
  credit_limit: number;
  total_outstanding: number;
  available_credit: number;
  outstanding_orders: unknown[];
}

export interface NetXLCustomer {
  first_name: string;
  last_name: string;
  email_address: string;
  trade_account: boolean;
  credit_terms: {
    credit_limit: number;
    term_days: number;
  };
}

export interface NetXLAddress {
  id: number;
  contact_name: string;
  company_name: string;
  street_one: string;
  street_two: string;
  city: string;
  zip: string;
  country_code: string;
  contact_number: string;
}

export async function getBoldProducts(): Promise<NetXLProduct[]> {
  return fetchNetXL<NetXLProduct[]>('/product?manufacturer=bold');
}

export async function getOrders(): Promise<NetXLOrder[]> {
  return fetchNetXL<NetXLOrder[]>('/order');
}

export async function getCredit(): Promise<NetXLCredit> {
  return fetchNetXL<NetXLCredit>('/customer/credit');
}

export async function getCustomer(): Promise<NetXLCustomer> {
  return fetchNetXL<NetXLCustomer>('/customer');
}

export async function getAddresses(): Promise<NetXLAddress[]> {
  return fetchNetXL<NetXLAddress[]>('/customer/address');
}
