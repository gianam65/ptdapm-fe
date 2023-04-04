import { useState, useEffect } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Button from '../../components/button/button';
import { httpGet, httpPost } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { useSetRecoilState } from 'recoil';
import { notification } from 'antd';
import { loadingState } from '../../recoil/store/app';
import './notification.scss';
function Notification() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [listEmployees, setListEmployees] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);

  useEffect(() => {
    fetchEmployees();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditorStateChange = newEditorState => {
    setEditorState(newEditorState);
  };

  const fetchEmployees = async () => {
    setPageLoading(true);
    const response = await httpGet(`${getAPIHostName()}/employees`);
    if (response?.data?.employeeList) {
      setListEmployees(response.data.employeeList);
    }
    setPageLoading(false);
  };

  const handleSubmit = async () => {
    const contentState = editorState.getCurrentContent();
    const { blocks } = convertToRaw(contentState);
    let mailContent = '';
    for (let i = 0; i < blocks.length; i++) {
      const contentText = blocks[i];

      mailContent += contentText.text + '<br/>';
    }

    if (!mailContent || mailContent === '<br/>') {
      notification.error({
        title: 'Thất bại',
        message: 'Vui lòng nhập nội dung thông báo'
      });
      return;
    }
    const emails = listEmployees.map(le => le.email);
    setPageLoading(true);
    const response = await httpPost(`${getAPIHostName()}/sendmail`, {
      content: mailContent,
      title: 'Đại học Thuỷ Lợi thông báo',
      email: JSON.stringify(emails)
    });
    setPageLoading(false);
    if (response?.success) {
      notification.success({
        title: 'Thành công',
        message: 'Thông báo đến toàn thể nhân viên thành công'
      });
    } else {
      notification.error({
        title: 'Thất bại',
        message: 'Thông báo đến toàn thể nhân viên thất bại'
      });
    }
  };

  return (
    <div className="notification__container">
      <h3>Gửi mail thông báo đến toàn thể nhân viên</h3>
      <Editor
        wrapperClassName="notification__edit"
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'image'],
          inline: {
            options: ['bold', 'italic', 'underline']
          },
          blockType: {
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote']
          },
          fontSize: {
            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96]
          }
        }}
      />
      <Button className="submit__edit-btn" onClick={handleSubmit}>
        Gửi
      </Button>
    </div>
  );
}

export default Notification;
