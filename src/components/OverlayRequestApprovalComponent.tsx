import React, { useEffect, useState, useContext } from 'react';
import { toSvg } from 'jdenticon';
import api from '../services/api';
import { db } from '../services/db';
import prismClient from '../services/prismClient';

import { AppContext } from '../contexts/AppContext';

const OverlayRequestApprovalComponent = ({ request, close }: any) => {
	const [avatar, setAvatar] = useState('');
	const [requestChatName, setRequestChatName]: any = useState('');

	useEffect(() => {
		setAvatar(toSvg(request.pubkey, 100));
	});

	const acceptRequest = async () => {
		const prism: any = await prismClient.init();

		// Generate session keys
		const sessionMasterKeys: any = prism.generateSessionKeys();
		const { sendKey, receiveKey } = prism.generateSharedSessionKeysInitial(
			sessionMasterKeys.publicKey,
			sessionMasterKeys.privateKey,
			request.receivedPublic
		);

		await db.chat.add({
			name: requestChatName,
			pubkey: request.pubkey,
			masterPublic: sessionMasterKeys.publicKey,
			masterPrivate: sessionMasterKeys.privateKey,
			sendCount: 0,
			sendKey: sendKey,
			receiveKey: receiveKey,
			newMessage: false,
		});

		// Send RC
		let layer2Up = prism.prismEncrypt_Layer2(
			'RC',
			0,
			null,
			sessionMasterKeys.publicKey,
			request.pubkey
		);
		let layer3Up = prism.prismEncrypt_Layer3(
			layer2Up.nonce,
			layer2Up.cypherText
		);
		let encryptedData = prism.prismEncrypt_Layer4(
			layer3Up.key,
			layer3Up.nonce,
			layer3Up.cypherText,
			request.pubkey
		);

		await db.request.delete(request.pubkey);

		await api.post('/message', {
			to: request.pubkey,
			data: encryptedData,
		});

		setRequestChatName('');
		close();
	};

	const declineRequest = async () => {
		await db.request.delete(request.pubkey);
		setRequestChatName('');
		close();
	};
	return (
		<>
			<p className="font-bold	text-3xl">Request</p>
			<div>
				<img
					className="p-1 w-20 mx-auto"
					src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
					alt="avatar"
				/>
				<p className="break-words">{request.pubkey}</p>
			</div>
			<div>
				<input
					className="input"
					placeholder="New Chat Name"
					type="text"
					value={requestChatName}
					onChange={(e: any) => {
						setRequestChatName(e.target.value);
					}}
				/>
			</div>
			<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
				<button
					onClick={() => {
						acceptRequest();
					}}
				>
					Accept
				</button>
				<button
					onClick={() => {
						declineRequest();
					}}
				>
					Decline
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

export default OverlayRequestApprovalComponent;
