import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportActions } from '../../actions/reportAction';

export default function ReportPage() {
    const dispatch = useDispatch()
    const report = useSelector(state => state.report.listReport)
    useEffect(() => {
        dispatch(reportActions.getReportRequest())
    }, [])

    
    const data = () => {
       return report.map((item, key) => {
            return <h1 key={key}>{item}</h1>
        })
    } 
    return (
        <div>
            {data()}
        </div>
    )
}
