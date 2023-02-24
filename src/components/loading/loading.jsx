import './loading.scss';
import { Spin } from 'antd';
import { useRecoilValue } from 'recoil';
import { loadingState } from '../../recoil/store/app';

const Loading = () => {
  const isPageLoading = useRecoilValue(loadingState);

  return isPageLoading ? (
    <div className="loading__container">
      <Spin size="large" />
    </div>
  ) : null;
};

export default Loading;
