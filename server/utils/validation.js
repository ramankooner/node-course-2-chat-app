var isRealString = (str) => {
  // trim takes off the leading and trailing spaces
  return typeof str === 'string' && str.trim().length > 0;
};

module.exports = {isRealString};
