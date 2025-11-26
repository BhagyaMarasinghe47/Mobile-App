import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getTeamsByLeagueId } from '@api/cricketApi';

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

export const fetchTeamsByLeague = createAsyncThunk('teams/fetchByLeague', async (leagueId: string) => {
  const data = await getTeamsByLeagueId(leagueId);
  return data;
});

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamsByLeague.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamsByLeague.fulfilled, (state, action: PayloadAction<Team[]>) => {
        state.teams = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeamsByLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teams';
      });
  },
});

export default teamsSlice.reducer;
