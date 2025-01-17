import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
// routes
import { RouterLink } from 'src/routes/components';
// components
import { NavPopupMenu } from 'src/components/nav-menu';
import Iconify from '../../iconify';
//
import { NavItemProps, NavConfigProps } from '../types';
import { StyledItem, StyledIcon, StyledDotIcon } from './styles';

// ----------------------------------------------------------------------

type Props = NavItemProps & {
  config: NavConfigProps;
};

export default function NavItem({
  item,
  open,
  depth,
  active,
  config,
  externalLink,
  ...other
}: Props) {
  const _renderInputValue = (initialValue?: string, onInputSubmit?: (value: string) => void ) => {
    const [inputValue, setInputValue] = useState(initialValue || '');

    return <TextField
      size="small"
      id="outlined-basic"
      variant="outlined"
      onClick={(e => {
        e.preventDefault();
        e.stopPropagation();
      })}
      value={inputValue}
      onChange={(e) => {
        e.preventDefault();
        setInputValue(e.target.value)
      }}
      onBlur={() => onInputSubmit && onInputSubmit(inputValue)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && onInputSubmit) {
          event.preventDefault();
          onInputSubmit(inputValue);
        }
      }}
    />;
  }
  const { title, path, icon, info, children, disabled, caption, roles, popupMenu, inputValue, onInputSubmit } = item;
  

  const subItem = depth !== 1;
  const deepSubItem = depth > 1;

  const renderContent = (
    <StyledItem
      disableGutters
      disabled={disabled}
      active={active}
      depth={depth}
      config={config}
      {...other}
    >
      {
        inputValue ? 
          _renderInputValue(inputValue, onInputSubmit) : (<>
            <>
              {icon && <StyledIcon size={config.iconSize} sx={{ marginRight: deepSubItem ? '4px' : undefined }}>{icon}</StyledIcon>}
              {subItem && !icon && (
                <StyledIcon size={config.iconSize}>
                  <StyledDotIcon active={active} />
                </StyledIcon>
              )}
            </>
        
            {!(config.hiddenLabel && !subItem) && (
              <ListItemText
                primary={title}
                secondary={
                  caption ? (
                    <Tooltip title={caption} placement="top-start">
                      <span>{caption}</span>
                    </Tooltip>
                  ) : null
                }
                primaryTypographyProps={{
                  noWrap: true,
                  typography: 'body2',
                  textTransform: 'capitalize',
                  fontWeight: active ? 'fontWeightSemiBold' : 'fontWeightMedium',
                }}
                secondaryTypographyProps={{
                  noWrap: true,
                  component: 'span',
                  typography: 'caption',
                  color: 'text.disabled',
                }}
              />
            )}
        
            {info && (
              <Box component="span" sx={{ ml: 1, lineHeight: 0 }}>
                {info}
              </Box>
            )}
        
            {popupMenu && <NavPopupMenu {...popupMenu} />}
        
            {!!children && (
              <Iconify
                width={16}
                icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
                sx={{ ml: 1, flexShrink: 0 }}
              />
            )}
          </>)
      }
    </StyledItem>
  );

  // Hidden item by role
  if (roles && !roles.includes(`${config.currentRole}`)) {
    return null;
  }
  
  // External link
  if (externalLink)
    return (
      <Link
        href={path}
        target="_blank"
        rel="noopener"
        underline="none"
        color="inherit"
        sx={{
          ...(disabled && {
            cursor: 'default',
          }),
        }}
      >
        {renderContent}
      </Link>
    );

  // Has child
  if (children) {
    return renderContent;
  }

  // Default
  return (
    <Link
      component={RouterLink}
      href={path}
      underline="none"
      color="inherit"
      sx={{
        ...(disabled && {
          cursor: 'default',
        }),
      }}
    >
      {renderContent}
    </Link>
  );
}
