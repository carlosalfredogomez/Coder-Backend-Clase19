
const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const id = `${timestamp}${random}`;
  return id
};

module.exports = generateId