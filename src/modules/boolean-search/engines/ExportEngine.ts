export class ExportEngine {
  /**
   * Triggers a browser file download of text content with the specified mimeType.
   */
  public downloadFile(filename: string, content: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Exports the search query parameters and generated query to JSON file.
   */
  public exportToJSON(filename: string, data: Record<string, any>) {
    const content = JSON.stringify(data, null, 2);
    this.downloadFile(`${filename}.json`, content, 'application/json');
  }

  /**
   * Exports the query and platform info to a simple .txt file.
   */
  public exportToTXT(filename: string, query: string, platform: string, details: string) {
    const content = `WORKORA BOOLEAN SEARCH GENERATOR 2.0\n=========================================\nPlatform: ${platform}\nDate: ${new Date().toLocaleDateString()}\nDetails: ${details}\n\nGENERATED STRING:\n-----------------------------------------\n${query}\n\n=========================================`;
    this.downloadFile(`${filename}.txt`, content, 'text/plain');
  }

  /**
   * Exports an array of search history items or details to a CSV.
   */
  public exportToCSV(filename: string, headers: string[], rows: string[][]) {
    const escapeCSV = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    this.downloadFile(`${filename}.csv`, csvContent, 'text/csv;charset=utf-8;');
  }

  /**
   * Copies text to the user clipboard.
   */
  public async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch {
        document.body.removeChild(textarea);
        return false;
      }
    }
  }

  /**
   * Formats the query with indentation and logical linebreaks for presentation readability.
   */
  public formatBooleanQuery(query: string): string {
    let formatted = query;
    // Format OR groups to be multiline if long
    formatted = formatted.replace(/\s+AND\s+/g, '\n  AND ');
    formatted = formatted.replace(/\s+NOT\s+/g, '\n  NOT ');
    return formatted;
  }
}

export const exportEngine = new ExportEngine();
export default exportEngine;
