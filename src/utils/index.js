export const getAPIHostName = () => {
  return process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_BASE_URL}/api/v1`
    : 'http://manhpham.site:8001/api/v1';
};
