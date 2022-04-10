import './App.css';

import React, { useEffect } from 'react';
import { AuthContext, TokenContext } from './components/context'

import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {

  const initialLoginState = {
    email: null,
    token: null
  }

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...prevState,
          email: action.email,
          token: action.token
        }
      case 'LOGOUT':
        return {
          ...prevState,
          email: null,
          token: null
        }
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(userToken, userEmail) => {
      dispatch({type: 'LOGIN', email: userEmail, token: userToken});
    },
    signOut: async() => {
      dispatch({type: 'LOGOUT'});
    }
  }), []);

  return (
    <>
    <AuthContext.Provider value={authContext}>
      <TokenContext.Provider value={loginState.token}>
        <Router>
          {loginState.token !== null ? (
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          ) : 
            <Routes>
              <Route path="/" element={<Login />} />
            </Routes>
          }
        </Router>
      </TokenContext.Provider>
    </AuthContext.Provider>
    </>
  );
}

export default App;