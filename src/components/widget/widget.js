import './widget.css';
import React from 'react';
import { ArrowUpIcon, BalanceIcon, FolderIcon, MoneyIcon, PersonOutlinedIcon } from '../Icons';

const Widget = ({ type }) => {

    let data;

    //temporary
    const amount = 100;
    const diff = 20;

    switch (type) {
        case "beneficiaries":
            data={
                title: "BENEFICIARIES",
                isMoney: false,
                link: "Ver todos os beneficiaries",
                icon:<PersonOutlinedIcon style={{color:"#CCCCC"}}/>,
            };
            break;
        case "order":
            data = {
                title: "MEALS",
                isMoney: false,
                link: "View all meals",
                icon: <FolderIcon/>,
            };
            break;
        case "earning":
            data={
                title: "EXPENSES",
                isMoney: true,
                link: "View net expenses",
                icon:<MoneyIcon/>,
            };
            break;
        default:
            break;
    }

    return (
        <div className="widget">
            <div className="left">
                <span className='title'>{data.title}</span>
                <span className='counter'>{data.isMoney && "$"}{amount}</span>
                <span className='link'>{data.link}</span>
            </div>
            <div className="right">
                <div className='percentage positive'>
                    <ArrowUpIcon/>
                    {diff} %
                </div>
                {data.icon}
            </div>
        </div>
    )
}

export default Widget