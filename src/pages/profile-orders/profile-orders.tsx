import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getProfileOrders,
  selectProfileOrders
} from '../../services/slices/feedSlice';

export const ProfileOrders: FC = () => {
  const orders = useSelector(selectProfileOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
