import { combineReducers } from 'redux';

import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import orderReducer from './slices/orderSlice';

const rootReducer = combineReducers({
  burgerConstructor: constructorReducer,
  ingredients: ingredientsReducer,
  feed: feedReducer,
  order: orderReducer,
  user: userReducer
});

export default rootReducer;
