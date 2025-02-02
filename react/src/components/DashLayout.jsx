import React from 'react'
import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFootert from './DashFootert'

const DashLayout = () => {
    return (
        <>
            <DashHeader />
            <div className='dash-container'>
                <Outlet />
                <DashFootert/>
            </div>

        </>
    )
}

export default DashLayout