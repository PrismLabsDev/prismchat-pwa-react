import React, { useEffect, useState } from 'react';
import testChatData from '../testChatData';

import ChatCardComponent from './ChatCardComponent';

const ChatListComponent = () => {
	const [chats, setChats]: any = useState([]);

	useEffect(() => {
		setChats(testChatData);
	}, [chats]);

	return (
		<>
			<div className="flex flex-col space-y-2 p-2 h-[calc(100vh-64px)] overflow-scroll overflow-x-hidden border-r border-zinc-700">
				{chats.map((chat: any, index: any) => {
					return (
						<div key={index}>
							<ChatCardComponent
								name={chat.name}
								newMessage={chat.newMessage}
								lastMessage={chat.lastMessage}
								index={index}
							/>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default ChatListComponent;
