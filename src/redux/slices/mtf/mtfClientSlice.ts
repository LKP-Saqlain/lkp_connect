import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ClientDetails = {
  cc: string;
  cn: string;
  mob: string;
  mail: string;
};

interface MTFClientState {
  clientDetails: ClientDetails | null;
}

const initialState: MTFClientState = {
  clientDetails: null,
};

const mtfClientSlice = createSlice({
  name: "mtfClient",
  initialState,
  reducers: {
    mtfClientDetails: (state, action: PayloadAction<ClientDetails>) => {
      state.clientDetails = action.payload;
    },
    clearClientDetails: (state) => {
      state.clientDetails = null;
    },
  },
});

export const { mtfClientDetails, clearClientDetails } = mtfClientSlice.actions;
export default mtfClientSlice.reducer;
