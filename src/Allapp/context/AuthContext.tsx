import React, { createContext, useReducer } from "react";
import { authReducer } from './AuthReducer';
import petClubApiReports from '../api/apiReports';
import {
  User,
  LoginResponse,
  LoginData
} from '../interface/interface';

export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated',
  token: string | null,
  errorMessage: string,
  user: User | null,
  msg: string | null,
  message: string | null,
}

export const authInitialState: AuthState = {
  status: 'checking',
  token: null,
  errorMessage: '',
  user: null,
  msg: null,
  message: null,
}

export interface authStateProps {
  errorMessage: string,
  token: string | null,
  message: string | null,
  user: User | null,
  status: 'checking' | 'authenticated' | 'not-authenticated',
  signIn: (LoginData: LoginData) => Promise<string>,
  logOut: () => void,
  removeError: () => void,
}

interface props {
  children: JSX.Element | JSX.Element[]
}

export const AuthContext = createContext({} as authStateProps);

export const AuthProvider = ({ children }: props) => {

  const [state, dispatch] = useReducer(authReducer, authInitialState);

  const logOut = async () => {
    await localStorage.removeItem('token');
    dispatch({ type: 'logOut' });
  };

  const removeError = () => {
    dispatch({ type: 'removeError' });
  };

  const signIn = async ({ name, password }: LoginData) => {
    let validationUser = '';
    try {
      const { data } = await petClubApiReports.post<LoginResponse>('/login', { name, password });
      console.log(data);
      dispatch({
        type: 'signIn',
        payload: {
          token: data.responseLogin.token,
          user: data.responseLogin.user,
          message: data.responseLogin.message
        }
      });

      await localStorage.setItem('token', data.responseLogin.token);
      validationUser = 'validado';
    } catch (error: any) {
      dispatch({
        type: 'addError',
        payload: error.response.data.msg || 'Información incorrecta'
      });
      validationUser = 'Novalidado';
    }

    return validationUser;
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      logOut,
      removeError
    }}>
      {children}
    </AuthContext.Provider>
  );
};