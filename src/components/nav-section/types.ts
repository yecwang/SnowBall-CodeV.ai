import { StackProps } from '@mui/material/Stack';
import { ListItemButtonProps } from '@mui/material/ListItemButton';
import { TNavPopupMenu } from '../nav-menu';
// ----------------------------------------------------------------------

export type NavConfigProps = {
  hiddenLabel?: boolean;
  itemGap?: number;
  iconSize?: number;
  itemRadius?: number;
  itemPadding?: string;
  currentRole?: string;
  itemSubHeight?: number;
  itemRootHeight?: number;
};

export type NavItemProps = ListItemButtonProps & {
  item: NavListProps;
  depth: number;
  open?: boolean;
  active: boolean;
  externalLink?: boolean;
  onClick?: () => void;
};

export type NavListProps = {
  title: string;
  path: string;
  icon?: React.ReactElement;
  info?: React.ReactElement;
  caption?: string;
  disabled?: boolean;
  roles?: string[];
  children?: any;
  onClick?: () => void;
  popupMenu?: TNavPopupMenu;
  inputValue?: string;
  onInputSubmit?: (value: string) => void;
};

export type NavSectionProps = StackProps & {
  data: {
    subheader: string;
    items: NavListProps[];
  }[];
  config?: NavConfigProps;
};
