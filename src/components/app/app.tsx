import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';

import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { Preloader } from '@ui';
import { ProtectedRoute } from '../routes/protected-route';
import { useEffect, useState } from 'react';
import { useDispatch } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { checkingUserAuth } from '../../services/slices/userSlice';

import {
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal, OrderInfo, IngredientDetails } from '@components';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const state = location.state as { background?: Location } | undefined;
  const background = state?.background;
  const feedMatch = useMatch('/feed/:number');
  const profileOrdersMatch = useMatch('/profile/orders/:number');

  useEffect(() => {
    dispatch(getIngredients()).then(() => setIsLoadingIngredients(false));
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkingUserAuth()).then(() => setIsLoadingAuth(false));
  }, [dispatch]);

  const isLoading = isLoadingIngredients || isLoadingAuth;

  const modalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      {isLoading && <Preloader />}

      {!isLoading && (
        <>
          <AppHeader />
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound404 />} />

            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />

            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />

            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
          </Routes>

          {background && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  feedMatch && feedMatch.params.number ? (
                    <Modal
                      title={`#${feedMatch.params.number}`}
                      onClose={modalClose}
                    >
                      <OrderInfo />
                    </Modal>
                  ) : null
                }
              />

              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Информация об ингредиенте' onClose={modalClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />

              <Route
                path='/profile/orders/:number'
                element={
                  profileOrdersMatch && profileOrdersMatch.params.number ? (
                    <ProtectedRoute>
                      <Modal
                        title={`#${profileOrdersMatch.params.number}`}
                        onClose={modalClose}
                      >
                        <OrderInfo />
                      </Modal>
                    </ProtectedRoute>
                  ) : null
                }
              />

              <Route path='*' element={<NotFound404 />} />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
