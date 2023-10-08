export default function formatDate(date: Date, includeTime = false): string {
  return includeTime
    ? `${date.getFullYear()}. ${
        date.getMonth() + 1
      }. ${date.getDate()}. ${date.getHours()}:${date.getMinutes()}`
    : `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}
