import UploadImage from './component/upload-image';

const EmployeesPage = () => {
  return (
    <div>
      <div className="employees__container">This is employees page</div>
      <UploadImage />
      <img
        alt=""
        style={{ height: 250 }}
        src="https://ptdapm-storage.s3.amazonaws.com/assest/image/0ebdd81f-ec77-4b11-89d6-7177ccc9edb5_1677229902488.jpeg"
      />
    </div>
  );
};

export default EmployeesPage;
