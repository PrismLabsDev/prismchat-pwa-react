import React, { useEffect, useState, useContext } from 'react';
import { db } from '../services/db';
import { toSvg } from 'jdenticon';

// Context
import { AppContext } from '../contexts/AppContext';

const ChatCardComponent = ({ chat }: any) => {
	const {
		chatWindowSelected,
		setChatWindowSelected,
		identityKeys,
		setIdentityKeys,
		chats,
		setChats,
		selectedChat,
		setSelectedChat,
	}: any = useContext(AppContext);

	// State
	const [avatar, setAvatar] = useState('');
	const [selected, setSelected] = useState(false);

	// Run on selected chat change
	useEffect(() => {
		if (selectedChat) {
			if (selectedChat.pubkey === chat.pubkey) {
				setSelected(true);
				db.chat.update(selectedChat.pubkey, {
					newMessage: false,
				});
			} else {
				setSelected(false);
			}
		}
		setAvatar(toSvg(chat.pubkey, 100));
	}, [selectedChat, chat]);

	return (
		<>
			<div
				className={`${
					selected ? 'outline outline-zinc-600' : ''
				} bg-zinc-900 rounded-2xl py-2 px-2 w-full`}
			>
				<div className="flex flex-row my-auto max-w-full space-x-3">
					{/* image */}
					<div className="flex-none my-auto">
						<img
							className="p-1 w-12"
							src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
							alt="avatar"
						/>
					</div>
					{/* text */}
					<div className="flex-grow flex flex-col my-auto w-full overflow-hidden">
						<p className="text-left truncate">{chat.name}</p>
						<p className="text-left text-sm text-zinc-400 truncate">{'test'}</p>
					</div>
					{/* new msg */}
					<div className="flex-none w-6 m-auto">
						{chat.newMessage && (
							<span className="block bg-gradient-to-b from-[#FF006E] to-[#3A86FF] rounded-full w-4 h-4"></span>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ChatCardComponent;
