import {createContext,useState} from "react"
export const DarkModeContext=createContext();
export const DarkModeProvider=(children)=>{
    const [darkMode,setDarkMode]=useState(false);
    <DarkModeContext.Provider value={[darkMode,setDarkMode]}>
        {children}
    </DarkModeContext.Provider>
}