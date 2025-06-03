/**
  
 * Appends "..." if the string is truncated.
 *
 * @param text  
 * @param wordLimit  
 * @returns  
 */
export const truncateStr = (text: string, wordLimit: number): string => {
  if (!text) {
    return ""; // - - - For null or undefined input
  }

  const words = text.split(/\s+/); // - - - Split by one or more whitespace characters
  if (words.length <= wordLimit) {
    return text; // - - - No truncation needed
  }

  const truncatedText = words.slice(0, wordLimit).join(" ");
  return `${truncatedText}...`;
};
