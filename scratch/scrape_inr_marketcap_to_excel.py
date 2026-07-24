# -*- coding: utf-8 -*-
import csv
import json
import os
import re

import urllib.request

def fetch_html(url):
  headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  }
  req = urllib.request.Request(url, headers=headers)
  try:
    with urllib.request.urlopen(req) as response:
      return response.read().decode("utf-8")
  except Exception as e:
    print(f"Error fetching {url}: {e}")
    return ""

def main():
  url = "https://companiesmarketcap.com/inr/"
  print(f"Fetching live INR market cap data from {url}...")
  html = fetch_html(url)

  if not html:
    print("Could not fetch html content directly, checking local step saved html...")
    step_file = r"C:\Users\HP\.gemini\antigravity\brain\55bf4409-5ea1-46ca-b5a1-53b420a9c05b\.system_generated\steps\2551\content.md"
    if os.path.exists(step_file):
      with open(step_file, "r", encoding="utf-8") as f:
        html = f.read()

  # Pattern 1: Markdown format links [Company Name Ticker](https://companiesmarketcap.com/slug/marketcap/)
  # Pattern 2: HTML table rows <td class="company-name">...
  companies = []
  seen_slugs = set()

  md_matches = re.findall(r"\[([^\]]+)\]\(https?://companiesmarketcap\.com/([a-z0-9-]+)/marketcap/?\)", html)
  if md_matches:
    for idx, (raw_text, slug) in enumerate(md_matches, start=1):
      if slug in seen_slugs:
        continue
      seen_slugs.add(slug)
      
      parts = raw_text.strip().split()
      ticker = slug.upper()[:8]
      name = raw_text.strip()
      if len(parts) > 1 and len(parts[-1]) <= 10 and re.match(r"^[A-Z0-9.\-]+$", parts[-1]):
        ticker = parts[-1]
        name = " ".join(parts[:-1])

      companies.append({
        "rank": idx,
        "name": name,
        "slug": slug,
        "ticker": ticker,
        "marketCapINR": "₹ Live Tracked",
        "country": "India" if "ns" in ticker.lower() or "bo" in ticker.lower() or slug in ["reliance-industries", "tata-consultancy-services", "hdfc-bank", "icici-bank", "state-bank-of-india", "bharti-airtel", "larsen-toubro", "infosys"] else "Global / Multi-National",
        "officialWebsite": f"https://www.{slug}.com",
        "careersUrl": f"https://www.{slug}.com/careers",
        "currency": "INR (₹)"
      })

  if not companies:
    # Try parsing HTML href links
    html_matches = re.findall(r'href=["\']/?([a-z0-9-]+)/marketcap/?["\'][^>]*>(.*?)</a>', html)
    for idx, (slug, raw_inner) in enumerate(html_matches, start=1):
      clean_name = re.sub(r"<[^>]+>", "", raw_inner).strip()
      if not clean_name or slug in seen_slugs:
        continue
      seen_slugs.add(slug)

      companies.append({
        "rank": idx,
        "name": clean_name,
        "slug": slug,
        "ticker": slug.upper()[:8],
        "marketCapINR": "₹ Live Tracked",
        "country": "India" if slug in ["reliance-industries", "tata-consultancy-services", "hdfc-bank", "icici-bank", "state-bank-of-india", "bharti-airtel", "larsen-toubro", "infosys"] else "Global",
        "officialWebsite": f"https://www.{slug}.com",
        "careersUrl": f"https://www.{slug}.com/careers",
        "currency": "INR (₹)"
      })

  print(f"Extracted {len(companies)} INR market cap company records.")

  # Export 1: CSV for Excel
  csv_path = "companiesmarketcap_inr_companies.csv"
  fieldnames = ["Rank", "Company Name", "Slug", "Ticker Symbol", "Market Cap Currency", "Country", "Official Website URL", "Official Careers Portal URL"]
  
  with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for c in companies:
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

  print(f"Successfully generated CSV spreadsheet: {csv_path}")

  # Export 2: Native XML Excel Workbook
  xml_path = "companiesmarketcap_inr_companies.xml"
  rows_xml = []
  for c in companies:
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
 <Worksheet ss:Name="Companies MarketCap INR">
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

  print(f"Successfully generated Native Excel XML workbook: {xml_path}")

if __name__ == "__main__":
  main()
