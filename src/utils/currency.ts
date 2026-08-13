/**
 * Utilitaires pour le formatage et la conversion bidevise (USD & Franc Congolais - CDF / FC)
 */

export const DEFAULT_EXCHANGE_RATE = 2850; // 1 USD = 2 850 FC

/**
 * Formate un montant en Francs Congolais (CDF / FC)
 * @param usdAmount Montant en Dollars USD
 * @param exchangeRate Taux de change (ex: 2850)
 */
export function formatCDF(usdAmount: number, exchangeRate: number = DEFAULT_EXCHANGE_RATE): string {
  const rate = exchangeRate > 0 ? exchangeRate : DEFAULT_EXCHANGE_RATE;
  const cdfAmount = Math.round(usdAmount * rate);
  return `${cdfAmount.toLocaleString('fr-FR')} FC`;
}

/**
 * Formate un montant en Dollars USD
 */
export function formatUSD(usdAmount: number): string {
  return `$${usdAmount.toLocaleString('fr-FR')}`;
}

/**
 * Calcule le montant en Francs Congolais brut
 */
export function toCDF(usdAmount: number, exchangeRate: number = DEFAULT_EXCHANGE_RATE): number {
  const rate = exchangeRate > 0 ? exchangeRate : DEFAULT_EXCHANGE_RATE;
  return Math.round(usdAmount * rate);
}

/**
 * Retourne le format combiné USD + Francs Congolais
 * Ex: "$280 • 798 000 FC"
 */
export function formatDualPrice(usdAmount: number, exchangeRate: number = DEFAULT_EXCHANGE_RATE): string {
  return `${formatUSD(usdAmount)} • ${formatCDF(usdAmount, exchangeRate)}`;
}
