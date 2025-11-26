import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllLeagues, League as CricketLeague } from '@api/cricketApi';

interface League {
  id: number;
  name: string;
  country: string;
  logo?: string;
}

interface LeaguesState {
  leagues: CricketLeague[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaguesState = {
  leagues: [],
  loading: false,
  error: null,
};

export const fetchLeagues = createAsyncThunk('leagues/fetch', async (): Promise<CricketLeague[]> => {
  const data = await getAllLeagues();
  return data;
});

const leaguesSlice = createSlice({
  name: 'leagues',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeagues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeagues.fulfilled, (state, action: PayloadAction<CricketLeague[]>) => {
        state.leagues = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch leagues';
      });
  },
});

export default leaguesSlice.reducer;
