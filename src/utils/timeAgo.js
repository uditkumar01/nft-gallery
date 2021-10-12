// function to calculate different between two dates in time ago format
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const nth = function (d) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export function timeAgo(date) {
  console.log(date);
  const parsedDate = new Date(date);
  let seconds = Math.abs(Math.floor((new Date() - parsedDate) / 1000));

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${parsedDate.getDate()}${nth(parsedDate.getDate())} ${
      monthNames[parsedDate.getMonth()]
    } ${parsedDate.getFullYear()}`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${parsedDate.getDate()}${nth(parsedDate.getDate())} ${
      monthNames[parsedDate.getMonth()]
    }`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
  const secondsAgo = Math.floor(seconds) + "s";
  return secondsAgo === "0s" ? "now" : secondsAgo;
}
