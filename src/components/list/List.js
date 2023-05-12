import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { List, ListSubheader, ListItem, ListItemText, ListItemIcon } from '@mui/material';
// components
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const CustomList = forwardRef(({ icon, takeaways, listSubheader, sx, ...other }, ref) => (
    <List
        sx={{ width: '100%' }}
        aria-labelledby="nested-list-subheader"
        subheader={
        <ListSubheader component="div" id="nested-list-subheader">
            {listSubheader}
        </ListSubheader>
        }
    >
        {Array.isArray(takeaways) && takeaways.map((takeaway, index) => (
            <ListItem key={index} sx={{ display: "flex", alignItems: "flex-start" }}>
                <ListItemIcon>
                    <Iconify icon={icon ? icon : "eva:arrow-forward-outline"} />
                </ListItemIcon>
                <ListItemText key={index} primary={takeaway.text} />
            </ListItem>
        ))}
    </List>
));

CustomList.propTypes = {
    sx: PropTypes.object,
    icon: PropTypes.node,
    takeaways: PropTypes.arrayOf(PropTypes.object),
    listSubheader: PropTypes.string,
};

CustomList.defaultProps = {
    takeaways: [],
};

export default CustomList;
