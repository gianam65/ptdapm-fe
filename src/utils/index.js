export const getAPIHostName = () => {
  return process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_BASE_URL}/api/v1`
    : 'http://localhost:8001/api/v1';
};
