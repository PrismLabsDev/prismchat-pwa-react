import React, { useEffect, useState } from 'react';
import { AppContext } from './contexts/AppContext';
import { db } from './services/db';
import authUtil from './services/authUtil';
import prismClient from './services/prismClient';

// Components
import ChatListComponent from './components/ChatListComponent';
import ChatWindowComponent from './components/ChatWindowComponent';
import OverlayComponent from './components/OverlayComponent';

function App() {
	const [chatWindowSelected, setChatWindowSelected] = useState(true);
	const [identityKeys, setIdentityKeys] = useState(null);
	const [chats, setChats] = useState(null);
	const [selectedChat, setSelectedChat]: any = useState(null);

	// Overlay state
	const [openOverlayInit, setOpenOverlayInit] = useState(false);

	// Set identity keys
	useEffect(() => {
		(async function () {
			let identityKeysCheck = await db.general
				.where('name')
				.equals('IdentityKeys')
				.first();

			if (!identityKeysCheck) {
				setOpenOverlayInit(true);
			} else {
				setIdentityKeys(identityKeysCheck.value);
			}
		})();
	}, []);

	// Set chat list
	useEffect(() => {
		(async function () {
			const chatQuery: any = await db.chat.toArray();
			if (chatQuery) {
				const chatList = chatQuery.map((chat: any) => {
					if (selectedChat !== null) {
						if (selectedChat.pubkey === chat.pubkey) {
							chat.newMessage = false;
						}
					}
					return chat;
				});

				setChats(chatList);
				setSelectedChat(chatList[0]);
			}
		})();
	}, []);

	const createNewAccount: any = async () => {
		// Create new account & IdentityKeys
		const prism: any = await prismClient.init();
		await db.general.add({
			name: 'IdentityKeys',
			value: prism.IdentityKeys,
		});

		setIdentityKeys(prism.IdentityKeys);

		// Create new box keys
		const prismBox: any = await prismClient.init();
		const generatedBoxKeys = prismBox.generateIdentityKeys();
		await db.general.add({
			name: 'BoxKeys',
			value: generatedBoxKeys,
		});

		// Authenticate
		const { cypherText, nonce } = await authUtil.request();
		const access_token = await authUtil.verify(cypherText, nonce);
		localStorage.setItem('access_token', access_token);

		// Close creation dialogue
		setOpenOverlayInit(false);
	};

	return (
		<>
			<AppContext.Provider
				value={{
					chatWindowSelected,
					setChatWindowSelected,
					identityKeys,
					setIdentityKeys,
					chats,
					setChats,
					selectedChat,
					setSelectedChat,
				}}
			>
				<div className="bg-zinc-900 h-screen text-white">
					<main className="h-full">
						{/* Desktop */}
						<div className="hidden md:flex flex-row">
							<div className="w-1/3 lg:w-1/4">
								<ChatListComponent />
							</div>
							<div className="w-2/3 lg:w-3/4">
								<ChatWindowComponent />
							</div>
						</div>
						{/* Mobile */}
						<div className="block md:hidden w-full">
							{chatWindowSelected ? (
								<ChatListComponent />
							) : (
								<ChatWindowComponent />
							)}
						</div>
					</main>
				</div>

				{/* New account overlay */}
				<OverlayComponent show={openOverlayInit}>
					<p className="font-bold	text-3xl">Setup</p>
					<p>
						We did not find any Prism keys in this browser. Do we have your
						permission to generate keys for you to start using the Prism Chat
						service?
					</p>
					<p className="font-bold">
						This application is for demonstration purposes ONLY!
					</p>
					<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
						<button
							onClick={() => {
								createNewAccount();
							}}
						>
							Accept
						</button>
						<button
							onClick={() => {
								setOpenOverlayInit(false);
							}}
						>
							Close
						</button>
					</div>
				</OverlayComponent>
			</AppContext.Provider>
		</>
	);
}

export default App;
