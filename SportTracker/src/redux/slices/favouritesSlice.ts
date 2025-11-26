import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavouritesState {
  teams: number[];
  players: number[];
  leagues: number[];
}

const initialState: FavouritesState = {
  teams: [],
  players: [],
  leagues: [],
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addTeam: (state, action: PayloadAction<number>) => {
      if (!state.teams.includes(action.payload)) {
        state.teams.push(action.payload);
      }
    },
    removeTeam: (state, action: PayloadAction<number>) => {
      state.teams = state.teams.filter(id => id !== action.payload);
    },
    addPlayer: (state, action: PayloadAction<number>) => {
      if (!state.players.includes(action.payload)) {
        state.players.push(action.payload);
      }
    },
    removePlayer: (state, action: PayloadAction<number>) => {
      state.players = state.players.filter(id => id !== action.payload);
    },
    addLeague: (state, action: PayloadAction<number>) => {
      if (!state.leagues.includes(action.payload)) {
        state.leagues.push(action.payload);
      }
    },
    removeLeague: (state, action: PayloadAction<number>) => {
      state.leagues = state.leagues.filter(id => id !== action.payload);
    },
  },
});

export const { 
  addTeam, 
  removeTeam, 
  addPlayer, 
  removePlayer, 
  addLeague, 
  removeLeague 
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
