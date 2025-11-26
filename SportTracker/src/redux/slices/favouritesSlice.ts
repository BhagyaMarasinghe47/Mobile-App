import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const FAV_KEY = 'favourites';

export const loadFavourites = createAsyncThunk('favourites/load', async () => {
  try {
    const raw = await AsyncStorage.getItem(FAV_KEY);
    if (!raw) return initialState;
    const loaded = JSON.parse(raw) as FavouritesState;
    
    // Remove duplicates from loaded data
    const cleaned: FavouritesState = {
      teams: [...new Set(loaded.teams || [])],
      players: [...new Set(loaded.players || [])],
      leagues: [...new Set(loaded.leagues || [])],
    };
    
    console.log('Loaded favourites from storage:', loaded);
    console.log('Cleaned favourites (removed duplicates):', cleaned);
    
    // Save cleaned data back to storage
    if (JSON.stringify(loaded) !== JSON.stringify(cleaned)) {
      await saveFavourites(cleaned);
      console.log('Saved cleaned favourites back to storage');
    }
    
    return cleaned;
  } catch (e) {
    console.error('Error loading favourites:', e);
    return initialState;
  }
});

export const saveFavourites = async (state: FavouritesState) => {
  try {
    await AsyncStorage.setItem(FAV_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore
  }
};

export const addTeamAsync = createAsyncThunk('favourites/addTeam', async (id: number, { getState }) => {
  const state = (getState() as any).favourites as FavouritesState;
  // Prevent duplicates - only add if not already in array
  if (state.teams.includes(id)) {
    console.log(`Team ${id} already in favourites, skipping`);
    return state;
  }
  const teams = [...state.teams, id];
  const next = { ...state, teams };
  console.log(`Adding team ${id} to favourites. New favourites:`, teams);
  await saveFavourites(next);
  return next;
});

export const removeTeamAsync = createAsyncThunk('favourites/removeTeam', async (id: number, { getState }) => {
  const state = (getState() as any).favourites as FavouritesState;
  const teams = state.teams.filter(t => t !== id);
  const next = { ...state, teams };
  console.log(`Removing team ${id} from favourites. Remaining:`, teams);
  await saveFavourites(next);
  return next;
});

export const addPlayerAsync = createAsyncThunk('favourites/addPlayer', async (id: number, { getState }) => {
  const state = (getState() as any).favourites as FavouritesState;
  const players = state.players.includes(id) ? state.players : [...state.players, id];
  const next = { ...state, players };
  await saveFavourites(next);
  return next;
});

export const removePlayerAsync = createAsyncThunk('favourites/removePlayer', async (id: number, { getState }) => {
  const state = (getState() as any).favourites as FavouritesState;
  const players = state.players.filter(p => p !== id);
  const next = { ...state, players };
  await saveFavourites(next);
  return next;
});

export const addLeagueAsync = createAsyncThunk('favourites/addLeague', async (id: number, { getState }) => {
  const state = (getState() as any).favourites as FavouritesState;
  const leagues = state.leagues.includes(id) ? state.leagues : [...state.leagues, id];
  const next = { ...state, leagues };
  await saveFavourites(next);
  return next;
});

export const removeLeagueAsync = createAsyncThunk('favourites/removeLeague', async (id: number, { getState }) => {
  const state = (getState() as any).favourites as FavouritesState;
  const leagues = state.leagues.filter(l => l !== id);
  const next = { ...state, leagues };
  await saveFavourites(next);
  return next;
});

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFavourites.fulfilled, (state, action: PayloadAction<FavouritesState>) => {
        return action.payload;
      })
      .addCase(addTeamAsync.fulfilled, (state, action: PayloadAction<FavouritesState>) => {
        return action.payload;
      })
      .addCase(removeTeamAsync.fulfilled, (state, action: PayloadAction<FavouritesState>) => {
        return action.payload;
      })
      .addCase(addPlayerAsync.fulfilled, (state, action: PayloadAction<FavouritesState>) => {
        return action.payload;
      })
      .addCase(removePlayerAsync.fulfilled, (state, action: PayloadAction<FavouritesState>) => {
        return action.payload;
      })
      .addCase(addLeagueAsync.fulfilled, (state, action: PayloadAction<FavouritesState>) => {
        return action.payload;
      })
      .addCase(removeLeagueAsync.fulfilled, (state, action: PayloadAction<FavouritesState>) => {
        return action.payload;
      });
  },
});

export const {
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
