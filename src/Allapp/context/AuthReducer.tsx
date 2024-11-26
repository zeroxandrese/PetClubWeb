import { AuthState } from './AuthContext';
import {
    User
} from '../interface/interface';

type authAction =
    | { type: 'signIn', payload: { token: string, user: User, message: string } }
    | { type: 'addError', payload: string }
    | { type: 'removeError' }
    | { type: 'notAuthenticated' }
    | { type: 'logOut' }

export const authReducer = (state: AuthState, action: authAction): AuthState => {
    switch (action.type) {
        case 'addError':
            return {
                ...state,
                user: null,
                status: 'not-authenticated',
                token: null,
                errorMessage: action.payload
            };
        case 'removeError':
            return {
                ...state,
                errorMessage: ''
            };
        case 'signIn':
            return {
                ...state,
                errorMessage: '',
                status: 'authenticated',
                token: action.payload.token,
                user: action.payload.user,
                message: action.payload.message
            };
        case 'logOut':
        case 'notAuthenticated':
            return {
                ...state,
                status: 'not-authenticated',
                token: null,
                user: null,
                message: null
            };

        default:
            return state;
    }
}