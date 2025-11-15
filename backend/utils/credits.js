let totalCredits = 500;

export const useCredits = (count) => {
  if (count > totalCredits) return false;
  totalCredits -= count;
  return true;
};

export const getCredits = () => totalCredits;
