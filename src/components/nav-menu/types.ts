import { ReactNode } from 'react';

export enum NavPopupMenuDivider {
  'TOP',
  'BOTTOM',
}

export type TNavPopupMenu = {
  title: ReactNode,
  menuItems: {
    title: ReactNode,
    icon: ReactNode,
    onClick?: Function | undefined,
    divider?: NavPopupMenuDivider,
  }[]
};
