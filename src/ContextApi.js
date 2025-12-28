import { createContext,useContext } from "react";



export const AppContext =createContext()



const data={
    name:"priya",
    lastName:"s"
}


  const AppProvider=({children})=>{

    return (
        <AppContext.Provider value={{data}}>
           {children}


        </AppContext.Provider>
    )

}
export default AppProvider


export  const useTestContext=()=>{
    const contextData=useContext(AppContext)

    const {data}=contextData

    console.log("dataCheck=====",data)
 }




