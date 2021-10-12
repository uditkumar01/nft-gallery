// function to convert a string with underscores to normal string with spaces
export function removeUnderscores(str) {
  const queryStr = str.replace(/_/g, " ");
  return queryStr.charAt(0).toUpperCase() + queryStr.slice(1);
}
