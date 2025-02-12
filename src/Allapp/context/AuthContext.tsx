import React, { createContext, useReducer } from "react";
import { authReducer } from './AuthReducer';
import petClubApiReports from '../api/apiReports';
import {
  User,
  LoginResponse,
  LoginData,
  GenericUid,
  BusinessRegisterResponse,
  BusinessRegisterData
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
  putBusinessApproveData: (uid: GenericUid ) => Promise<{ success: boolean; data?: BusinessRegisterResponse; error?: any }>;
  postFormData: (BusinessRegisterData: BusinessRegisterData) => Promise<any>;
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

  const postFormData = async ({
    typeUser,
    name,
    latitude,
    longitude,
    image,
    weekOpening,
    weekClosing,
    dateAttentionWeek,
    weekendOpening,
    weekendClosing,
    dateAttentionWeekend,
    phone,
    email
  }: BusinessRegisterData): Promise<any> => {
  
    try {
      const formData = new FormData();
      formData.append("typeUser", typeUser);
      formData.append("name", name);
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("weekOpening", weekOpening);
      formData.append("weekClosing", weekClosing);
      formData.append("dateAttentionWeek", dateAttentionWeek);
      formData.append("weekendOpening", weekendOpening);
      formData.append("weekendClosing", weekendClosing);
      formData.append("dateAttentionWeekend", dateAttentionWeekend);
      formData.append("phone", phone);
      formData.append("email", email);
  
      if (image instanceof File) {
        formData.append("file", image);
      } else {
        console.error("La imagen no es un archivo válido.");
        return null;
      }
  
      const { data } = await petClubApiReports.post("/businessRegister", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return data;
    } catch (error: any) {
      dispatch({
        type: "addError",
        payload: error.response?.data?.msg || "Información incorrecta",
      });
      return null;
    }
  };

  const putBusinessApproveData = async ({ uid }: GenericUid) => {
    try {
        const { data } = await petClubApiReports.put<BusinessRegisterResponse>(`/businessRegister/${uid}`);

        return { success: true, data };
    } catch (error: any) {
        dispatch({
            type: 'addError',
            payload: error.response?.data?.msg || 'Información incorrecta',
        });

        return { success: false, error };
    }
};


  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      logOut,
      putBusinessApproveData,
      postFormData,
      removeError
    }}>
      {children}
    </AuthContext.Provider>
  );
};