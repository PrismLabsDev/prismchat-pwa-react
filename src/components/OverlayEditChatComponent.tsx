import React, { useEffect, useState, useContext } from 'react';
import { db } from '../services/db';

import { AppContext } from '../contexts/AppContext';

const OverlayEditChatComponent = ({ chat, close }: any) => {
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

	const [newChatName, setNewChatName] = useState('');

	const updateChat = () => {
		db.chat.update(chat.pubkey, {
			name: newChatName,
		});

		selectedChat.name = newChatName;
		setSelectedChat(selectedChat);
	};

	return (
		<>
			<p className="font-bold	text-3xl">Edit Chat</p>
			<div>
				<input
					className="input"
					placeholder="New Chat Name"
					type="text"
					value={newChatName}
					onChange={(e: any) => {
						setNewChatName(e.target.value);
					}}
				/>
			</div>
			<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
				<button
					onClick={() => {
						updateChat();
						close();
					}}
				>
					Accept
				</button>
				<button
					onClick={() => {
						close();
					}}
				>
					Close
				</button>
			</div>
		</>
	);
};

export default OverlayEditChatComponent;
