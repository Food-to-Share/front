import React, {useState} from "react";
import cryptoJs from "crypto-js";
import { apiURL } from "../components/apiURL";
import { AuthContext } from "../components/context";

function Login() {

  const [emailState, setEmailState] = useState('');
  const [passwordState, setPasswordState] = useState('');

  const [loginError, setLoginError] = useState('');

  const { signIn } = React.useContext(AuthContext);

  const handleEmailChange = (event) => {
      setEmailState(event.target.value);
  }

  const handlePasswordChange = (event) => {
      setPasswordState(event.target.value);
  }

  const getLoginResponse = async() => {
    try {
        //   const hashPassword = cryptoJs.SHA256(passwordState).toString();
    
          const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ email: emailState, password: passwordState })
          }
          
          const response = await fetch(
            `${apiURL}/login`, requestOptions
            );

          if(response.status === 200){
            let json = await response.json();
            return json;
          } else if(response.status === 401){
            let json = await response.json();
            setLoginError(json.error);
            return
          } else {
            setLoginError("Failed to connect to server!")
          } 
          
          return
          
        } catch (error) {
          setLoginError("Failed to connect to server!")
          console.error(error);
        }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError('')
    const response = await getLoginResponse();

    if(response){
      const token = response.token;
      signIn(token);
      return
    }
  }

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="./logo512.png"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={emailState}
                  onChange={handleEmailChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={passwordState}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-gray-800 hover:text-sky-600"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-900 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
            {loginError && 
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong class="font-bold">Error! </strong>
              <span class="block sm:inline">{loginError}</span>
              <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </span>
            </div>
            }
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;