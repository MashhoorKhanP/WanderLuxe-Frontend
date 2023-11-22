import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import errorHandle from "../../components/hooks/errorHandler";
import { AxiosError } from "axios";
import { loginAdmin } from "../../actions/admin";
import { toast } from "react-toastify";

interface AdminState{
  currentAdmin:Admin| null;//Want to update according to database
  openLogin:boolean;
  adminLoading:boolean;
}

const initialState: AdminState= {
  currentAdmin:null,
  openLogin:false,
  adminLoading:false
};

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  token: string;
}


const adminSlice = createSlice({
  name:'admin',
  initialState,
  reducers:{
    setCurrentAdmin:(state,action:PayloadAction<Admin>) =>{
      state.currentAdmin = action.payload;
    },
    updateAdmin:(state,action:PayloadAction<Admin>) =>{
      const updatedAdmin = action.payload;
      localStorage.setItem('currentAdmin',JSON.stringify(updatedAdmin));
      console.log('updatedAdmin',updatedAdmin);
      state.currentAdmin = {...updatedAdmin};
    },
    logoutAdmin:(state) =>{
      state.currentAdmin = null;
      localStorage.removeItem('currentAdmin');
      localStorage.removeItem('AdminToken');
      toast.success('Logged out successfully');
    },
    startLoading:(state) => {
      state.adminLoading = true;
    },
    stopAdminLoading:(state) => {
      state. adminLoading = false;
    },
  },
  extraReducers:(builder) => {

    //Login Admin
    builder.addCase(loginAdmin.pending,(state) =>{
      state.adminLoading = true;
    });

    builder.addCase(loginAdmin.fulfilled,(state,action) =>{
      state.adminLoading= false;
      const currentAdmin = action.payload;
      if (currentAdmin && currentAdmin.message) {
      console.log('JSON.Stingify of current user',JSON.stringify(currentAdmin.message));
      console.log(currentAdmin,'for token check')
      localStorage.setItem('AdminToken',currentAdmin.token);
      localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin.message));
      console.log('currentAdmin.message', currentAdmin.message);
      // Don't directly modify state.currentUser, create a new object
      state.currentAdmin = currentAdmin.message;

      toast.success('Login Successfull');
      console.log('reached here userSlice , next is to openLogin = false')
      state.openLogin = false;
    } else {
      // Handle the case where currentUser or message is null or undefined
      console.error('Received invalid data in loginUser.fulfilled');
    }
    });
    builder.addCase(loginAdmin.rejected,(state,action) =>{
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        toast.error(error.message);
      } else {
        // Handle non-Error rejection (if needed)
        console.error('Login failed with non-Error rejection:', action.error);
      }
      state.adminLoading = false;
    });
  },
});

export const {setCurrentAdmin,
  updateAdmin,logoutAdmin,startLoading,stopAdminLoading,
} = adminSlice.actions;

export default adminSlice.reducer;