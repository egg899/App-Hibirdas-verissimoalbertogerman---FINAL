import Cookies from 'js-cookie';
import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const auth = Cookies.get('jwToken') || null;
    console.log(auth);
    useEffect(()=> {
        if(auth){
            const decoded = jwtDecode(auth);
            console.log('decoded', decoded);
            setUser({
                name:decoded.usuario.name,
                _id:decoded.usuario._id,
                username:decoded.usuario.username,
                role:decoded.usuario.role,
                image:decoded.usuario.image
            })
        }
    }, [])


    const logoutUser = () => {
        setUser(null);
        Cookies.remove('jwToken');
    }

    return (
        <AuthContext.Provider value={{ user, setUser, auth, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}