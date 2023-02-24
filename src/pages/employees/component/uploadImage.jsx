import { uploadImage } from '../../../config/aws';
import { useState } from 'react';
const UploadImage = () => {
  const [imageUrl, setImageUrl] = useState(null);

  const onFileInput = async e => {
    const timestamp = new Date().getTime();
    const file = e.target.files[0];
    const filename =
      file.name
        .split('.')[0]
        .replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')
        .toLowerCase() + `_${timestamp}`;
    const fileExtension = file.name.split('.').pop();

    const publicUrl = await uploadImage(`${filename}.${fileExtension}`, file);
    setImageUrl(publicUrl);
  };

  return (
    <div className="home__container">
      {imageUrl && <img src={imageUrl} alt="" />}
      <input type="file" id="file_input" onChange={onFileInput} />
    </div>
  );
};

export default UploadImage;
