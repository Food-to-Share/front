import React, { useState } from "react";
import { useTable, useGlobalFilter, useAsyncDebounce, useFilters, useSortBy, usePagination } from "react-table";
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PencilAltIcon, UserRemoveIcon } from "@heroicons/react/solid";
import { PageButton, Button } from './Button'
import { SortDownIcon, SortIcon, SortUpIcon } from './Icons'
import { apiURL } from './apiURL';
import { TokenContext } from './context';
import { Switch } from '@headlessui/react'

export function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id, render },
  }) {

    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options.values()];
    }, [id, preFilteredRows]);
  
    return (
      <label className="flex gap-x-2 items-baseline">
        <span className="text-gray-700">{render("Header")}: </span>
        <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name={id}
            id={id}
            value={filterValue}
            onChange={e => {
            setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
            <option key={i} value={option}>
                {option}
            </option>
            ))}
        </select>
       </label>
    );
}

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
      setGlobalFilter(value || undefined)
    }, 200)
  
    return (
      <label className="flex gap-x-2 items-baseline">
        <span className="text-gray-700">Search: </span>
        <input
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={value || ""}
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} records...`}
        />
      </label>
    )
  }

function Table({ columns, data }) {
  const { 
      getTableProps, getTableBodyProps, headerGroups, prepareRow,
      page, canPreviousPage, canNextPage, pageOptions, pageCount,
      gotoPage ,nextPage, previousPage, setPageSize,
      state, preGlobalFilteredRows, setGlobalFilter, 
    } = useTable({
      columns,
      data,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
    );

  let organization = 'Food To Share'; // temp, this should come from token

  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const [breakfastEnabled, setBreakfastEnabled] = useState(false);
  const [lunchEnabled, setLunchEnabled] = useState(false);
  const [dinnerEnabled, setDinnerEnabled] = useState(false);

  const [updateError, setUpdateError] = useState('');

  const [user, setUser] = useState({
    id: null,
    name: '',
    username: '',
    organization: '',
    email: '',
    contact: null,
    address: ''
  });
  const [help, setHelp] = useState({
    id: null,
    breakfast: '',
    lunch: '',
    dinner: ''
  });

  const handleEmailChange = (event) => {
    setUser({
        ...user,
        email: event.target.value
    });
  }

  const handleContactChange = (event) => {
    setUser({
        ...user,
        contact: event.target.value
    });
  }

  const handleNameChange = (event) => {
    setUser({
        ...user,
        name: event.target.value
    });
  }

  const handleAddressChange = (event) => {
    setUser({
        ...user,
        address: event.target.value
    });
  }

  const populateForm = async (id) => {
    try {
        const requestOptions = {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenContext}`
          }
        }
        
        const responseUser = await fetch(
          `${apiURL}/users/${id}`, requestOptions
          );

        if(responseUser.status === 200){
          let jsonUser = await responseUser.json();

          setUser(jsonUser);
        }
        const responseHelp = await fetch(
            `${apiURL}/helps/${id}`, requestOptions
            );

        if(responseHelp.status === 200){
          let jsonHelp = await responseHelp.json();
          setHelp(jsonHelp);
          if(jsonHelp.breakfast!=='No Help') setBreakfastEnabled(true);
          if(jsonHelp.lunch!=='No Help') setLunchEnabled(true);
          if(jsonHelp.dinner!=='No Help') setDinnerEnabled(true);
        }

        return;
        
      } catch (error) {
        console.error(error);
      }
  }

  const updateUser = async() => {
    try {
          const requestOptionsUser = {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenContext}`
            },
            body: JSON.stringify(user),
          }

          const requestOptionsHelp = {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenContext}`
            },
            body: JSON.stringify(help),
          }

          const responseUser = await fetch(
            `${apiURL}/users/`, requestOptionsUser
            );
          
          const responseHelp = await fetch(
            `${apiURL}/helps/`, requestOptionsHelp
            );

          if(responseUser.status === 200 && responseHelp.status === 200){
            setShowEditModal(false)
            return;
          } else if (responseUser.status === 400 && responseHelp.status === 400){
            setUpdateError("Error updating user");
          }
        } catch (error) {
          console.error(error);
          setUpdateError("Something went wrong...")
        }
  }

  const deleteUser = async () => {
    try {
      const requestOptionsDelete = {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenContext}`
        },
        body: JSON.stringify(user),
      }
      console.log(user);
      const responseUserDelete = await fetch(
        `${apiURL}/users/${user.id}`, requestOptionsDelete
        );

      if(responseUserDelete.status === 200){
        setShowRemoveModal(false)
        return;
      } else if (responseUserDelete.status === 400){
        setUpdateError("Error deleting user");
      }
    } catch (error) {
      console.error(error);
      console.log(user);
      setUpdateError("Something went wrong ...")
    }
  }

  const handleEditClick = (id) => {
      setShowEditModal(true);
      populateForm(id);
  }

  const handleRemoveClick = (id) => {
      setShowRemoveModal(true);
      populateForm(id);
  }

  const handleSubmit = async(event) => {
    event.preventDefault()
    updateUser();
    setTimeout(() => {
        window.location.reload(false);
    }, 300);
  }

  const handleSubmitDelete = async(event) => {
    event.preventDefault()
    deleteUser();
    setTimeout(() => {
        window.location.reload(false);
    }, 300);
  }

  const handleBreakfastToggle = () => {
    const x = !breakfastEnabled
    setBreakfastEnabled(x)
    if(x){ setHelp({...help,breakfast: organization}) } else { setHelp({...help,breakfast: 'No Help'}) };
  }

  const handleLunchToogle = () => {
    const x = !lunchEnabled
    setLunchEnabled(x)
    if(x) setHelp({...help,lunch: organization}); else setHelp({...help,lunch: 'No Help'});
  }

  const handleDinnerToogle = () => {
    const x = !dinnerEnabled
    setDinnerEnabled(x)
    if(x) setHelp({...help,dinner: organization}); else setHelp({...help,dinner: 'No Help'});
  }

  const tokenContext = React.useContext(TokenContext);

  return (
    <>
        {showRemoveModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Delete User
                    </h3>
                  </div>

                  <div className="relative p-6 flex-auto">
                    <form onSubmit={handleSubmitDelete}>
                      <div className="p-5 border-b rounded-t">
                        <h1 className="block text-sm bold font-medium text-gray-700 mb-5 font-bold">
                          Are you sure that you want to delete this user?
                        </h1>
                      </div>
                    
                      <div className="flex items-center justify-end p-6">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => {
                            setShowRemoveModal(false)}}
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        >
                          Confirm
                        </button>
                      </div>
                    </form>
                    {updateError && 
                      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong class="font-bold">Error! </strong>
                      <span class="block sm:inline">{updateError}</span>
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
        {showEditModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Edit User
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
                                value={user.email}
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
                                value={user.contact}
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
                                value={user.name}
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
                                value={user.address}
                                onChange={handleAddressChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-6 flex gap-8 mb-4">
                        <Switch.Group>
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <Switch.Label className="mr-4">Breakfast</Switch.Label>
                                    <Switch
                                    checked={breakfastEnabled}
                                    onChange={handleBreakfastToggle}
                                    className={`${
                                        breakfastEnabled ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                    >
                                    <span
                                        className={`${
                                            breakfastEnabled ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                    />
                                    </Switch>
                                </div>
                                <div className="flex text-sm text-gray-500 text-center mt-4 flex-col">
                                    <div>
                                        {help.breakfast}
                                    </div>
                                </div>
                            </div>
                        </Switch.Group>
                        <Switch.Group>
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <Switch.Label className="mr-4">Lunch</Switch.Label>
                                    <Switch
                                    checked={lunchEnabled}
                                    onChange={handleLunchToogle}
                                    className={`${
                                        lunchEnabled ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                    >
                                    <span
                                        className={`${
                                            lunchEnabled ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                    />
                                    </Switch>
                                </div>
                                <div className="flex text-sm text-gray-500 text-center mt-4 flex-col">
                                    <div>
                                        {help.lunch}
                                    </div>
                                </div>
                            </div>
                        </Switch.Group>
                        <Switch.Group>
                            <div>
                                <div className="flex items-center">
                                    <Switch.Label className="mr-4">Dinner</Switch.Label>
                                    <Switch
                                    checked={dinnerEnabled}
                                    onChange={handleDinnerToogle}
                                    className={`${
                                        dinnerEnabled ? 'bg-blue-600' : 'bg-gray-200'
                                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                    >
                                    <span
                                        className={`${
                                            dinnerEnabled ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                    />
                                    </Switch>
                                </div>
                                <div className="flex text-sm text-gray-500 text-center mt-4 flex-col">
                                    <div>
                                        {help.dinner}
                                    </div>
                                </div>
                            </div>
                        </Switch.Group>
                      </div>
                      <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => {
                            setShowEditModal(false)}}
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
                    {updateError && 
                      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong class="font-bold">Error! </strong>
                      <span class="block sm:inline">{updateError}</span>
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
        <div className="flex gap-x-2">
            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
            {headerGroups.map((headerGroup) =>
                headerGroup.headers.map((column) =>
                column.Filter ? (
                    <div key={column.id}>
                    {column.render("Filter")}
                    </div>
                ) : null
                )
            )}
        </div>
        <div className="mt-2 flex flex-col">
            <div className="-my-2 overflow-x-auto overflow-y-auto -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table {...getTableProps()} border="1" className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                    <th
                                        scope="col"
                                        className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                    >
                                        <div className="flex items-center justify-between">
                                        {column.render('Header')}
                                        {/* Add a sort direction indicator */}
                                        <span>
                                            {column.isSorted
                                            ? column.isSortedDesc
                                                ? <SortDownIcon className="w-4 h-4 text-gray-400" />
                                                : <SortUpIcon className="w-4 h-4 text-gray-400" />
                                            : (
                                                <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                            )}
                                        </span>
                                        </div>
                                    </th>
                                    ))}
                                </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}
                                className="bg-white divide-y divide-gray-200"
                            >
                                {page.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        if(cell.column.Header === 'Options'){
                                            const id = row.values.id;

                                            return <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap flex flex-row gap-4">
                                                <button onClick={() => handleEditClick(id)} className="hover:scale-125 duration-300"><PencilAltIcon className="w-4 h-4 text-gray-400"/></button>                                              
                                                <button onClick={() => handleRemoveClick(id)} className="hover:scale-125 duration-300"><UserRemoveIcon className="w-4 h-4 text-red-400"/></button>
                                            </td>
                                        }
                                        return <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">{cell.render("Cell")}</td>;
                                    })}
                                    </tr>
                                );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div className="py-3 flex items-center justify-between">  
            <div className="flex-1 flex justify-between sm:hidden">
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex gap-x-5">
            <span className="text-sm text-gray-700 justi">
                Page <span className="font-bold">{state.pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
                <span className="sr-only">Items Per Page</span>
                <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={state.pageSize}
                    onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    }}
                >
                    {[5, 10, 20].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                    </option>
                    ))}
                </select>
            </label>
            </div>
            <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <PageButton
                    className="rounded-l-md"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                >
                    <span className="sr-only">First</span>
                    <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
                </PageButton>
                <PageButton
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </PageButton>
                <PageButton
                    onClick={() => nextPage()}
                    disabled={!canNextPage
                    }>
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </PageButton>
                <PageButton
                    className="rounded-r-md"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    <span className="sr-only">Last</span>
                    <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
                </PageButton>
                </nav>
            </div>
            </div>
        </div>
    </>
  );
}

export default Table;