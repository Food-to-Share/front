import React, { useState, useEffect } from 'react';
import { apiURL } from '../components/apiURL';
import { TokenContext } from '../components/context';
import './Dashboard.css';

function Users() {

  const { tokenContext } = React.useContext(TokenContext);

  const getOrganizationUsers = async() => {
    try {
          const requestOptions = {
            method: 'GET',
            hedares: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+tokenContext
            }
          }
        
          let response = await fetch(
            `${apiURL}/users`, requestOptions
            );
          
          let json = await response.json();
    
          console.log(json);
          setUsers(json);
          return json;
        } catch (error) {
          console.error(error);
        }
  }

  const [users, setUsers] = useState(getOrganizationUsers());

  return (
    <>
      <div className="p-7 flex-1 h-screen">
        <h1 className="text-2xl font-semibold">
        Users
        </h1>
      </div>
    </>
  );
}

export default Users;