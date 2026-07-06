import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderByNumber,
  getOrderByNumber,
  selectOrderByNumber
} from '../../services/slices/orderSlice';
import {
  selectFeedOrders,
  selectProfileOrders
} from '../../services/slices/feedSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const orderByNumber = useSelector(selectOrderByNumber);
  const ingredients = useSelector(selectIngredients);

  const orderData = useMemo(
    () =>
      [...feedOrders, ...profileOrders].find(
        (order) => order.number === orderNumber
      ) || orderByNumber,
    [feedOrders, profileOrders, orderByNumber, orderNumber]
  );

  useEffect(() => {
    if (!orderData && Number.isFinite(orderNumber)) {
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber, orderData]);

  useEffect(
    () => () => {
      dispatch(clearOrderByNumber());
    },
    [dispatch]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
