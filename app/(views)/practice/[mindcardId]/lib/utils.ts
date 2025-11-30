/**
 * Extrai o nome do arquivo de uma URL
 * Remove o timestamp prefix adicionado pelo backend
 */
export function getFilenameFromUrl(url: string): string {
  try {
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];
    const cleanFilename = filename.replace(/^\d+-/, "");
    return decodeURIComponent(cleanFilename);
  } catch {
    return "documento.pdf";
  }
}
