/**
 * Downloads text content as a file using blob URL creation.
 *
 * @param content - Text content to download
 * @param filename - Name for the downloaded file
 */
export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

/**
 * Copies text to the clipboard using the Clipboard API.
 *
 * @param text - Text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Generates the download URL for a PDB file from RCSB PDB.
 *
 * @param pdbId - The PDB ID (e.g., "1AKI")
 * @returns The full download URL
 */
export function generatePDBDownloadUrl(pdbId: string): string {
  const cleanId = pdbId.trim().toUpperCase()
  return `https://files.rcsb.org/download/${cleanId}.pdb`
}

/**
 * Downloads a PDB file from RCSB PDB database.
 * Opens the download URL in a new window, triggering browser's download.
 *
 * @param pdbId - The PDB ID (e.g., "1AKI")
 * @returns true if the download was triggered, false if the PDB ID was invalid
 */
export function downloadPDBFile(pdbId: string): boolean {
  if (!pdbId || !pdbId.trim()) {
    console.error('Invalid PDB ID')
    return false
  }

  const url = generatePDBDownloadUrl(pdbId)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${pdbId.trim().toUpperCase()}.pdb`
  anchor.target = '_blank'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  return true
}
