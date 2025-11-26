import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface League {
  id: number;
  name: string;
  country: string;
  logo?: string;
}

interface LeaguesState {
  leagues: League[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaguesState = {
  leagues: [],
  loading: false,
  error: null,
};

const leaguesSlice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLeagues: (state, action: PayloadAction<League[]>) => {
      state.leagues = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setLeagues } = leaguesSlice.actions;
export default leaguesSlice.reducer;
