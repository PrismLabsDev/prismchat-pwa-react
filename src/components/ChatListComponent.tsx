import React, { useEffect, useState, useContext } from 'react';
import {
	MdQrCode2,
	MdOutlineKey,
	MdMessage,
	MdSwapHoriz,
	MdDelete,
} from 'react-icons/md';
import testChatData from '../testChatData';

import { AppContext } from '../contexts/AppContext';

import ChatCardComponent from './ChatCardComponent';
import OverlayComponent from './OverlayComponent';

const ChatListComponent = () => {
	const { onChats, setOnChats }: any = useContext(AppContext);

	const [chats, setChats]: any = useState([]);
	const [open, setOpen]: any = useState(false);

	useEffect(() => {
		setChats(testChatData);
	}, [chats]);

	return (
		<>
			<div className="flex flex-col border-r border-zinc-700 w-full">
				<div className="flex flex-row items-center px-5 h-16 bg-zinc-900">
					<div className="basis-1/2 flex flex-row justify-start space-x-3">
						<button>
							<MdQrCode2 />
						</button>
						<button>
							<MdOutlineKey />
						</button>
					</div>
					<div className="basis-1/2 flex flex-row justify-end space-x-3">
						<button>
							<MdDelete />
						</button>
						<button>
							<MdSwapHoriz />
						</button>
						<button>
							<MdMessage />
						</button>
					</div>
				</div>
				<div className="bg-gradient-to-t from-zinc-900	to-zinc-800">
					<div className="flex flex-col space-y-2 p-2 h-[calc(100vh-64px)] overflow-scroll overflow-x-hidden">
						{chats.map((chat: any, index: any) => {
							return (
								<button
									key={index}
									onClick={() => {
										setOnChats(false);
									}}
								>
									<ChatCardComponent
										name={chat.name}
										newMessage={chat.newMessage}
										lastMessage={chat.lastMessage}
										index={index}
									/>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<OverlayComponent show={open}>
				<p>Test List Component</p>
				<button
					onClick={() => {
						setOpen(false);
					}}
				>
					CLOSE
				</button>
			</OverlayComponent>
		</>
	);
};

export default ChatListComponent;
