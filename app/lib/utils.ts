/** Derive `https://github.com/owner/repo` from a `raw.githubusercontent.com/.../README.md` URL. */
export function repoUrlFromRawReadmeUrl(rawReadmeUrl: string): string | null {
  try {
    const u = new URL(rawReadmeUrl);
    if (!u.hostname.includes("raw.githubusercontent.com")) {
      return null;
    }
    const parts = u.pathname.split("/").filter(Boolean);
    const owner = parts[0];
    const repo = parts[1];
    if (!owner || !repo) {
      return null;
    }
    return `https://github.com/${owner}/${repo}`;
  } catch {
    return null;
  }
}

// Global copy to clipboard function
export const copyToClipboard = async (textToCopy: string | string[]) => {
  try {
    const textString = Array.isArray(textToCopy) ? textToCopy.join("\n") : textToCopy;
    await navigator.clipboard.writeText(textString);
    return true;
  } catch {
    // Fallback for older browsers
    const textString = Array.isArray(textToCopy) ? textToCopy.join("\n") : textToCopy;
    const textArea = document.createElement("textarea");
    textArea.value = textString;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  }
};
