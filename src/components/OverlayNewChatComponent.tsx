import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { db } from '../services/db';
import prismClient from '../services/prismClient';

import { AppContext } from '../contexts/AppContext';

const OverlayNewChatComponent = ({ close }: any) => {
	const { chatWindowSelected, setChatWindowSelected }: any =
		useContext(AppContext);

	const [newChatRecipient, setNewChatRecipient] = useState('');
	const [newChatName, setNewChatName] = useState('');

	const startNewChat = async (recipientPublicKey: string) => {
		const checkChat = await db.chat
			.where('pubkey')
			.equals(recipientPublicKey)
			.first();

		if (checkChat === undefined) {
			const prism: any = await prismClient.init();

			const sessionMasterKeys: any = prism.generateSessionKeys();

			await db.chat.add({
				name: newChatName,
				pubkey: recipientPublicKey,
				masterPublic: sessionMasterKeys.publicKey,
				masterPrivate: sessionMasterKeys.privateKey,
				sendCount: 0,
				sendKey: '',
				receiveKey: '',
				newMessage: false,
			});

			let layer2Up = prism.prismEncrypt_Layer2(
				'IC',
				0,
				null,
				sessionMasterKeys.publicKey,
				recipientPublicKey
			);
			let layer3Up = prism.prismEncrypt_Layer3(
				layer2Up.nonce,
				layer2Up.cypherText
			);
			let encryptedData = prism.prismEncrypt_Layer4(
				layer3Up.key,
				layer3Up.nonce,
				layer3Up.cypherText,
				recipientPublicKey
			);

			await api.post('/message', {
				to: recipientPublicKey,
				data: encryptedData,
			});
		} else {
			console.log('chat exists');
		}

		setNewChatRecipient('');
		setNewChatName('');
		close();
	};

	return (
		<>
			<p className="font-bold	text-3xl">New Chat</p>

			<div className="flex flex-col space-y-3">
				<div>
					<input
						className="input"
						placeholder="Chat Name"
						type="text"
						value={newChatName}
						onChange={(e: any) => {
							setNewChatName(e.target.value);
						}}
					/>
				</div>
				<div>
					<input
						className="input"
						placeholder="Recipient public key"
						type="text"
						value={newChatRecipient}
						onChange={(e: any) => {
							setNewChatRecipient(e.target.value);
						}}
					/>
				</div>
			</div>

			<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
				<button
					onClick={() => {
						startNewChat(newChatRecipient);
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

export default OverlayNewChatComponent;
