import React, { useState, useEffect } from 'react';
import { apiURL } from '../components/apiURL';
import { TokenContext } from '../components/context';
import Table, { SelectColumnFilter } from '../components/Table';
import { Loader } from '../components/Loader'

function Users() {

    const tokenContext = React.useContext(TokenContext);

    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [emailState, setEmailState] = useState('');
    const [contactState, setContactState] = useState('');
    const [nameState, setNameState] = useState('');
    const [addressState, setAddressState] = useState('');
    const [createError, setCreateError] = useState('');

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
        {
          Header: "Options"
        }
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

    const handleAddressChange = (event) => {
      setAddressState(event.target.value);
    }

    const createUser = async() => {
      try {
            const requestOptions = {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenContext}`
              },
              body: JSON.stringify({username:'teste', name: nameState, email: emailState, contact: parseInt(contactState), address: addressState, organization: "Help4You" }),
            }
          
            const response = await fetch(
              `${apiURL}/users/`, requestOptions
              );
            
            if(response.status === 204){
              setAddressState('');
              setEmailState('');
              setNameState('');
              setContactState('');
              setShowModal(false);
              getOrganizationUsers();
              return;
            } else if (response.status = 400){
              setCreateError("Cannot create user");
            }
          } catch (error) {
            console.error(error);
            setCreateError("Something went wrong...")
          }
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
          
          const response = await fetch(
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    createUser();
  }

  useEffect(() => {
    getOrganizationUsers();
    setTimeout(() => {
      setIsLoading(false)
    }, 1000);
  }, []);

  return (
    <>
      <div className="p-7 flex-1 h-screen overflow-hidden overflow-y-auto">
        <h1 className="text-2xl font-semibold">
          Users
        </h1>
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
                                onChange={handleAddressChange}
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
                    {createError && 
                      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong class="font-bold">Error! </strong>
                      <span class="block sm:inline">{createError}</span>
                      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                      </span>
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
        <div className='mt-12'>
          {isLoading ? 
          <div className='h-64 flex items-center justify-center'>
            <Loader />
          </div>
          : 
          !users.length == 0 ?
            <Table columns={columns} data={users} />
            :
            <div id="alert-additional-content-1" class="shadow p-4 mb-4 bg-blue-100 rounded-lg dark:bg-blue-200" role="alert">
              <div class="flex items-center justify-center h-64">
                <svg class="mr-2 w-5 h-5 text-blue-700 dark:text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                <h3 class="text-lg font-medium text-blue-700 dark:text-blue-800">It seems that you don't have any user on your organization.</h3>
              </div>
            </div>
          }
        </div>
        <div className="w-full text-center">
          <button
            className="bg-sky-700 text-white active:bg-pink-500 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => setShowModal(true)}
          >
            Add User
          </button>
        </div>
      </div>
    </>
  );
}

export default Users;