import defaultAvatar from '../assets/images/default_avatar.jpg';

export const getAPIHostName = () => {
  return 'http://localhost:8001/api/v1';
  // return 'http://manhpham.site:8001/api/v1';
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

export const removeTimeFromDate = timeStamp => {
  return timeStamp?.split('T')[0] || timeStamp;
};

export const fileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const blobToFile = (theBlob, fileName) => {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};

export const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const translateStatus = status => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'Làm việc tại trường';
    case 'inActive':
      return 'Đã nghỉ việc';
    case 'onBoarding':
      return 'Đi công tác';
    default:
      return 'Làm việc tại trường';
  }
};
