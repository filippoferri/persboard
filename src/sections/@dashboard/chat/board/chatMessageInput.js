import { useRef, useState } from 'react';
// @mui
import { Stack, InputBase, IconButton, InputAdornment } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

export default function MessageInput() {

    const fileInputRef = useRef(null);

    const [message, setMessage] = useState('');

    const handleClickAttach = () => {
        fileInputRef.current?.click();
    };

    return (
        <InputBase
            value={message}
            placeholder="Type a message"
            onChange={(event) => setMessage(event.target.value)}
            endAdornment={
                <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 2.5 }}>
                    <IconButton size="small">
                        <Iconify icon="eva:paper-plane-outline" />
                    </IconButton>
                </Stack>
            }
            sx={{
                pl: 2.5,
                height: 56,
                flexShrink: 0,
                borderTop: (theme) => `solid 1px ${theme.palette.divider}`}}
        />
    );
}


