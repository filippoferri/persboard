import { useRef } from 'react';
import Scrollbar from '../../../../components/scrollbar';
//
import ChatMessageItem from './chatMessageItem';

// ----------------------------------------------------------------------

export default function ChatMessageList({ conversation }) {

    const scrollRef = useRef(null);

    return (
        <Scrollbar
            scrollableNodeProps={{
                ref: scrollRef,
            }}
            sx={{ p: 3, height: 1 }}
        >
                <ChatMessageItem
                    message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque augue et turpis condimentum, vel luctus nulla luctus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In congue dolor at elementum iaculis. Mauris vitae ex vitae lacus ullamcorper ultricies. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ullamcorper urna in velit eleifend aliquam. Praesent non laoreet elit. Nunc efficitur ullamcorper mauris id efficitur. Aliquam vel sem pulvinar, fringilla nulla sit amet, venenatis nibh. Mauris interdum ornare cursus. "
                    conversation="qua bene"
                />

<ChatMessageItem
                    message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque augue et turpis condimentum, vel luctus nulla luctus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In congue dolor at elementum iaculis. Mauris vitae ex vitae lacus ullamcorper ultricies. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ullamcorper urna in velit eleifend aliquam. Praesent non laoreet elit. Nunc efficitur ullamcorper mauris id efficitur. Aliquam vel sem pulvinar, fringilla nulla sit amet, venenatis nibh. Mauris interdum ornare cursus. "
                    conversation="qua bene"
                />

<ChatMessageItem
                    message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque augue et turpis condimentum, vel luctus nulla luctus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In congue dolor at elementum iaculis. Mauris vitae ex vitae lacus ullamcorper ultricies. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ullamcorper urna in velit eleifend aliquam. Praesent non laoreet elit. Nunc efficitur ullamcorper mauris id efficitur. Aliquam vel sem pulvinar, fringilla nulla sit amet, venenatis nibh. Mauris interdum ornare cursus. "
                    conversation="qua bene"
                />

<ChatMessageItem
                    message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut scelerisque augue et turpis condimentum, vel luctus nulla luctus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In congue dolor at elementum iaculis. Mauris vitae ex vitae lacus ullamcorper ultricies. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ullamcorper urna in velit eleifend aliquam. Praesent non laoreet elit. Nunc efficitur ullamcorper mauris id efficitur. Aliquam vel sem pulvinar, fringilla nulla sit amet, venenatis nibh. Mauris interdum ornare cursus. "
                    conversation="qua bene"
                />

        </Scrollbar>
    );
}