// removing duplicates from a list of strings
export function removeDuplicates(list) {
  return list.filter((item, index) => list.indexOf(item) === index);
}
