// utils/bigint.ts

// Recursively convert BigInt / BigNumber-like values -> strings
export function toStringBN(value: any): any {
  if (typeof value === "bigint") return value.toString();
  if (value && typeof value === "object" && value._isBigNumber) return value.toString(); // ethers BigNumber
  if (Array.isArray(value)) return value.map(v => toStringBN(v));
  if (value && typeof value === "object") {
    const out: any = {};
    for (const k of Object.keys(value)) out[k] = toStringBN(value[k]);
    return out;
  }
  return value;
}

// Convert raw bigint value or string into 18-decimal human readable string
export function format18(raw: string | bigint): string {
  const s = typeof raw === "bigint" ? raw.toString() : String(raw);

  const onlyDigits = s.startsWith("-")
    ? s.slice(1)
    : s.replace(/[^0-9]/g, "");

  const neg = s.startsWith("-");
  const padded = onlyDigits.padStart(19, "0");
  const intPart = padded.slice(0, padded.length - 18);
  const fracPart = padded.slice(-18);

  return (neg ? "-" : "") + `${intPart}.${fracPart}`;
}

/**
 * parseUnits("1.2345", 18) → 1234500000000000000n
 * parseUnits("1000", 6) → 1000000000n
 */
export function parseUnits(value: string, decimals: number = 18): bigint {
  if (!/^-?\d*\.?\d*$/.test(value)) {
    throw new Error(`Invalid numeric value: ${value}`);
  }

  const negative = value.startsWith("-");
  if (negative) value = value.slice(1); // remove '-'

  const [intPart = "0", fracPart = ""] = value.split(".");

  if (fracPart.length > decimals) {
    throw new Error(`Too many decimal places: expected <= ${decimals}`);
  }

  // right-pad fractional part to full decimals
  const fracPadded = fracPart.padEnd(decimals, "0");

  // bigint result
  const result = BigInt(intPart + fracPadded);

  return negative ? -result : result;
}
