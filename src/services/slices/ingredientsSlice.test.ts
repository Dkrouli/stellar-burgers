import reducer, { getIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react-burger/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react-burger/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react-burger/bun-02-mobile.png'
};

describe('ingredientsSlice reducer', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('Возвращает начальное состояние при неизвестном экшене с undefined как начальное состояние', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('Обрабатывает экшен pending: устанавливает isLoading = true и сбрасывает ошибку', () => {
    const action = { type: getIngredients.pending.type };
    const state = reducer(undefined, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  it('Обрабатывает экшен fulfilled: сохраняет ингредиенты и сбрасывает isLoading', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: [mockIngredient]
    };
    const state = reducer(undefined, action);

    expect(state.ingredients).toEqual([mockIngredient]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('Обрабатывает экшен rejected: устанавливает ошибку и сбрасывает isLoading', () => {
    const errorMessage = 'Network Error';
    const action = {
      type: getIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = reducer(undefined, action);

    expect(state.error).toBe(errorMessage);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([]);
  });

  it('Обрабатывает rejected без error.message: использует сообщение по умолчанию', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: {}
    };
    const state = reducer(undefined, action);

    expect(state.error).toBe('Ошибка загрузки ингридиентов.');
    expect(state.isLoading).toBe(false);
  });
});
