import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const urlParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value) {
      if (key === "search" || key === "query" || key === "keyword" || key === "keywords") {
        urlParams.set("q", value);
      } else {
        urlParams.set(key, value);
      }
    } else if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) urlParams.append(key, v);
      });
    }
  }

  const queryString = urlParams.toString();
  redirect(queryString ? `/jobs?${queryString}` : "/jobs");
}
