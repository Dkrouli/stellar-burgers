import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  getIngredientsFromServer
} from './constructorSlice';
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
const initialState = { bun: null, ingredients: [] };
describe('constructorSlice reducer', () => {
  it('возвращает начальное состояние при неизвестном экшене с undefined как начальное состояние', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });
  it('обрабатывает простой экшен addIngredient (добавление булки)', () => {
    const state = constructorReducer(undefined, addIngredient(mockIngredient));
    expect(state.bun).toEqual({ ...mockIngredient, id: expect.any(String) });
    expect(state.ingredients).toHaveLength(0);
  });
  it('обрабатывает простой экшен removeIngredient (удаление ингредиента)', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...mockIngredient, type: 'main', id: 'id1' },
        { ...mockIngredient, type: 'sauce', id: 'id2' }
      ]
    };
    const state = constructorReducer(
      stateWithIngredients,
      removeIngredient('id1')
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('id2');
  });
  it('обрабатывает простой экшен moveIngredient (перемещение ингредиента)', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...mockIngredient, type: 'main', id: 'id1' },
        { ...mockIngredient, type: 'sauce', id: 'id2' },
        { ...mockIngredient, type: 'main', id: 'id3' }
      ]
    };
    const state = constructorReducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );
    expect(state.ingredients[0].id).toBe('id2');
    expect(state.ingredients[1].id).toBe('id3');
    expect(state.ingredients[2].id).toBe('id1');
  });
  it('обрабатывает простой экшен resetConstructor (сброс состояния)', () => {
    const stateWithData = {
      bun: mockIngredient,
      ingredients: [{ ...mockIngredient, id: 'id1' }]
    };
    const state = constructorReducer(stateWithData, resetConstructor());
    expect(state).toEqual(initialState);
  });
  it('обрабатывает pending состояние асинхронного экшена getIngredientsFromServer', () => {
    const stateBefore = { ...initialState };
    const stateAfter = constructorReducer(stateBefore, {
      type: getIngredientsFromServer.pending.type
    });
    expect(stateAfter).toEqual(stateBefore);
  });
  it('обрабатывает fulfilled состояние асинхронного экшена getIngredientsFromServer', () => {
    const mockIngredients = [mockIngredient];
    const stateBefore = { ...initialState };
    const stateAfter = constructorReducer(stateBefore, {
      type: getIngredientsFromServer.fulfilled.type,
      payload: mockIngredients
    });
    expect(stateAfter).toEqual(stateBefore);
  });
  it('обрабатывает rejected состояние асинхронного экшена getIngredientsFromServer', () => {
    const stateBefore = { ...initialState };
    const stateAfter = constructorReducer(stateBefore, {
      type: getIngredientsFromServer.rejected.type,
      error: { message: 'Network Error' }
    });
    expect(stateAfter).toEqual(stateBefore);
  });
});
