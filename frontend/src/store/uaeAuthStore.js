import {create} from 'zustand';

export const useUaeAuthStore = create((set, get) => ({
  authUser : {name:"jhonDoe", _id: '12345' , Age:30},
  isLoading : false,

  login:()=>{
    console.log("login called");
  }
}));