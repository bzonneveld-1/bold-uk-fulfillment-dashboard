// Bold UK Fulfillment - Pricing Configuration
// NetXL buys at 35% discount on retail price excl. BTW
// Bold pays €17.50 handling fee per order to NetXL

export const VAT_RATE = 0.21;
export const NETXL_DISCOUNT = 0.35;
export const HANDLING_FEE_PER_ORDER = 17.5;

interface SkuPricing {
  exactCode: string;
  exactName: string;
  retailPriceInclBtw: number;
}

// NetXL SKU → Exact article code + retail price (incl. 21% BTW)
export const SKU_PRICING: Record<string, SkuPricing> = {
  'BOLD-CONNECT':              { exactCode: '100196', exactName: 'Bold Connect',                    retailPriceInclBtw: 99.00 },
  'BOLD-SX-33':                { exactCode: '100309', exactName: 'SX-33 Bold Smart Cylinder',       retailPriceInclBtw: 229.00 },
  'BOLD-SX-43':                { exactCode: '100343', exactName: 'SX-43 Bold Smart Cylinder',       retailPriceInclBtw: 229.00 },
  'BOLD-SX-53':                { exactCode: '100344', exactName: 'SX-53 Bold Smart Cylinder',       retailPriceInclBtw: 229.00 },
  'BOLD-SX-63':                { exactCode: '100356', exactName: 'SX-63 Bold Smart Cylinder',       retailPriceInclBtw: 229.00 },
  'BOLD-SX-35':                { exactCode: '100357', exactName: 'SX-35 Bold Smart Cylinder',       retailPriceInclBtw: 229.00 },
  'BOLD-SX-45':                { exactCode: '100360', exactName: 'SX-45 Bold Smart Cylinder',       retailPriceInclBtw: 229.00 },
  'BOLD-SX-55':                { exactCode: '100364', exactName: 'SX-55 Bold Smart Cylinder',       retailPriceInclBtw: 229.00 },
  'BOLD-SX-65':                { exactCode: '100368', exactName: 'SX-65 Bold Smart Cylinder',       retailPriceInclBtw: 229.00 },
  'BOLD-CLICKER-SINGLE':       { exactCode: '100440', exactName: 'Bold Clicker (Single-pack)',      retailPriceInclBtw: 49.00 },
  'BOLD-SX-33-BLACK':          { exactCode: '100456', exactName: 'SX-33 Bold Smart Cylinder - Black', retailPriceInclBtw: 229.00 },
  'BOLD-SX-33-BRASS':          { exactCode: '100457', exactName: 'SX-33 Bold Smart Cylinder - Brass', retailPriceInclBtw: 229.00 },
  'BOLD-SX-33-COPPER':         { exactCode: '100458', exactName: 'SX-33 Bold Smart Cylinder - Copper', retailPriceInclBtw: 229.00 },
  'BOLD-BLACK-KNOB':           { exactCode: '100501', exactName: 'Outside Knob - Black',            retailPriceInclBtw: 39.00 },
  'BOLD-BRASS-KNOB':           { exactCode: '100502', exactName: 'Outside Knob - Brass',            retailPriceInclBtw: 39.00 },
  'BOLD-COPPER-KNOB':          { exactCode: '100503', exactName: 'Outside Knob - Copper',           retailPriceInclBtw: 39.00 },
  'BOLD-CLICKER-COVER-BLACK':  { exactCode: '100504', exactName: 'Bold Clicker Case Black',         retailPriceInclBtw: 9.00 },
  'BOLD-CLICKER-COVER-ORANGE': { exactCode: '100505', exactName: 'Bold Clicker Case Orange',        retailPriceInclBtw: 9.00 },
  'BOLD-CLICKER-COVER-BLUE':   { exactCode: '100506', exactName: 'Bold Clicker Case Blue',          retailPriceInclBtw: 9.00 },
  'BOLD-CLICKER-COVER-GREEN':  { exactCode: '100507', exactName: 'Bold Clicker Case Green',         retailPriceInclBtw: 9.00 },
  'BOLD-SILVER-KNOB':          { exactCode: '100513', exactName: 'Outside Knob - Silver',           retailPriceInclBtw: 39.00 },
  'BOLD-ELITE-SX-33':          { exactCode: '100531', exactName: 'Bold Elite - SX33 - Silver',      retailPriceInclBtw: 289.00 },
  'BOLD-ELITE-SX-43':          { exactCode: '100532', exactName: 'Bold Elite - SX43 - Silver',      retailPriceInclBtw: 289.00 },
  'BOLD-ELITE-SX-53':          { exactCode: '100533', exactName: 'Bold Elite - SX53 - Silver',      retailPriceInclBtw: 289.00 },
  'BOLD-ELITE-SX-63':          { exactCode: '100534', exactName: 'Bold Elite - SX63 - Silver',      retailPriceInclBtw: 289.00 },
  'BOLD-ELITE-SX-35':          { exactCode: '100535', exactName: 'Bold Elite - SX35 - Silver',      retailPriceInclBtw: 289.00 },
  'BOLD-ELITE-SX-45':          { exactCode: '100536', exactName: 'Bold Elite - SX45 - Silver',      retailPriceInclBtw: 289.00 },
  'BOLD-ELITE-SX-55':          { exactCode: '100537', exactName: 'Bold Elite - SX55 - Silver',      retailPriceInclBtw: 289.00 },
  'BOLD-ELITE-SX-65':          { exactCode: '100538', exactName: 'Bold Elite - SX65 - Silver',      retailPriceInclBtw: 289.00 },
  'BOLD-ELITE-SX-33-BLACK':    { exactCode: '100539', exactName: 'Bold Elite - SX33 - Black',       retailPriceInclBtw: 289.00 },
  'BOLD-ELITE-SX-33-BRASS':    { exactCode: '100540', exactName: 'Bold Elite - SX33 - Brass',       retailPriceInclBtw: 289.00 },
};

/** Price excl. BTW */
export function getRetailExclBtw(retailInclBtw: number): number {
  return Math.round((retailInclBtw / (1 + VAT_RATE)) * 100) / 100;
}

/** NetXL cost price = retail excl. BTW × (1 - discount) */
export function getNetxlCostPrice(retailInclBtw: number): number {
  return Math.round(getRetailExclBtw(retailInclBtw) * (1 - NETXL_DISCOUNT) * 100) / 100;
}

/** Get cost price for a NetXL SKU, returns null if SKU not found */
export function getSkuCostPrice(sku: string): number | null {
  const pricing = SKU_PRICING[sku];
  if (!pricing) return null;
  return getNetxlCostPrice(pricing.retailPriceInclBtw);
}

/** Get Exact article code for a NetXL SKU */
export function getExactCode(sku: string): string | null {
  return SKU_PRICING[sku]?.exactCode ?? null;
}
