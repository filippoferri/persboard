// @mui
import { Stack, Typography, IconButton } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

export default function ChatHeader() {

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                backgroundColor: "grey.200",
                height: 65,
                p: 2.5,
                borderBottom:1, 
                borderColor: "grey.300"
            }}
            >
                <Stack flexGrow={1}>
                    <Typography sx={{ fontWeight: "bold" , color: "grey.600"}}>Discussion</Typography>
                </Stack>

                <IconButton>
                    <Iconify icon="eva:refresh-outline" />
                </IconButton>

                <IconButton>
                    <Iconify icon="eva:save-outline" />
                </IconButton>

        </Stack>
    );
}
