import defaultAvatar from '../assets/images/default_avatar.jpg';

export const getAPIHostName = () => {
  // return 'http://localhost:8001/api/v1';
  return 'http://manhpham.site:8001/api/v1';
};

export const normalizeDate = date => {
  return date?.split('T')[0].split('-').join('/') || 'Unknow date';
};

export const getPriorityRole = roles => {
  return roles?.includes('Admin') ? 'Admin' : 'HR';
};

export const fallbackToDefaultAvatar = avatarUrl => {
  return avatarUrl ? avatarUrl : defaultAvatar;
};
