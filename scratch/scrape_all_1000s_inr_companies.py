# -*- coding: utf-8 -*-
import csv
import json
import os
import re
import time
import urllib.request

def fetch_page(page_num):
  url = f"https://companiesmarketcap.com/inr/?page={page_num}" if page_num > 1 else "https://companiesmarketcap.com/inr/"
  headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
  }
  req = urllib.request.Request(url, headers=headers)
  try:
    with urllib.request.urlopen(req, timeout=10) as response:
      return response.read().decode("utf-8")
  except Exception as e:
    print(f"Page {page_num} fetch error: {e}")
    return ""

def parse_companies_from_html(html, page_num, rank_offset):
  companies = []
  seen_slugs = set()

  # Pattern 1: HTML table rows <a href="/[slug]/marketcap/">
  # Matches <a href="/reliance-industries/marketcap/"> <div class="company-name">Reliance Industries</div> <div class="company-code">RELIANCE</div> </a>
  href_pattern = re.compile(r'href=["\']\/?([a-z0-9-]+)\/marketcap\/?["\'][^>]*>(.*?)<\/a>', re.DOTALL | re.IGNORECASE)
  
  for match in href_pattern.finditer(html):
    slug = match.group(1).lower().strip()
    inner_html = match.group(2)

    # Filter non-company links (like categories, etfs, etc.)
    if slug in ["all-countries", "total-marketcap", "categories", "etfs", "watchlist", "account"] or "etf" in slug:
      continue

    if slug in seen_slugs:
      continue
    seen_slugs.add(slug)

    # Clean inner html to get company name and ticker
    name_match = re.search(r'class=["\']company-name["\'][^>]*>(.*?)<\/div>', inner_html, re.DOTALL | re.IGNORECASE)
    code_match = re.search(r'class=["\']company-code["\'][^>]*>(.*?)<\/div>', inner_html, re.DOTALL | re.IGNORECASE)

    clean_name = name_match.group(1).strip() if name_match else re.sub(r'<[^>]+>', '', inner_html).strip()
    clean_ticker = code_match.group(1).strip() if code_match else slug.upper()[:8]

    if not clean_name:
      clean_name = slug.replace("-", " ").title()

    companies.append({
      "rank": rank_offset + len(companies) + 1,
      "name": clean_name,
      "slug": slug,
      "ticker": clean_ticker,
      "marketCapINR": "₹ Tracked",
      "country": "India" if "ns" in clean_ticker.lower() or "bo" in clean_ticker.lower() or slug in ["reliance-industries", "tata-consultancy-services", "hdfc-bank", "icici-bank", "state-bank-of-india", "bharti-airtel", "larsen-toubro", "infosys"] else "Global",
      "officialWebsite": f"https://www.{slug}.com",
      "careersUrl": f"https://www.{slug}.com/careers",
      "currency": "INR (₹)"
    })

  return companies

def main():
  print("Starting multi-page scraper for 1000s of companies from https://companiesmarketcap.com/inr/...")

  all_companies = []

  for page in range(1, 11):
    print(f"Scraping Page {page}...")
    html = fetch_page(page)

    if not html:
      print(f"Stopping at page {page} due to empty response.")
      break

    page_companies = parse_companies_from_html(html, page, len(all_companies))
    print(f"[Page {page}] Extracted {len(page_companies)} companies.")

    all_companies.extend(page_companies)
    time.sleep(1)

  print(f"\nExtracted total of {len(all_companies)} companies from CompaniesMarketCap INR rankings!")

  # Export CSV for Excel
  csv_path = "workorajobs_all_1000s_inr_companies.csv"
  fieldnames = ["Rank", "Company Name", "Slug", "Ticker Symbol", "Market Cap Currency", "Country", "Official Website URL", "Official Careers Portal URL"]

  with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for c in all_companies:
      writer.writerow({
        "Rank": c["rank"],
        "Company Name": c["name"],
        "Slug": c["slug"],
        "Ticker Symbol": c["ticker"],
        "Market Cap Currency": c["currency"],
        "Country": c["country"],
        "Official Website URL": c["officialWebsite"],
        "Official Careers Portal URL": c["careersUrl"]
      })

  print(f"Successfully exported {len(all_companies)} companies into Excel CSV: {csv_path}")

  # Export Native Excel XML Workbook
  xml_path = "workorajobs_all_1000s_inr_companies.xml"
  rows_xml = []
  for c in all_companies:
    rows_xml.append(f"""   <Row>
    <Cell><Data ss:Type="Number">{c['rank']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['name']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['slug']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['ticker']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['currency']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['country']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['officialWebsite']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['careersUrl']}</Data></Cell>
   </Row>""")

  xml_content = f"""<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="1000s Companies MarketCap INR">
  <Table>
   <Row>
    <Cell><Data ss:Type="String">Rank</Data></Cell>
    <Cell><Data ss:Type="String">Company Name</Data></Cell>
    <Cell><Data ss:Type="String">Slug</Data></Cell>
    <Cell><Data ss:Type="String">Ticker Symbol</Data></Cell>
    <Cell><Data ss:Type="String">Market Cap Currency</Data></Cell>
    <Cell><Data ss:Type="String">Country</Data></Cell>
    <Cell><Data ss:Type="String">Official Website URL</Data></Cell>
    <Cell><Data ss:Type="String">Official Careers Portal URL</Data></Cell>
   </Row>
{"".join(rows_xml)}
  </Table>
 </Worksheet>
</Workbook>"""

  with open(xml_path, "w", encoding="utf-8") as f:
    f.write(xml_content)

  print(f"Successfully exported {len(all_companies)} companies into Native Excel XML: {xml_path}")

if __name__ == "__main__":
  main()
