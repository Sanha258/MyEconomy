export const getCurrentMonthValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getMonthStartDate = (date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const formatMonthLabel = (value) => {
  if (!value) return '';

  const [year, month] = value.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date
    .toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
    .replace(/^\w/, (character) => character.toUpperCase());
};

export const generateMonthOptions = ({ pastMonths, futureMonths }) => {
  const options = [];
  const now = new Date();

  for (let offset = -pastMonths; offset <= futureMonths; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    options.push({
      value,
      label: formatMonthLabel(value),
    });
  }

  return options;
};

export const normalizeAmount = (value) => {
  if (value.includes(',')) {
    return value.replace(/\./g, '').replace(',', '.');
  }

  return value;
};

export const parseAmountToApi = (value) => Number(normalizeAmount(value));

export const formatAmountToInput = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace('.', ',');
};

export const isValidAmount = (value) => {
  if (!value) return false;

  const normalizedValue = normalizeAmount(value);
  const parsedValue = Number(normalizedValue);

  return !Number.isNaN(parsedValue) && parsedValue > 0;
};

export const formatCurrency = (value) =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export const isPreviousMonth = (referenceMonth) => {
  const [year, month] = referenceMonth.split('-');
  const selectedDate = new Date(Number(year), Number(month) - 1, 1);
  const currentDate = getMonthStartDate(new Date());
  return selectedDate < currentDate;
};
