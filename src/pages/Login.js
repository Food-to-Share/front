import React, {useState} from "react";
import cryptoJs from "crypto-js";
import { apiURL } from "../components/apiURL";
import { AuthContext } from "../components/context";

function Login() {

  const [emailState, setEmailState] = useState('');
  const [passwordState, setPasswordState] = useState('');

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
        
          let response = await fetch(
            `${apiURL}/login`, requestOptions
            );
          
          let json = await response.json();
    
          console.log(json);
          return json;
        } catch (error) {
          console.error(error);
        }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await getLoginResponse();

    const token = response.token;
    signIn(token);
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
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;