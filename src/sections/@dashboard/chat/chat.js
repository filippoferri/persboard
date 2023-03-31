import { Card, Container, Stack } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// subsections
import ChatDrawer from './board/chatDrawer';
import ChatHeader from './board/chatHeader';
import MessageInput from './board/chatMessageInput';
import ChatMessageList from './board/chatMessageList';

export default function Chat() {
    const { themeStretch } = useSettingsContext();

    return (
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Chat"
                links={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                { name: 'Chat' },
                ]}
            />
        
            <Card sx={{ height: '75vh', display: 'flex' }}>

                <ChatDrawer />

                <Stack flexGrow={1} sx={{ overflow: 'hidden' }}>

                    <ChatHeader />
        
                    <Stack
                        direction="row"
                        flexGrow={1}
                        sx={{
                            overflow: 'hidden',
                        }}
                    >
                        <Stack flexGrow={1} sx={{ minWidth: 0 }}>
                            <ChatMessageList />
                            <MessageInput />
                        </Stack>

                    </Stack>
                    
                </Stack>
            </Card>
        </Container>
    );
}