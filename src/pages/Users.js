import React, { useState, useEffect } from 'react';
import { apiURL } from '../components/apiURL';
import { TokenContext } from '../components/context';
import Table, { SelectColumnFilter } from '../components/Table';
import './Dashboard.css';

function Users() {

    const tokenContext = React.useContext(TokenContext);

    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [emailState, setEmailState] = useState('');
    const [contactState, setContactState] = useState('');
    const [nameState, setNameState] = useState('');
    const [addressState, setAddressState] = useState('');

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

    const handleEmailChange = (event) => {
      setEmailState(event.target.value);
    }

    const handleContactChange = (event) => {
      setContactState(event.target.value);
    }

    const handleNameChange = (event) => {
        setNameState(event.target.value);
    }

    const handleAdressChange = (event) => {
      setAddressState(event.target.value);
    }

    const createUser = async() => {
      try {
            const requestOptions = {
              method: 'POST',
              body: JSON.stringify({username:'teste', name: nameState, email: emailState, contact: contactState, address: addressState, organization: "Help4You" }),
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenContext}`
              }
            }
          
            let response = await fetch(
              `${apiURL}/users/`, requestOptions
              );
            
            let json = await response.json();
      
            return json;
          } catch (error) {
            console.error(error);
          }
    }

    const handleSubmit = async (event) => {
      console.log("oi");
      event.preventDefault();
      const response = await createUser();

      setAddressState('');
      setEmailState('');
      setNameState('');
      setContactState('');
      setShowModal(false)
    }

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
        <button
          className="bg-sky-700 text-white active:bg-pink-500 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Add User
        </button>
        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Add User
                    </h3>
                  </div>

                  <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit}>
                      <div className="overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                          <div className="grid grid-cols-6 gap-6">
                          <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                placeholder='Email'
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                required
                                value={emailState}
                                onChange={handleEmailChange}
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                                Contact
                              </label>
                              <input
                                type="tel"
                                name="number"
                                id="number"
                                autoComplete="tel"
                                placeholder='Contact'
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                required
                                value={contactState}
                                onChange={handleContactChange}
                              />
                            </div>

                            <div className="col-span-6">
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="-name"
                                autoComplete="given-name"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                required
                                placeholder='Name'
                                value={nameState}
                                onChange={handleNameChange}
                              />
                            </div>

                            {/* <div className="col-span-6">
                              <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                Street address
                              </label>
                              <input
                                type="text"
                                name="street-address"
                                id="street-address"
                                autoComplete="street-address"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div> */}

                            <div className="col-span-6">
                              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                              </label>
                              <input
                                type="text"
                                name="address"
                                id="address"
                                autoComplete="street-address"
                                placeholder='Street'
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                required
                                value={addressState}
                                onChange={handleAdressChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => {
                            setAddressState('');
                            setEmailState('');
                            setNameState('');
                            setContactState('');
                            setShowModal(false)}}
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
        <div className='mt-4'>
          <Table columns={columns} data={users} />
        </div>
      </div>
    </>
  );
}

export default Users;