import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Team {
  id: number;
  name: string;
  logo?: string;
  country?: string;
}

interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamsState = {
  teams: [],
  loading: false,
  error: null,
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setTeams } = teamsSlice.actions;
export default teamsSlice.reducer;
