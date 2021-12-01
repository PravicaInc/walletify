export const truncateAddress = (
  fullStr: string | undefined,
  strLen: number,
) => {
  if (fullStr && fullStr.length <= strLen) {
    return fullStr;
  }
  const separator = '...';
  const sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr?.substring(0, frontChars) +
    separator +
    fullStr?.substring(fullStr.length - backChars)
  );
};
