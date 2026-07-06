import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
import { getFeedsApi, getOrdersApi } from '@api';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  profileOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  profileOrders: [],
  isLoading: false,
  error: null
};

export const getFeeds = createAsyncThunk('feed/getFeeds', getFeedsApi);

export const getProfileOrders = createAsyncThunk(
  'feed/getProfileOrders',
  getOrdersApi
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов.';
      })

      .addCase(getProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки истории заказов.';
      });
  }
});

export const selectFeed = (state: RootState) => state.feed;
export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;

export const selectProfileOrders = (state: RootState) =>
  state.feed.profileOrders;

export default feedSlice.reducer;
