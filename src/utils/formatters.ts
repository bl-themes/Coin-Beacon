export function formatCurrency(
  value: number | null | undefined,
  currencyOrDigits: string | number = 'USD',
  digitsOrCompact?: number | boolean,
  compactFlag?: boolean
): string {
  let currencyCode = 'USD';
  let digits = 2;
  let compact = false;

  if (typeof currencyOrDigits === 'string') {
    currencyCode = currencyOrDigits.toUpperCase();
    if (typeof digitsOrCompact === 'number') digits = digitsOrCompact;
    if (typeof compactFlag === 'boolean') compact = compactFlag;
  } else if (typeof currencyOrDigits === 'number') {
    digits = currencyOrDigits;
    if (typeof digitsOrCompact === 'boolean') compact = digitsOrCompact;
  }

  const isIdr = currencyCode === 'IDR';

  if (value === null || value === undefined || isNaN(value)) {
    return isIdr ? 'Rp0' : '$0.00';
  }

  if (isIdr) {
    if (compact) {
      if (Math.abs(value) >= 1e12) return `Rp${(value / 1e12).toFixed(2)} T`;
      if (Math.abs(value) >= 1e9) return `Rp${(value / 1e9).toFixed(2)} M`;
      if (Math.abs(value) >= 1e6) return `Rp${(value / 1e6).toFixed(2)} Jt`;
      if (Math.abs(value) >= 1e3) return `Rp${(value / 1e3).toFixed(2)} Rb`;
    }

    if (Math.abs(value) < 1 && Math.abs(value) > 0) {
      return `Rp${value.toFixed(4)}`;
    }

    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: digits === 0 ? 0 : 2,
    }).format(value);

    // Format like "Rp1.923.582.145" matching user spec (remove space after Rp if present)
    return formatted.replace(/^Rp\s*/, 'Rp');
  }

  // USD
  if (compact) {
    if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  }

  if (Math.abs(value) < 0.0001 && Math.abs(value) > 0) {
    return `$${value.toPrecision(4)}`;
  } else if (Math.abs(value) < 1 && Math.abs(value) > 0) {
    return `$${value.toFixed(4)}`;
  } else if (Math.abs(value) < 10) {
    return `$${value.toFixed(2)}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '0.00%';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatNumber(value: number | null | undefined, digits: number = 0): string {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}

export function formatDate(dateString: string | number | null | undefined): string {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return String(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function formatCompactDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}`;
}
