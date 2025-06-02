/**
 * Formats a date into "Month DD, YYYY" format
 * @param {Date} [date=new Date()] - The date to format (defaults to current date)
 * @returns {string} The formatted date string
 */
export default function formatDate(date: Date = new Date()): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}
