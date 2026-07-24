# -*- coding: utf-8 -*-
import csv
import json
import os
import re

def main():
  file_path = os.path.join("src", "data", "companies.ts")
  if not os.path.exists(file_path):
    print("Error: src/data/companies.ts not found!")
    return

  with open(file_path, "r", encoding="utf-8") as f:
    raw_code = f.read()

  json_match = re.search(r"export const companiesData: Company\[\] = (\[.*\]);", raw_code, re.DOTALL)
  if not json_match:
    print("Error: Could not parse companiesData array from src/data/companies.ts")
    return

  companies = json.loads(json_match.group(1))
  print(f"Loaded {len(companies)} company records for Excel export...")

  # Prepare CSV output file
  csv_file_path = os.path.join("workorajobs_companies_directory.csv")
  
  fieldnames = [
    "Rank",
    "Company Name",
    "Legal / Official Name",
    "Ticker Symbol",
    "Stock Exchange",
    "Country",
    "Country Code (ISO-2)",
    "Headquarters",
    "Industry",
    "Sub-Industry",
    "Ownership Type",
    "Public / Private Status",
    "Startup Stage",
    "Market Capitalization",
    "Official Website URL",
    "Official Careers Portal URL",
    "Glassdoor Rating",
    "Global Workforce",
    "Tech Stack",
    "Verification Status",
    "Content Quality Score"
  ]

  with open(csv_file_path, "w", newline="", encoding="utf-8-sig") as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for idx, c in enumerate(companies, start=1):
      writer.writerow({
        "Rank": idx,
        "Company Name": c.get("name", ""),
        "Legal / Official Name": c.get("officialName") or c.get("legalName") or c.get("name", ""),
        "Ticker Symbol": c.get("ticker", ""),
        "Stock Exchange": c.get("stockExchange", ""),
        "Country": c.get("country", ""),
        "Country Code (ISO-2)": c.get("countryCode", ""),
        "Headquarters": c.get("headquarters", ""),
        "Industry": c.get("industry", ""),
        "Sub-Industry": c.get("subIndustry", ""),
        "Ownership Type": c.get("ownershipType", ""),
        "Public / Private Status": c.get("publicPrivateStatus", ""),
        "Startup Stage": c.get("startupStage", ""),
        "Market Capitalization": c.get("marketCap", ""),
        "Official Website URL": c.get("website", ""),
        "Official Careers Portal URL": c.get("careersUrl", ""),
        "Glassdoor Rating": c.get("glassdoorRating", 4.5),
        "Global Workforce": c.get("employeeCount") or c.get("employeeRange", ""),
        "Tech Stack": ", ".join(c.get("techStack", [])),
        "Verification Status": c.get("verificationStatus", "VERIFIED"),
        "Content Quality Score": c.get("contentQualityScore", 95),
      })

  print(f"Successfully exported {len(companies)} companies to Excel CSV: {csv_file_path}")

  # Also prepare native Excel XML Spreadsheet (.xml/.xls)
  excel_xml_path = os.path.join("workorajobs_companies_directory.xml")
  
  xml_rows = []
  for idx, c in enumerate(companies, start=1):
    tech_str = ", ".join(c.get("techStack", []))
    xml_rows.append(f"""   <Row>
    <Cell><Data ss:Type="Number">{idx}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('name', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('officialName') or c.get('legalName') or c.get('name', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('ticker', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('stockExchange', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('country', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('countryCode', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('headquarters', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('industry', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('subIndustry', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('ownershipType', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('publicPrivateStatus', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('startupStage', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('marketCap', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('website', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('careersUrl', '')}</Data></Cell>
    <Cell><Data ss:Type="Number">{c.get('glassdoorRating', 4.5)}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('employeeCount') or c.get('employeeRange', '')}</Data></Cell>
    <Cell><Data ss:Type="String">{tech_str}</Data></Cell>
    <Cell><Data ss:Type="String">{c.get('verificationStatus', 'VERIFIED')}</Data></Cell>
    <Cell><Data ss:Type="Number">{c.get('contentQualityScore', 95)}</Data></Cell>
   </Row>""")

  xml_content = f"""<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="WorkoraJobs Companies">
  <Table>
   <Row>
    <Cell><Data ss:Type="String">Rank</Data></Cell>
    <Cell><Data ss:Type="String">Company Name</Data></Cell>
    <Cell><Data ss:Type="String">Legal / Official Name</Data></Cell>
    <Cell><Data ss:Type="String">Ticker Symbol</Data></Cell>
    <Cell><Data ss:Type="String">Stock Exchange</Data></Cell>
    <Cell><Data ss:Type="String">Country</Data></Cell>
    <Cell><Data ss:Type="String">Country Code (ISO-2)</Data></Cell>
    <Cell><Data ss:Type="String">Headquarters</Data></Cell>
    <Cell><Data ss:Type="String">Industry</Data></Cell>
    <Cell><Data ss:Type="String">Sub-Industry</Data></Cell>
    <Cell><Data ss:Type="String">Ownership Type</Data></Cell>
    <Cell><Data ss:Type="String">Public / Private Status</Data></Cell>
    <Cell><Data ss:Type="String">Startup Stage</Data></Cell>
    <Cell><Data ss:Type="String">Market Capitalization</Data></Cell>
    <Cell><Data ss:Type="String">Official Website URL</Data></Cell>
    <Cell><Data ss:Type="String">Official Careers Portal URL</Data></Cell>
    <Cell><Data ss:Type="String">Glassdoor Rating</Data></Cell>
    <Cell><Data ss:Type="String">Global Workforce</Data></Cell>
    <Cell><Data ss:Type="String">Tech Stack</Data></Cell>
    <Cell><Data ss:Type="String">Verification Status</Data></Cell>
    <Cell><Data ss:Type="String">Content Quality Score</Data></Cell>
   </Row>
{"".join(xml_rows)}
  </Table>
 </Worksheet>
</Workbook>"""

  with open(excel_xml_path, "w", encoding="utf-8") as f:
    f.write(xml_content)

  print(f"Successfully exported native Excel XML workbook: {excel_xml_path}")

if __name__ == "__main__":
  main()
