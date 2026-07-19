export function ThemeScript() {
  const code = `
    try {
      const stored = localStorage.getItem("workora-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (stored === "dark" || (!stored && prefersDark)) {
        document.documentElement.classList.add("dark");
      }
    } catch (_) {}
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
