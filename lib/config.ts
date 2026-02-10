export const STOCK_CONFIG = {
  MIN_STOCK_THRESHOLD: 5,
  LOW_STOCK_WEEKS: 4,
  URGENT_STOCK_WEEKS: 2,
  TARGET_RESTOCK_WEEKS: 8,
};

export const SHIPPING_METHODS: Record<number, string> = {
  52: 'DPD Standard',
  53: 'DPD Next Working Day',
  1: 'Royal Mail',
  50: 'Express',
  51: 'Economy',
};
