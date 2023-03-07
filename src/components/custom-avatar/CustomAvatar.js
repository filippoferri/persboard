import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Badge, Avatar } from '@mui/material';

// ----------------------------------------------------------------------

const getCharAtName = (name) => name && name.charAt(0).toUpperCase();

const getColorByName = (name) => {
  if (['A', 'N', 'H', 'L', 'Q'].includes(getCharAtName(name))) return '#847EBA';
  if (['F', 'G', 'T', 'I', 'J'].includes(getCharAtName(name))) return '#ECCB3F';
  if (['K', 'D', 'Y', 'B', 'O'].includes(getCharAtName(name))) return '#87C450';
  if (['P', 'E', 'R', 'S', 'U'].includes(getCharAtName(name))) return '#EC7D4F';
  if (['V', 'W', 'X', 'M', 'Z'].includes(getCharAtName(name))) return '#005C80';
  return '#6CF2FD';
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
