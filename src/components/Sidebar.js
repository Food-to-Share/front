import { useState, useContext } from 'react';

import { ChevronLeftIcon, ChevronRightIcon, ChartBarIcon, UsersIcon, CogIcon } from '@heroicons/react/solid'
import { LogoutIcon } from '@heroicons/react/outline'
import { AuthContext } from './context';
import { Link } from 'react-router-dom';

function Navbar() {
    const [open, setOpen] = useState(true);
    const [current, setCurrent] = useState(0);

    const { signOut } = useContext(AuthContext);

    const Menus = [
      { title: "Dashboard", icon: 1, to: "/" },
      { title: "Users", icon: 2, to: "/users" },
      { title: "Settings", icon: 3, gap: true, to: "/settings" },
    ];

    const logout = () => signOut();

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
              <Link key={index} onClick={()=>setCurrent(index)} to={`${Menu.to}`}>
                <li className={`flex rounded-md p-2 cursor-pointer hover:bg-sky-600 text-gray-300 text-sm items-center gap-x-4 duration-300 mb-auto
                  ${Menu.gap ? "mt-9" : "mt-2"} ${index===current && "bg-sky-600 scale-105"}`}
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
              </Link>
            ))}
          </ul>
          <ul className="pt-6 mt-auto">
            <Link key={100} to="/" onClick={()=>logout()}>
              <li className={`flex rounded-md p-2 cursor-pointer hover:bg-sky-600 mt-2 text-gray-300 text-sm items-center gap-x-4 duration-300`}
                  >
                <LogoutIcon className={`cursor-pointer w-6 text-white`} />
                <span className={`${!open && "hidden"} origin-left duration-200`}>
                    Logout
                </span>
              </li>
            </Link>
          </ul>
        </div>
      </>
    );
  }
  
  export default Navbar;