import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getPlayersByTeamId } from '@api/cricketApi';

interface Player {
  id: number;
  name: string;
  position?: string;
  number?: number;
  photo?: string;
}

interface PlayersState {
  players: Player[];
  loading: boolean;
  error: string | null;
}

const initialState: PlayersState = {
  players: [],
  loading: false,
  error: null,
};

export const fetchPlayersByTeam = createAsyncThunk('players/fetchByTeam', async (teamId: string) => {
  const data = await getPlayersByTeamId(teamId);
  return data;
});

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayersByTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayersByTeam.fulfilled, (state, action: PayloadAction<Player[]>) => {
        state.players = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlayersByTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch players';
      });
  },
});

export default playersSlice.reducer;
