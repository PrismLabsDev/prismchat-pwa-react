import React, { useEffect, useState, useContext } from 'react';
import { db } from '../services/db';

import { AppContext } from '../contexts/AppContext';

const OverlayDestroyChatComponent = ({ chat, close }: any) => {
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

	const destroyChat = async () => {
		setSelectedChat(null);
		await db.chat.where('pubkey').equals(chat.pubkey).delete();
		await db.message.where('pubkey').equals(chat.pubkey).delete();
	};

	return (
		<>
			<p className="font-bold	text-3xl">Destroy Chat</p>
			<p className="font-bold">
				This will destroy the current chat and all associated data, including
				keys and messages.
			</p>
			<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
				<button
					onClick={() => {
						destroyChat();
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

export default OverlayDestroyChatComponent;
