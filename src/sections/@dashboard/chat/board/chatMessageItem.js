// @mui
import { Avatar, Typography, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function ChatMessageItem({ message, conversation }) {

    const currentUser = 'me';

    return (
        <Stack direction="row" justifyContent={currentUser ? 'flex-end' : 'unset'} sx={{ mb: 3 }}>
            {!currentUser && (
            <Avatar
                alt="name"
                src="https://source.unsplash.com/random"
                sx={{ width: 32, height: 32, mr: 2 }}
            />
            )}
        
            <Stack spacing={1} alignItems="flex-end">
                <Typography
                noWrap
                variant="caption"
                sx={{
                    color: 'text.disabled',
                    ...(!currentUser && {
                        mr: 'auto',
                    }),
                }}
                >
                    Me
                </Typography>
        
                <Stack
                    sx={{
                        p: 2,
                        minWidth: 48,
                        maxWidth: 620,
                        borderRadius: 2,
                        borderTopRightRadius: currentUser ? 2 : 0,
                        borderTopLeftRadius: currentUser ? 0 : 2,
                        overflow: 'hidden',
                        typography: 'body2',
                        bgcolor: 'background.neutral',
                        ...(currentUser && {
                            color: 'grey.800',
                            bgcolor: 'primary.lighter',
                        }),
                    }}
                >
                    {message}
                </Stack>
            </Stack>
        </Stack>
    );
}