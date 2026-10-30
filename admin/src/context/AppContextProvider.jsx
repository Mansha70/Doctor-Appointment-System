import { AppContext } from './AppContext';

export const AppContextProvider = (props) => {
 const currency='$'
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const calculateAge=(dob)=>{
   const today=new Date() 
   const birthDate=new Date(dob)
   let age=today.getFullYear()-birthDate.getFullYear()
   return age;
  }
   const months=["","jan","feb","march","apr","may","jun","jul","aug","sept","oct","nov","dec"]
  
  const slotDateFormat=(slotDate)=>{
    const dateArray=slotDate.split('_') 
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2]
  }
  const value = {
    calculateAge,
    slotDateFormat,
    currency,backendUrl
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
