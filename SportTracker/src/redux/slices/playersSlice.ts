import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setPlayers } = playersSlice.actions;
export default playersSlice.reducer;
