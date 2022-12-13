import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi";
import { onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";


export const useAuthStore = ( ) => {


    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async({ email, password }) => {

        dispatch( onChecking() )

        try {

            const { data } = await calendarApi.post('/auth', { email, password })

            localStorage.setItem('token', data.token)
            localStorage.setItem('token-init-date', new Date().getTime())

            dispatch( onLogin({ name: data.username, uid: data.uid }) )

        } catch (error) {
            dispatch( onLogout('Credenciales Incorrectas') )
        }

    }

    const startRegister = async({ email, password, name }) => {
        
        dispatch( onChecking() )

        try {

            const { data } = await calendarApi.post('/auth/register', { email, password, username: name })

            localStorage.setItem('token', data.token)
            localStorage.setItem('token-init-date', new Date().getTime())

            dispatch( onLogin({ name: data.username, uid: data.uid }) )

        } catch (error) {
            dispatch( onLogout(error.response?.data.msg || 'invalid data') )
        }

    }

    const startLogout = async() => {

        try {
            
            localStorage.clear();
            dispatch( onLogoutCalendar() );
            dispatch( onLogout() );

        } catch (error) {
            console.log({ error })
        }
        
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if ( !token ) return dispatch( onLogout() );

        try {
            const { data } = await calendarApi.get('auth/revalidate');
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.username, uid: data.uid }) );
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
    }


    return {
        status,
        user,
        errorMessage,

        startRegister,
        startLogin,
        startLogout,
        checkAuthToken
    }

}