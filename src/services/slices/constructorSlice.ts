import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';

export interface ConstructorSliceInterface {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorSliceInterface = {
  bun: null,
  ingredients: []
};

export const getIngredientsFromServer = createAsyncThunk(
  'ingredients/getIngredients',
  async () => await getIngredientsApi()
);

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (
        state: ConstructorSliceInterface,
        { payload }: PayloadAction<TConstructorIngredient>
      ) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: crypto.randomUUID() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [ingredient] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, ingredient);
    },
    resetConstructor: () => initialState
  },
  selectors: {
    getConstructorItems: (state) => state,
    getIngredientsInConstructor: (state) => state.ingredients,
    selectBurgerIngredients: (state) => {
      const { bun, ingredients } = state;
      const allIngredients = [bun, ...ingredients];
      if (bun) {
        allIngredients.push(bun);
      }
      const ingredientIds = allIngredients.map((ingredient) => ingredient?._id);

      return ingredientIds;
    }
  }
});

export const {
  getConstructorItems,
  getIngredientsInConstructor,
  selectBurgerIngredients
} = constructorSlice.selectors;
export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
