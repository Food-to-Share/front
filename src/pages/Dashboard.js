import Featured from '../components/featured/Featured';
import Chart from '../components/chart/Chart';
import Widget from '../components/widget/widget';
import './Dashboard.css';
import React from 'react';

function Dashboard() {
  return (
    <>
      <div className="p-7 flex-1 h-screen">
          <div className='widgets'>
            <Widget type="beneficiaries"/>
            <Widget type="order"/>
            <Widget type="earning"/>
          </div>
          <div className='charts'>
            <Featured/>
            <Chart/>
          </div>
      </div>
    </>
  );
}

export default Dashboard;