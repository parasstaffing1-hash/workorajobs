"use client";

import { ReferenceSearchBar } from "@/components/search/reference-search-bar";

export function AnimatedSearchBar() {
  return (
    <div className="w-full flex flex-col items-center">
      <ReferenceSearchBar
        examples={[
          "Search software engineering jobs",
          "Find remote jobs at Google",
          "Explore companies hiring now",
          "Search jobs by title or location",
        ]}
        loop={false}
        autoPlay={true}
        enableInteractiveSearch={true}
        background="transparent"
      />
    </div>
  );
}
