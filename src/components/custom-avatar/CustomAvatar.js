import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Badge, Avatar } from '@mui/material';

// ----------------------------------------------------------------------

const getCharAtName = (name) => name && name.charAt(0).toUpperCase();

const getColorByName = (name) => {
  if (['A', 'N', 'H', 'L', 'Q'].includes(getCharAtName(name))) return '#512bd4';
  if (['F', 'G', 'T', 'I', 'J'].includes(getCharAtName(name))) return '#ac99ea';
  if (['K', 'D', 'Y', 'B', 'O'].includes(getCharAtName(name))) return '#e666cc';
  if (['P', 'E', 'R', 'S', 'U'].includes(getCharAtName(name))) return '#28c2d1';
  if (['V', 'W', 'X', 'M', 'Z'].includes(getCharAtName(name))) return '#fa97a1';
  return '#4633dd';
};

// ----------------------------------------------------------------------

const CustomAvatar = forwardRef(({ color, name = '', BadgeProps, children, sx, ...other }, ref) => {
  const theme = useTheme();

  const charAtName = getCharAtName(name);

  const colorByName = getColorByName(name);

  const colr = color || colorByName;

  const renderContent =
    colr === 'default' ? (
      <Avatar ref={ref} sx={sx} {...other}>
        {name && charAtName}
        {children}
      </Avatar>
    ) : (
      <Avatar
        ref={ref}
        sx={{
          color: "white",
          backgroundColor: colr,
          fontWeight: theme.typography.fontWeightMedium,
          ...sx,
        }}
        {...other}
      >
        {name && charAtName}
        {children}
      </Avatar>
    );

  return BadgeProps ? (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      {...BadgeProps}
    >
      {renderContent}
    </Badge>
  ) : (
    renderContent
  );
});

CustomAvatar.propTypes = {
  sx: PropTypes.object,
  name: PropTypes.string,
  children: PropTypes.node,
  BadgeProps: PropTypes.object,
  color: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
  ]),
};

export default CustomAvatar;
