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

export function formatDateTime(dateString) {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "long", // "June"
    day: "2-digit", // "06"
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Using Intl.DateTimeFormat to handle AM/PM and localization
  const formattedParts = new Intl.DateTimeFormat(
    "en-US",
    options
  ).formatToParts(date);

  const month = formattedParts.find((part) => part.type === "month")?.value;
  const day = formattedParts.find((part) => part.type === "day")?.value;
  const year = formattedParts.find((part) => part.type === "year")?.value;
  const hour = formattedParts.find((part) => part.type === "hour")?.value;
  const minute = formattedParts.find((part) => part.type === "minute")?.value;
  const dayPeriod = formattedParts.find(
    (part) => part.type === "dayPeriod"
  )?.value;

  return `${month} ${day}, ${year} ${hour}:${minute} ${dayPeriod}`;
}
