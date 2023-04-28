import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { List, ListSubheader, ListItem, ListItemText, ListItemIcon } from '@mui/material';
// components
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const PlusMinusList = forwardRef(({ plusMinus, listSubheader, icon, sx, ...other }, ref) => (
    <List
        sx={{ width: '100%' }}
        aria-labelledby="nested-list-subheader"
        subheader={
        <ListSubheader component="div" id="nested-list-subheader">
            {listSubheader}
        </ListSubheader>
        }
    >
        {Array.isArray(plusMinus) && plusMinus.map((plusMinusItem, plusminusIndex) => (
            <ListItem key={plusminusIndex} sx={{ display: "flex", alignItems: "flex-start" }}>
                <ListItemIcon>
                    <Iconify icon={`eva:${icon}-outline`} />
                </ListItemIcon>
                <ListItemText primary={plusMinusItem} />
            </ListItem>
        ))}
    </List>
));

PlusMinusList.propTypes = {
    sx: PropTypes.object,
    plusMinus: PropTypes.arrayOf(PropTypes.object),
    icon: PropTypes.string,
    listSubheader: PropTypes.string,
};

PlusMinusList.defaultProps = {
    plusMinus: [],
};

export default PlusMinusList;
