// function to capitalized first name of user
export const formatName = (name) => {
  const nameArray = name.split(" ");
  return nameArray[0].charAt(0).toUpperCase() + nameArray[0].slice(1);
};

export const formatFullName = (name) => {
  const nameArray = name.split(" ")?.map(formatName);
  return nameArray.join(" ");
};

export const makeUsernameFromEmail = (email) => {
  if (!email || typeof email !== "string") return "";
  const emailArray = email?.split("@");
  return emailArray[0].toLowerCase();
};
