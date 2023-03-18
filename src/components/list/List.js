import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { List, ListSubheader, ListItem, ListItemText } from '@mui/material';
// components
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

const CustomList = forwardRef(
({ icon, takeaways, listSubheader, sx, ...other }, ref) => {
    return (
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
                <ListItem sx={{ display: "flex", alignItems: "center" }}>
                    <Iconify icon="eva:arrow-forward-outline" sx={{ mr: 1 }} />
                    <ListItemText key={index} primary={takeaway.text} />
                </ListItem>
            ))}
        </List>
    );
}
);

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
