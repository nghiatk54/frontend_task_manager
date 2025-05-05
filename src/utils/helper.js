const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
const addThousandSeparator = (number) => {
  if (number == null || isNaN(number)) return "";
  const [integerPart, factionalPart] = number.toString().split(".");
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  return factionalPart
    ? `${formattedIntegerPart}.${factionalPart}`
    : formattedIntegerPart;
};

export { validateEmail, addThousandSeparator };
