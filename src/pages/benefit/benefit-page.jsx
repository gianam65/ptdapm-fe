import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { Table, notification, Modal, Input, InputNumber, Select, Tooltip } from 'antd';
import Button from '../../components/button/button';
import './benefit-page.scss';
import { httpGet, httpDelete, httpPost, httpPut } from '../../services/request';
import { getAPIHostName, locale } from '../../utils';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { loadingState } from '../../recoil/store/app';
import CustomInput from '../../components/custom-input/custom-input';
import { accessTokenState } from '../../recoil/store/account';
import { ExclamationCircleFilled, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { removeTimeFromDate, checkIsEmpty } from '../../utils';

const { Search } = Input;
const BenefitPage = () => {
  const [benefitList, setBenefitList] = useState([]);
  const [openUpSertBenefit, setOpenUpSertBenefit] = useState(false);
  const [updateId, setUpdateId] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Kích hoạt');
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const setPageLoading = useSetRecoilState(loadingState);
  const accessToken = useRecoilValue(accessTokenState);
  const [selectedBenefit, setSelectedBenefit] = useState({});

  const benefitNameRef = useRef(null);
  const benefitDescriptionRef = useRef(null);
  const benefitStandardRef = useRef(null);
  const benefitMonthRef = useRef(null);

  const { Option } = Select;

  function handleChange(value) {
    setSelectedStatus(value);
  }

  function SelectComponent() {
    return (
      <Select defaultValue="Kích hoạt" onChange={handleChange}>
        <Option value="Kích hoạt">Kích hoạt</Option>
        <Option value="Chưa kích hoạt">Chưa kích hoạt</Option>
      </Select>
    );
  }
  useEffect(() => {
    const getBenefit = () => {
      const url = `${getAPIHostName()}/benefits`;

      setPageLoading(true);
      httpGet(url)
        .then(res => {
          if (res.success) {
            const { benefitList } = res.data;
            setBenefitList(benefitList);
          }
          setPageLoading(false);
        })
        .catch(() => {
          notification.error({
            title: 'Thất bại',
            message: 'Không thể lấy dữ liệu'
          });
          setPageLoading(false);
        });
    };
    getBenefit();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModalUpSertBenefit = item => {
    setSearchValue('');
    if (item) {
      setUpdateId(item._id);
      setSelectedBenefit(item);
    }
    setOpenUpSertBenefit(true);
  };

  const showConfirm = idDelete => {
    Modal.confirm({
      title: 'Bạn có muốn xoá quyền lợi này không?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        setIsLoadingTable(true);
        const url = `${getAPIHostName()}/benefits/${idDelete}`;
        httpDelete(url, accessToken)
          .then(res => {
            if (res.success) {
              setBenefitList(oldBenefitList => oldBenefitList.filter(benefit => benefit._id !== idDelete));
              notification.success({
                title: 'Thành công',
                message: 'Xóa quyền lợi thành công'
              });
            }
            setIsLoadingTable(false);
          })
          .catch(() => {
            notification.error({
              title: 'Lỗi',
              message: 'Xóa quyền lợi thất bại'
            });
            setIsLoadingTable(false);
          });
      },
      onCancel() {
        return;
      },
      cancelText: 'Hủy',
      okText: 'Xác nhận'
    });
  };
  const handleUpdateBenefit = idUpdate => {
    if (!idUpdate) return;
    const name = benefitNameRef.current.input.value;
    const description = benefitDescriptionRef.current.input.value;
    const standard = benefitStandardRef.current.value;
    const month = benefitMonthRef.current.value;
    const status = selectedStatus;
    if (
      checkIsEmpty(name) ||
      checkIsEmpty(description) ||
      checkIsEmpty(standard) ||
      checkIsEmpty(month) ||
      checkIsEmpty(status)
    ) {
      notification.error({
        title: 'Thất bại',
        message: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }
    const url = `${getAPIHostName()}/benefits/${idUpdate}`;
    httpPut(url, { name, description, standard, month, status }, accessToken)
      .then(res => {
        if (res.success) {
          setBenefitList(oldBenefitList => {
            const updateBenefitIdx = oldBenefitList.findIndex(item => item._id === idUpdate);
            oldBenefitList[updateBenefitIdx].name = name;
            oldBenefitList[updateBenefitIdx].description = description;
            oldBenefitList[updateBenefitIdx].standardLeave = standard;
            oldBenefitList[updateBenefitIdx].month = month;
            oldBenefitList[updateBenefitIdx].status = status;

            return oldBenefitList;
          });
          notification.success({
            title: 'Thành công',
            message: 'Cập nhật quyền lợi thành công'
          });
          setOpenUpSertBenefit(false);
        }
      })
      .catch(() => {
        notification.error({
          title: 'Lỗi',
          message: 'Cập nhật quyền lợi thất bại'
        });
        setOpenUpSertBenefit(false);
      });
  };
  const hanldeAddBenefit = () => {
    const name = benefitNameRef.current.input.value;
    const description = benefitDescriptionRef.current.input.value;
    const standardLeave = benefitStandardRef.current.value;
    const month = benefitMonthRef.current.value;
    const status = selectedStatus;
    if (
      checkIsEmpty(name) ||
      checkIsEmpty(description) ||
      checkIsEmpty(standardLeave) ||
      checkIsEmpty(month) ||
      checkIsEmpty(status)
    ) {
      notification.error({
        title: 'Thất bại',
        message: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }
    const url = `${getAPIHostName()}/benefits`;
    httpPost(url, { name, description, standardLeave, month, status }, accessToken)
      .then(res => {
        if (res.success) {
          setBenefitList(oldBenefitList => [res.data, ...oldBenefitList]);

          notification.success({
            title: 'Thành công',
            message: 'Thêm quyền lợi thành công'
          });
          setOpenUpSertBenefit(false);
        } else {
          notification.error({
            title: 'Thất bại',
            message: 'Thêm quyền lợi thất bại'
          });
        }
      })
      .catch(err => {
        notification.error({
          title: 'Thất bại',
          message: 'Thêm quyền lợi thất bại'
        });
        setOpenUpSertBenefit(false);
      });
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 220
    },
    {
      title: 'Miêu tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Tiêu chuẩn nghỉ',
      dataIndex: 'standardLeave',
      key: 'standardLeave'
    },
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: data => <span>{removeTimeFromDate(data)}</span>
    },
    {
      title: 'Hành động',
      fixed: 'right',
      render: (_, item) => {
        return (
          <div className="benefit__action">
            <div className="action__edit">
              <Tooltip title="Sửa">
                <EditOutlined onClick={() => openModalUpSertBenefit(item)} />
              </Tooltip>
            </div>
            <div
              className="action__delete"
              onClick={() => {
                showConfirm(item._id);
              }}
            >
              <Tooltip title="Xoá">
                <DeleteOutlined />
              </Tooltip>
            </div>
          </div>
        );
      }
    }
  ];

  const getDataSource = () => {
    let benefitData = benefitList.filter(item => !item.is_deleted);
    return benefitData.filter(item => item.name?.indexOf(searchValue) >= 0 || item.code?.indexOf(searchValue) >= 0);
  };

  return (
    <div className="benefit__container">
      <div className="benefit__top">
        <div className="benefit__top-right">
          <div className="benefit__top-search">
            <Search
              className="benefit__top-search-input"
              placeholder="Tìm kiếm"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
          <div className="benefit__top-modal">
            <Button
              onClick={() => openModalUpSertBenefit()}
              rightIcon={<PlusOutlined />}
              className="benefit__top-modal-btn"
            >
              Thêm quyền lợi
            </Button>
          </div>
        </div>
      </div>
      <div className="benefit__center">
        <Table
          columns={columns}
          loading={isLoadingTable}
          dataSource={getDataSource()}
          pagination={{ pageSize: 5 }}
          rowKey={record => record._id}
          scroll={{ y: 'calc(100vh - 320px)' }}
          locale={locale}
        ></Table>
        <Modal
          title=""
          open={openUpSertBenefit}
          onOk={() => {
            updateId ? handleUpdateBenefit(updateId) : hanldeAddBenefit();
          }}
          onCancel={() => {
            setSelectedBenefit({});
            setOpenUpSertBenefit(false);
            setUpdateId(null);
          }}
          okText={updateId ? 'Sửa' : 'Thêm'}
          cancelText="Huỷ"
        >
          <div className="benefit__modal-list">
            <div className="benefit__modal-left">
              <div id="benefit__modal-name" className="benefit__modal-item">
                <div className="benefit__modal-label">Tên quyền lợi:</div>
                <CustomInput
                  onChange={e => setSelectedBenefit({ ...selectedBenefit, name: e.target.value })}
                  value={selectedBenefit.name}
                  ref={benefitNameRef}
                  placeholder="Tên quyền lợi"
                />
              </div>
              <div id="benefit__modal-description" className="benefit__modal-item">
                <div className="benefit__modal-label">Mô tả:</div>
                <CustomInput
                  onChange={e => setSelectedBenefit({ ...selectedBenefit, description: e.target.value })}
                  value={selectedBenefit.description}
                  ref={benefitDescriptionRef}
                  placeholder="Nhập mô tả"
                />
              </div>
              <div id="benefit__modal-status" className="benefit__modal-item">
                <div className="benefit__modal-label">Trạng thái:</div>
                <SelectComponent />
              </div>
            </div>
            <div className="benefit__modal-right">
              <div id="benefit__modal-standard" className="benefit__modal-item">
                <div className="benefit__modal-label">Tiêu chuẩn:</div>
                <InputNumber
                  onChange={e => {
                    setSelectedBenefit({ ...selectedBenefit, standardLeave: e });
                  }}
                  value={selectedBenefit.standardLeave}
                  ref={benefitStandardRef}
                  style={{ width: 120 }}
                />
              </div>
              <div id="benefit__modal-month" className="benefit__modal-item">
                <div className="benefit__modal-label">Tháng:</div>
                <InputNumber
                  onChange={e => setSelectedBenefit({ ...selectedBenefit, month: e })}
                  value={selectedBenefit.month}
                  ref={benefitMonthRef}
                  style={{ width: 120 }}
                  min={1}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BenefitPage;
