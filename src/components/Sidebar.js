import { useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon, ChartBarIcon, UsersIcon, CogIcon } from '@heroicons/react/solid'

function Navbar() {
    const [open, setOpen] = useState(true);
    const [current, setCurrent] = useState(0);

    const Menus = [
      { title: "Dashboard", icon: 1 },
      { title: "Users", icon: 2 },
      { title: "Settings", icon: 3, gap: true }
    ];

    return (
      <>
        <div className={`${open ? "w-72" : "w-20" } h-screen bg-sky-900 p-5 pt-8 relative duration-300`}>
          {open ? 
            <ChevronLeftIcon className={`absolute cursor-pointer -right-3 top-9 w-7 border-sky-900 bg-white text-sky-900
            border-2 rounded-full`} onClick={() => setOpen(!open)}/> 
            :
            <ChevronRightIcon className={`absolute cursor-pointer -right-3 top-9 w-7 border-sky-900 bg-white text-sky-900
            border-2 rounded-full`} onClick={() => setOpen(!open)}/>
          }
          <div className={`flex gap-x-4 items-center`}>
            <img src="./logo512.png" className="cursor-pointer duration-500 w-10"/>
            <h1 className={`text-white origin-left font-medium text-xl
              ${!open && "hidden"}`}>
                Food to Share
            </h1>
          </div>
          <ul className="pt-6">
            {Menus.map((Menu, index) => (
              <li key={index}
                className={`flex rounded-md p-2 cursor-pointer hover:bg-sky-600 text-gray-300 text-sm items-center gap-x-4 duration-300
                ${Menu.gap ? "mt-9" : "mt-2"} ${index===current && "bg-sky-600 scale-105"}`}
                onClick={()=>setCurrent(index)}
              >
                {Menu.icon === 1 ? 
                  <ChartBarIcon className={`cursor-pointer w-6 text-white`} /> 
                    :
                  Menu.icon === 2 ?
                  <UsersIcon className={`cursor-pointer w-6 text-white`} />
                    :
                  <CogIcon className={`cursor-pointer w-6 text-white`} />
                }
                <span className={`${!open && "hidden"} origin-left duration-200`}>
                  {Menu.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }
  
  export default Navbar;