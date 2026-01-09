import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthStep = "LOGIN" | "REGISTER" | "VERIFICATION" | "COMPANY_DATA";

interface AuthState {
  step: AuthStep;
  isDialogOpen: boolean;
  formData: {
    phoneNumber: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    cateringManagerName?: string;
    verificationCode?: string;
    companyName?: string;
    companyType?: string;
    siteName?: string;
    workersCount?: string;
    city?: string;
    address?: string;
    additionalNotes?: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  step: "LOGIN",
  isDialogOpen: false,
  formData: {
    phoneNumber: "",
  },
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<AuthStep>) => {
      const oldStep = state.step;
      const newStep = action.payload;
      state.step = newStep;
      state.error = null;
      
      // Clear sensitive/temporary form data when switching between main entry points
      // but keep phoneNumber if moving to VERIFICATION
      if ((newStep === "LOGIN" || newStep === "REGISTER") && oldStep !== newStep) {
        state.formData = { phoneNumber: "" };
      }
    },
    updateForm: (state, action: PayloadAction<Partial<AuthState["formData"]>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setIsDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isDialogOpen = action.payload;
      if (!action.payload) {
        state.step = "LOGIN";
        state.formData = { phoneNumber: "" };
      }
    },
    resetAuth: () => initialState,
  },
});

export const { setStep, updateForm, setLoading, setError, setIsDialogOpen, resetAuth } = authSlice.actions;
export default authSlice.reducer;
