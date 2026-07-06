import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const { pathname } = useLocation();

  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients');
  const isFeedActive = pathname.startsWith('/feed');
  const isProfileActive = pathname.startsWith('/profile');

  const linkClassNames = ({ isActive }: { isActive: boolean }) =>
    clsx(styles.link, 'text', 'text_type_main-default', 'ml-2', 'mr-10', {
      [styles.link_active]: isActive
    });

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <div className={styles.menu_item}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <NavLink to='/' end className={linkClassNames}>
              Конструктор
            </NavLink>
          </div>

          <div className={styles.menu_item}>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <NavLink to='/feed' className={linkClassNames}>
              Лента заказов
            </NavLink>
          </div>
        </div>

        <div className={styles.logo}>
          <Logo className='' />
        </div>

        <div className={styles.link_position_last}>
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <NavLink to='/profile' className={linkClassNames}>
            {userName || 'Личный кабинет'}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
