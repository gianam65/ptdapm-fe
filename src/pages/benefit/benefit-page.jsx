import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { Table, Popover, notification, Modal, Input, InputNumber, Select, } from 'antd';
import Button from '../../components/button/button';
import './benefit-page.scss';
import { httpGet, httpDelete, httpPost, httpPut } from '../../services/request';
import { getAPIHostName } from '../../utils';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { loadingState } from '../../recoil/store/app';
import CustomInput from '../../components/custom-input/custom-input';
import { accessTokenState } from '../../recoil/store/account';
import { PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';

const { Search } = Input;
const BenefitPage = () => {
  const [benefitList, setBenefitList] = useState([]);
  const setPageLoading = useSetRecoilState(loadingState);
  const [updateId, setUpdateId] = useState();
  const [openUpSertBenefit, setOpenUpSertBenefit] = useState(false);
  const benefitNameRef = useRef(null);
  const benefitDescriptionRef = useRef(null);
  const benefitStandardRef = useRef(null);
  const benefitMonthRef = useRef(null);
  const benefitStatusRef = useRef(null);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const accessToken = useRecoilValue(accessTokenState);
  const [searchValue, setSearchValue] = useState('');

  // console.log(accessToken)
  const { Option } = Select;
  function handleChange(value) {
    // console.log(`Selected ${value}`);
  }
  function SelectComponent() {
    return (
      <Select ref={benefitStatusRef} defaultValue="Active" style={{ width: 120 }} onChange={handleChange}>
        <Option value="Active">Active</Option>
        <Option value="Unactive">Unactive</Option>
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
            title: 'Error',
            message: 'Can not get benefit data'
          });
          setPageLoading(false);
        });
    };
    getBenefit();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModalUpSertBenefit = id => {
    setUpdateId(id);
    setOpenUpSertBenefit(true);
  };
  const showConfirm = (iDelete) => {
    Modal.confirm({
      title: 'Do you want to delete this department?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        setIsLoadingTable(true)
        const url = `${getAPIHostName()}/benefits/${iDelete}`;
        console.log(url);
        httpDelete(url, accessToken)
          .then(res => {
            if (res.success) {
              setBenefitList(oldBenefitList => oldBenefitList.filter(benefit => benefit._id != iDelete))
              notification.success({
                title: 'Success',
                message: res.message || 'Delete deparment success'
              });
            }
            setIsLoadingTable(false)
          })
          .catch(() => {
            notification.error({
              title: 'Error',
              message: 'Delete deparment failed'
            });
            setIsLoadingTable(false);
          })
      },
      onCancel() {
        return;
      }
    })
  }
  const handleUpdateBenefit = id => {
    const name = benefitNameRef.current.input.value;
    const description = benefitDescriptionRef.current.input.value;
    const standard = benefitStandardRef.current.value;
    const month = benefitMonthRef.current.value;
    const status = benefitStatusRef.current;
    console.log('status', status)
  };
  const content = (id) => {
    return (
      <div className="benefit__action-menu">
        <Button className={'benefit__button'} onClick={() => openModalUpSertBenefit(id)}>
          Edit
        </Button>
        <Button className={'benefit__button'} onClick={() => showConfirm(id)}>
          Delete
        </Button>
      </div>
    )
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Standard Leave',
      dataIndex: 'standardLeave',
      key: 'standardLeave'
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Actions',
      render: (_, item) => {
        return (
          <div className="benefit__action">
            <Popover placement="topLeft" content={content(item._id)} trigger="click" onClick={() => {

            }}>
              ...
            </Popover>
          </div>
        );
      }
    }
  ];
  const getDataSource = () => {
    const benefitData = benefitList.filter(item => item.is_deleted === false)
    return benefitData.filter(
      item => item.name?.indexOf(searchValue) >= 0 || item.code?.indexOf(searchValue) >= 0
    )
  };

  return (
    <div className="benefit__container">
      <div className="benefit__top">
        <div className="benefit__top-left">
          <div className="benefit__top-breadcrum">Setting &gt; Benefit</div>
        </div>
        <div className="benefit__top-right">
          <div className="benefit__top-search">
            <Search
              className="benefit__top-search-input"
              placeholder="Type here to search"
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
          <div className="benefit__top-modal">
            <Button onClick={() => openModalUpSertBenefit()} className="benefit__top-modal-btn">
              Add Leave Benefit
            </Button>
          </div>
        </div>
      </div>
      <div className="benefit__center">
        <Table columns={columns} dataSource={getDataSource()} pagination={false} rowKey={record => record._id}></Table>
        <Modal
          title="Add benefit"
          open={openUpSertBenefit}
          onOk={() => {
            updateId ? handleUpdateBenefit(updateId) : console.log(2);
          }}
          onCancel={() => setOpenUpSertBenefit(false)}
          okText="Edit"
        >
          <div className="benefit__modal-list">
            <div className="benefit__modal-left">
              <div id="benefit__modal-name" className="benefit__modal-item">
                <div className="benefit__modal-label">Name:</div>
                <CustomInput ref={benefitNameRef} placeholder="" />
              </div>
              <div id="benefit__modal-description" className="benefit__modal-item">
                <div className="benefit__modal-label">Description:</div>
                <CustomInput ref={benefitDescriptionRef} placeholder="Enter description" />
              </div>
            </div>
            <div className="benefit__modal-right">
              <div id="benefit__modal-standard" className="benefit__modal-item">
                <div className="benefit__modal-label">Standard Leave:</div>
                <InputNumber ref={benefitStandardRef} style={{ width: 120 }} defaultValue={0} />
              </div>
              <div id="benefit__modal-month" className="benefit__modal-item">
                <div className="benefit__modal-label">Month:</div>
                <InputNumber ref={benefitMonthRef} style={{ width: 120 }} min={1} defaultValue={1} />
              </div>
              <div id="benefit__modal-status" className="benefit__modal-item">
                <div className="benefit__modal-label">Status:</div>
                <SelectComponent />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BenefitPage;
