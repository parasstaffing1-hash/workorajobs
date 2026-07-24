/**
 * Company Directory Official Source Adapters
 * Structured adapters for SEC CIK dataset, Nasdaq/NYSE, NSE/BSE, and DPIIT Startup India definitions.
 */

export interface SourceRecord {
  sourceName: string;
  externalId: string;
  name: string;
  ticker?: string;
  exchange?: string;
  country: "US" | "IN";
  category: "public" | "private" | "startup";
  officialDomain?: string;
  cik?: string;
  nseSymbol?: string;
  bseCode?: string;
  isin?: string;
}

export function fetchSecUsPublicAdapters(): SourceRecord[] {
  return [
    {
      sourceName: "SEC_CIK_DATASET",
      externalId: "CIK0000320193",
      name: "Apple Inc.",
      ticker: "AAPL",
      exchange: "NASDAQ",
      country: "US",
      category: "public",
      officialDomain: "apple.com",
      cik: "0000320193",
    },
    {
      sourceName: "SEC_CIK_DATASET",
      externalId: "CIK0000789019",
      name: "Microsoft Corporation",
      ticker: "MSFT",
      exchange: "NASDAQ",
      country: "US",
      category: "public",
      officialDomain: "microsoft.com",
      cik: "0000789019",
    },
  ];
}

export function fetchNseBseIndiaAdapters(): SourceRecord[] {
  return [
    {
      sourceName: "NSE_DIRECTORY",
      externalId: "NSE_TCS",
      name: "Tata Consultancy Services Limited",
      ticker: "TCS",
      exchange: "NSE",
      country: "IN",
      category: "public",
      officialDomain: "tcs.com",
      nseSymbol: "TCS",
      bseCode: "532540",
      isin: "INE467B01029",
    },
    {
      sourceName: "NSE_DIRECTORY",
      externalId: "NSE_INFY",
      name: "Infosys Limited",
      ticker: "INFY",
      exchange: "NSE",
      country: "IN",
      category: "public",
      officialDomain: "infosys.com",
      nseSymbol: "INFY",
      bseCode: "500209",
      isin: "INE009A01021",
    },
  ];
}
