import {create} from "zustand";

interface Store{
  accessToken:string,
  user:string,
  setAccessToken:(token:string)=>void,
  setUser:(id:string)=>void,
  logout:()=>void
}

const authStore = create<Store>((set)=> ({
  accessToken:"",
  user:"",
  setAccessToken:(token)=>{
    set({accessToken:token});
  },
  setUser: (user) => set({ user:user }),

  logout:()=>{
    set({accessToken:"",user:""});
  },

  
}))

export default authStore