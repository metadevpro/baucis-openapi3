//Module with custom functions

// A method for capitalizing the first letter of a string
function capitalize (s) {
  if (!s) { 
    return s; 
  }
  if (s.length === 1) {
    return s.toUpperCase();
  }
  return s[0].toUpperCase() + s.substring(1);
}

module.exports = {
		capitalize : capitalize
};