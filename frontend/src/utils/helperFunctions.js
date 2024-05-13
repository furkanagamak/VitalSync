export const timeAgo = (date) => {
  const currentDate = new Date();
  const providedDate = new Date(date);

  const timeDifference = currentDate.getTime() - providedDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
};

export function calculateTimeUntilDate(targetDate) {
  // Get the current date and time
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const difference = targetDate.getTime() - currentDate.getTime();

  // Calculate the difference in days
  const differenceInDays = difference / (1000 * 3600 * 24);

  // If the difference is greater than a day, return the date
  if (differenceInDays > 1) {
    // Format the date as mm/dd/yy
    const formattedDate = `${
      targetDate.getMonth() + 1
    }/${targetDate.getDate()}/${targetDate.getFullYear() % 100}`;
    return formattedDate;
  }

  // If the difference is less than or equal to a day, calculate the time difference
  const differenceInSeconds = difference / 1000;
  const hours = Math.floor(differenceInSeconds / 3600);
  const minutes = Math.floor((differenceInSeconds % 3600) / 60);

  // Format the time until the date
  if (hours > 0) {
    if (minutes > 0) {
      return `in ${hours} hours and ${minutes} minutes`;
    } else {
      return `in ${hours} hour(s)`;
    }
  } 
  
  else if (minutes < 0 ) {
    return `Procedure In Progress`;
  }
  
  else {
    return `in ${minutes} minutes`;
  }
}

export function UTCToEastern(utcDateString) {
  const utcDate = new Date(utcDateString);

  // Extract date components
  const year = utcDate.getUTCFullYear();
  const month = utcDate.getUTCMonth();
  const day = utcDate.getUTCDate();
  const hours = utcDate.getUTCHours();
  const minutes = utcDate.getUTCMinutes();
  const seconds = utcDate.getUTCSeconds();

  // Create a new date object with the components in Eastern Time
  const easternDate = new Date(
    Date.UTC(year, month, day, hours, minutes, seconds)
  );
  const easternTimeString = easternDate.toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  return easternTimeString;
}
