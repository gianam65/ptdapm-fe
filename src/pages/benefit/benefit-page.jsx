import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Popover  } from 'antd';
// import { Button } from 'antd/es/radio';
import  Button  from '../../components/common/button/button';
import './benfit-page.scss';
export default function BenefitPage() {
   const [dataSource, setdataSource] = useState([]);
   useEffect(()=>{
    const data = []
    for(let index = 0 ; index < 5; index++){
        data.push({
            key:`${index}`,
            name : `Name ${index}`,
            standard: ` Standard Leave ${index}`,
            type: ` Type ${index}`,
            status: ` Status ${index}`,
        });
    }
    setdataSource(data);
   }, [])

   const content = (
    <div className='benefit__action-menu'>
      <Button className={'benefit__button'}>Edit</Button>
      <Button className={'benefit__button'}>Mark as default</Button>
      <Button className={'benefit__button'}>Deactive</Button>
      <Button className={'benefit__button'}>Delete</Button>
    </div>
  );
   console.log(dataSource)
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            
        },
        {
            title: 'Standard Leave',
            dataIndex:"standard",
            key: 'standard'

        },
        {
            title: 'Type',
            dataIndex:"type",
            key: 'type'
        },
        {
            title: 'Status',
            dataIndex:"status",
            key: 'status',

        },
        {
            title: 'Actions',
            render: (_,record) =>{
                return(
                    <div className='benefit__action'>
                        <Popover placement="topLeft" content={content} trigger="click">
                            ...
                        </Popover>
                    </div>
                   
                )
            }
        },
    ]
    return (
        <div className='benefit__container'>
            <div className="benefit__top">
                <div className="benefit__top-left">
                    <div className="benefit__top-breadcrum">
                        Setting &gt; Benefit
                    </div>
                </div>
                <div className="benefit__top-right">
                    <div className="benefit__top-search">
                        <input className='benefit__top-search-input' placeholder='Search' type="text" />
                    </div>
                    <div className="benefit__top-modal">
                        <Button className="benefit__top-modal-btn">
                            Add Leave Benefit
                        </Button>
                    </div>
                </div>
            </div>
            <div className='benefit__center'>
                <Table
                columns = {columns}
                dataSource = {dataSource}
                >
                </Table>
            </div>
            <div className="benefit__bottom">
                Benefit bottom
            </div>
        </div>
    )
}
