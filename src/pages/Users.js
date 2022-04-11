import React, { useState, useEffect } from 'react';
import { apiURL } from '../components/apiURL';
import { TokenContext } from '../components/context';
import Table, { SelectColumnFilter } from '../components/Table';
import './Dashboard.css';

// const getOrganizationUsers = () => [
//   {
//     id: 1,
//     name: "Kévin Domingues",
//     address: "Rua casrwaseasfjns",
//     organization: "Food to Share"
//   },
//   {
//     id: 2,
//     name: "Bruno Pereira",
//     address: "Rua casrwaseasfjns",
//     organization: "Food to Share"
//   }
// ]

function Users() {

    const tokenContext = React.useContext(TokenContext);

    const [users, setUsers] = useState([]);

    const columns = React.useMemo(
      () => [
        {
          Header: "ID",
          accessor: "id"
        },
        {
          Header: "Name",
          accessor: "name"
        },
        {
          Header: "Email",
          accessor: "email"
        },
        {
          Header: "Address",
          accessor: "address"
        },
        {
          Header: "Organization",
          accessor: "organization",
          Filter: SelectColumnFilter,
          filter: "includes",
        },
      ], []
    )

  const getOrganizationUsers = async() => {
    try {
          const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenContext}`
            }
          }
          
          let response = await fetch(
            `${apiURL}/users/`, requestOptions
            );

          if(response.status === 200){
            let json = await response.json();
            
            setUsers(json);
            return;
          }
          
        } catch (error) {
          console.error(error);
        }
  }

  useEffect(() => {
    getOrganizationUsers();
  }, []);

  return (
    <>
      <div className="p-7 flex-1 h-screen">
        <h1 className="text-2xl font-semibold">
          Users
        </h1>
        <div className='mt-4'>
          <Table columns={columns} data={users} />
        </div>
      </div>
    </>
  );
}

export default Users;