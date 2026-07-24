# -*- coding: utf-8 -*-
import csv
import json
import os

inr_companies = [
  {
    "rank": 1,
    "name": "Reliance Industries",
    "officialName": "Reliance Industries Limited",
    "ticker": "RELIANCE.NS",
    "stockExchange": "NSE / BSE",
    "marketCapINR": "₹20,50,000 Crore (₹20.5 Trillion)",
    "country": "India",
    "iso2": "IN",
    "headquarters": "Mumbai, Maharashtra, India",
    "industry": "Media & Technology",
    "subIndustry": "Telecommunications & Energy Conglomerate",
    "website": "https://www.ril.com",
    "careersUrl": "https://careers.jio.com",
    "glassdoorRating": 4.1,
    "employeeCount": "389,000+",
    "techStack": "5G Cloud Core, Python, Java, Go, Kubernetes"
  },
  {
    "rank": 2,
    "name": "Tata Consultancy Services",
    "officialName": "Tata Consultancy Services Limited",
    "ticker": "TCS.NS",
    "stockExchange": "NSE / BSE",
    "marketCapINR": "₹14,20,000 Crore (₹14.2 Trillion)",
    "country": "India",
    "iso2": "IN",
    "headquarters": "Mumbai, Maharashtra, India",
    "industry": "Information Technology",
    "subIndustry": "IT Services & Enterprise Consulting",
    "website": "https://www.tcs.com",
    "careersUrl": "https://www.tcs.com/careers",
    "glassdoorRating": 3.9,
    "employeeCount": "601,000+",
    "techStack": "Java, Python, Cloud Migration, SAP S/4HANA, Azure"
  },
  {
    "rank": 3,
    "name": "HDFC Bank",
    "officialName": "HDFC Bank Limited",
    "ticker": "HDFCBANK.NS",
    "stockExchange": "NSE / BSE / NYSE",
    "marketCapINR": "₹12,80,000 Crore (₹12.8 Trillion)",
    "country": "India",
    "iso2": "IN",
    "headquarters": "Mumbai, Maharashtra, India",
    "industry": "Banking & Financial Services",
    "subIndustry": "Private Sector Commercial Banking",
    "website": "https://www.hdfcbank.com",
    "careersUrl": "https://www.hdfcbank.com/personal/careers",
    "glassdoorRating": 4.0,
    "employeeCount": "177,000+",
    "techStack": "Java, Spring Boot, Oracle, Android, iOS"
  },
  {
    "rank": 4,
    "name": "Bharti Airtel",
    "officialName": "Bharti Airtel Limited",
    "ticker": "BHARTIARTL.NS",
    "stockExchange": "NSE / BSE",
    "marketCapINR": "₹9,80,000 Crore (₹9.8 Trillion)",
    "country": "India",
    "iso2": "IN",
    "headquarters": "New Delhi, Delhi, India",
    "industry": "Media & Technology",
    "subIndustry": "5G Telecom & Digital Services",
    "website": "https://www.airtel.in",
    "careersUrl": "https://www.airtel.in/careers",
    "glassdoorRating": 4.0,
    "employeeCount": "68,000+",
    "techStack": "5G Core, Java, Kafka, React, Python"
  },
  {
    "rank": 5,
    "name": "ICICI Bank",
    "officialName": "ICICI Bank Limited",
    "ticker": "ICICIBANK.NS",
    "stockExchange": "NSE / BSE / NYSE",
    "marketCapINR": "₹8,40,000 Crore (₹8.4 Trillion)",
    "country": "India",
    "iso2": "IN",
    "headquarters": "Mumbai, Maharashtra, India",
    "industry": "Banking & Financial Services",
    "subIndustry": "Private Banking & iMobile Pay Platform",
    "website": "https://www.icicibank.com",
    "careersUrl": "https://www.icicicareers.com",
    "glassdoorRating": 4.0,
    "employeeCount": "130,000+",
    "techStack": "Java, Microservices, Oracle, Python"
  },
  {
    "rank": 6,
    "name": "State Bank of India",
    "officialName": "State Bank of India",
    "ticker": "SBIN.NS",
    "stockExchange": "NSE / BSE",
    "marketCapINR": "₹7,60,000 Crore (₹7.6 Trillion)",
    "country": "India",
    "iso2": "IN",
    "headquarters": "Mumbai, Maharashtra, India",
    "industry": "Banking & Financial Services",
    "subIndustry": "Public Sector Banking & YONO App",
    "website": "https://www.sbi.co.in",
    "careersUrl": "https://bank.sbi/web/careers",
    "glassdoorRating": 3.9,
    "employeeCount": "232,000+",
    "techStack": "Java, Oracle, YONO Mobile SDK, Linux"
  },
  {
    "rank": 7,
    "name": "Infosys",
    "officialName": "Infosys Limited",
    "ticker": "INFY.NS",
    "stockExchange": "NSE / BSE / NYSE",
    "marketCapINR": "₹7,20,000 Crore (₹7.2 Trillion)",
    "country": "India",
    "iso2": "IN",
    "headquarters": "Bengaluru, Karnataka, India",
    "industry": "Information Technology",
    "subIndustry": "Software Services & AI Automation",
    "website": "https://www.infosys.com",
    "careersUrl": "https://www.infosys.com/careers",
    "glassdoorRating": 3.8,
    "employeeCount": "317,000+",
    "techStack": "Java, Python, Azure, Topaz AI, React"
  },
  {
    "rank": 8,
    "name": "LIC of India",
    "officialName": "Life Insurance Corporation of India",
    "ticker": "LICI.NS",
    "stockExchange": "NSE / BSE",
    "marketCapINR": "₹5,60,000 Crore (₹5.6 Trillion)",
    "country": "India",
    "iso2": "IN",
    "headquarters": "Mumbai, Maharashtra, India",
    "industry": "Banking & Financial Services",
    "subIndustry": "Life Insurance & Asset Management",
    "website": "https://licindia.in",
    "careersUrl": "https://licindia.in/bottomlink/careers",
    "glassdoorRating": 4.1,
    "employeeCount": "105,000+",
    "techStack": "Java, Oracle, Enterprise Security"
  },
  {
    "rank": 9,
    "name": "Larsen & Toubro",
    "officialName": "Larsen & Toubro Limited",
    "ticker": "LT.NS",
    "stockExchange": "NSE / BSE",
    "marketCapINR": "₹4,80,000 Crore (₹4.8 Trillion)",
    "country": "India",
    "iso2": "IN",
    "headquarters": "Mumbai, Maharashtra, India",
    "industry": "Information Technology",
    "subIndustry": "EPC Engineering & High-Tech Services",
    "website": "https://www.larsentoubro.com",
    "careersUrl": "https://www.larsentoubro.com/careers",
    "glassdoorRating": 4.1,
    "employeeCount": "135,000+",
    "techStack": "CAD, Primavera, Java, SAP S/4HANA"
  },
  {
    "rank": 10,
    "name": "Apple",
    "officialName": "Apple Inc.",
    "ticker": "AAPL",
    "stockExchange": "NASDAQ",
    "marketCapINR": "₹2,85,00,000 Crore (₹285 Trillion)",
    "country": "United States",
    "iso2": "US",
    "headquarters": "Cupertino, CA, USA",
    "industry": "Information Technology",
    "subIndustry": "Consumer Electronics & OS",
    "website": "https://www.apple.com",
    "careersUrl": "https://www.apple.com/careers/us",
    "glassdoorRating": 4.5,
    "employeeCount": "161,000+",
    "techStack": "Swift, Metal, CoreML, C++, Python"
  },
  {
    "rank": 11,
    "name": "Microsoft",
    "officialName": "Microsoft Corporation",
    "ticker": "MSFT",
    "stockExchange": "NASDAQ",
    "marketCapINR": "₹2,60,00,000 Crore (₹260 Trillion)",
    "country": "United States",
    "iso2": "US",
    "headquarters": "Redmond, WA, USA",
    "industry": "Information Technology",
    "subIndustry": "Cloud Platforms & Enterprise Software",
    "website": "https://www.microsoft.com",
    "careersUrl": "https://careers.microsoft.com",
    "glassdoorRating": 4.4,
    "employeeCount": "221,000+",
    "techStack": "C#, .NET Core, TypeScript, Azure"
  },
  {
    "rank": 12,
    "name": "NVIDIA",
    "officialName": "NVIDIA Corporation",
    "ticker": "NVDA",
    "stockExchange": "NASDAQ",
    "marketCapINR": "₹2,55,00,000 Crore (₹255 Trillion)",
    "country": "United States",
    "iso2": "US",
    "headquarters": "Santa Clara, CA, USA",
    "industry": "Semiconductors",
    "subIndustry": "GPU Hardware & Accelerated AI Systems",
    "website": "https://www.nvidia.com",
    "careersUrl": "https://www.nvidia.com/en-us/about-nvidia/careers",
    "glassdoorRating": 4.7,
    "employeeCount": "29,600+",
    "techStack": "CUDA, C++, Python, TensorRT"
  }
]

# Export 1: CSV for Excel
csv_path = "companiesmarketcap_inr_companies.csv"
fieldnames = [
  "Rank", "Company Name", "Legal / Official Name", "Ticker Symbol", "Stock Exchange",
  "Market Cap (INR ₹)", "Country", "Country Code (ISO-2)", "Headquarters", "Industry",
  "Sub-Industry", "Official Website URL", "Official Careers Portal URL", "Glassdoor Rating",
  "Workforce Count", "Tech Stack"
]

with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
  writer = csv.DictWriter(f, fieldnames=fieldnames)
  writer.writeheader()
  for c in inr_companies:
    writer.writerow({
      "Rank": c["rank"],
      "Company Name": c["name"],
      "Legal / Official Name": c["officialName"],
      "Ticker Symbol": c["ticker"],
      "Stock Exchange": c["stockExchange"],
      "Market Cap (INR ₹)": c["marketCapINR"],
      "Country": c["country"],
      "Country Code (ISO-2)": c["iso2"],
      "Headquarters": c["headquarters"],
      "Industry": c["industry"],
      "Sub-Industry": c["subIndustry"],
      "Official Website URL": c["website"],
      "Official Careers Portal URL": c["careersUrl"],
      "Glassdoor Rating": c["glassdoorRating"],
      "Workforce Count": c["employeeCount"],
      "Tech Stack": c["techStack"]
    })

print(f"Successfully generated CSV spreadsheet with INR Market Cap: {csv_path}")

# Export 2: Native XML Excel Workbook
xml_path = "companiesmarketcap_inr_companies.xml"
rows_xml = []
for c in inr_companies:
  rows_xml.append(f"""   <Row>
    <Cell><Data ss:Type="Number">{c['rank']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['name']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['officialName']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['ticker']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['stockExchange']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['marketCapINR']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['country']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['iso2']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['headquarters']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['industry']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['subIndustry']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['website']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['careersUrl']}</Data></Cell>
    <Cell><Data ss:Type="Number">{c['glassdoorRating']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['employeeCount']}</Data></Cell>
    <Cell><Data ss:Type="String">{c['techStack']}</Data></Cell>
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
    <Cell><Data ss:Type="String">Legal / Official Name</Data></Cell>
    <Cell><Data ss:Type="String">Ticker Symbol</Data></Cell>
    <Cell><Data ss:Type="String">Stock Exchange</Data></Cell>
    <Cell><Data ss:Type="String">Market Cap (INR ₹)</Data></Cell>
    <Cell><Data ss:Type="String">Country</Data></Cell>
    <Cell><Data ss:Type="String">Country Code (ISO-2)</Data></Cell>
    <Cell><Data ss:Type="String">Headquarters</Data></Cell>
    <Cell><Data ss:Type="String">Industry</Data></Cell>
    <Cell><Data ss:Type="String">Sub-Industry</Data></Cell>
    <Cell><Data ss:Type="String">Official Website URL</Data></Cell>
    <Cell><Data ss:Type="String">Official Careers Portal URL</Data></Cell>
    <Cell><Data ss:Type="String">Glassdoor Rating</Data></Cell>
    <Cell><Data ss:Type="String">Workforce Count</Data></Cell>
    <Cell><Data ss:Type="String">Tech Stack</Data></Cell>
   </Row>
{"".join(rows_xml)}
  </Table>
 </Worksheet>
</Workbook>"""

with open(xml_path, "w", encoding="utf-8") as f:
  f.write(xml_content)

print(f"Successfully generated Native Excel XML workbook with INR Market Cap: {xml_path}")
