import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import api from '../services/api';
import prismClient from '../services/prismClient';
import { MdSend, MdDelete, MdModeEdit, MdChevronLeft } from 'react-icons/md';
import { toSvg } from 'jdenticon';

import { AppContext } from '../contexts/AppContext';

// Components
import ReceivedMessageComponent from './ReceivedMessageComponent';
import SentMessageComponent from './SentMessageComponent';
import OverlayComponent from './OverlayComponent';
import OverlayEditChatComponent from './OverlayEditChatComponent';
import OverlayDestroyChatComponent from './OverlayDestroyChatComponent';

const ChatWindowComponent = () => {
	const {
		chatWindowSelected,
		setChatWindowSelected,
		identityPublickey,
		selectedChat,
		setSelectedChat,
	}: any = useContext(AppContext);

	const [messages, setMessages]: any = useState([]);
	const [messageText, setMessageText] = useState('');
	const [avatar, setAvatar] = useState('');
	const [openOverlayEdit, setOpenOverlayEdit]: any = useState(false);
	const [openOverlayDestroy, setOpenOverlayDestroy]: any = useState(false);
	const [testAreaCols, setTextAreCols] = useState(1);

	const scrollElement: any = useRef(null);
	const inputElement: any = useRef(null);

	useLiveQuery(async () => {
		if (selectedChat) {
			const messageQuery: any = await db.message
				.where('pubkey')
				.equals(selectedChat.pubkey)
				.limit(50)
				.offset(0)
				.reverse()
				.sortBy('date');

			setMessages(messageQuery.reverse());
		}
	}, [selectedChat]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (selectedChat) {
			setAvatar(toSvg(selectedChat.pubkey, 100));
		}
	}, [selectedChat]);

	const sendMessage = async (message: any) => {
		const prism: any = await prismClient.init();

		// Update chat to increase count and modify send key
		let derivedSenKey = prism.sessionKeyDerivation(
			selectedChat.sendKey,
			selectedChat.sendCount + 1
		);
		await db.chat.update(selectedChat.pubkey, {
			sendCount: selectedChat.sendCount + 1,
		});

		// Perform Encryption
		let layer1Up = prism.prismEncrypt_Layer1(
			{
				message: message,
			},
			derivedSenKey
		);
		let layer2Up = prism.prismEncrypt_Layer2(
			'M',
			selectedChat.sendCount + 1,
			layer1Up.nonce,
			layer1Up.cypherText,
			selectedChat.pubkey
		);
		let layer3Up = prism.prismEncrypt_Layer3(
			layer2Up.nonce,
			layer2Up.cypherText
		);
		let encryptedData = prism.prismEncrypt_Layer4(
			layer3Up.key,
			layer3Up.nonce,
			layer3Up.cypherText,
			selectedChat.pubkey
		);

		// Send and save Message
		await api.post('/message', {
			to: selectedChat.pubkey,
			data: encryptedData,
		});

		await db.message.add({
			pubkey: selectedChat.pubkey,
			date: Date.now(),
			type: 'M',
			data: message,
			sent: true,
		});

		let updatedChatRecord: any = await db.chat
			.where('pubkey')
			.equals(selectedChat.pubkey)
			.first();

		console.log('New Message Sent: ', {
			to: selectedChat.pubkey,
			message: message,
			encryptedData: encryptedData,
		});

		setSelectedChat(updatedChatRecord);
		setMessageText('');
	};

	const scrollToBottom = () => {
		scrollElement.current.scrollTop = scrollElement.current.scrollHeight;
	};

	return (
		<>
			{/* Header */}
			<div className="background">
				<div className="h-16 flex flex-row justify-between bg-zinc-900">
					<div className="flex flex-row pl-2">
						<button
							className="px-3 block md:hidden"
							onClick={() => {
								setChatWindowSelected(!chatWindowSelected);
							}}
						>
							<MdChevronLeft />
						</button>
						<img
							className="p-1 mr-2 w-12"
							src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
							alt="avatar"
						/>

						<div className="flex flex-col my-auto">
							<p>{selectedChat?.name || ''}</p>
						</div>
					</div>
					<div className="flex flex-row my-auto space-x-2 mr-5">
						<button
							onClick={() => {
								setOpenOverlayEdit(true);
							}}
						>
							<MdModeEdit />
						</button>
						<button
							onClick={() => {
								setOpenOverlayDestroy(true);
							}}
						>
							<MdDelete />
						</button>
					</div>
				</div>

				{/* Message List */}
				<div className="flex flex-col h-[calc(100vh-64px)] justify-end">
					<div
						ref={scrollElement}
						className="flex flex-row overflow-scroll pb-0 overflow-x-hidden"
					>
						<div className="w-10/12 mx-auto">
							{messages.map((message: any, index: any) => {
								if (message.sent) {
									return (
										<div key={index}>
											<SentMessageComponent text={message.data} sent={true} />
										</div>
									);
								}
								return (
									<div key={index}>
										<ReceivedMessageComponent
											text={message.data}
											sent={false}
										/>
									</div>
								);
							})}
						</div>
					</div>

					{/* Text Area */}
					<div className="flex flex-row">
						<div className="w-10/12 mx-auto mt-5 mb-10 bg-zinc-900 rounded-[30px]">
							<div className="flex flex-row m-3 space-x-2">
								<div className="w-10/12 flex">
									{/* break-words overflow-y-scroll */}
									<textarea
										ref={inputElement}
										rows={testAreaCols}
										className="my-auto resize-none rounded-2xl bg-zinc-800 px-3 py-1 w-full outline-none"
										placeholder="Aa"
										value={messageText}
										onChange={(e) => {
											setMessageText(e.target.value);
										}}
										onKeyDown={(event) => {
											if (event.key === 'Enter') {
												event.preventDefault();
												sendMessage(messageText);
											}
										}}
									></textarea>
								</div>
								<div className="w-2/12 flex flex-col justify-end">
									<button
										className="rounded-full bg-gradient-to-r from-[#FF006E] to-[#3A86FF] w-full h-8"
										onClick={() => {
											sendMessage(messageText);
										}}
									>
										<MdSend className="mx-auto" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Overlay QR */}
			<OverlayComponent show={openOverlayEdit}>
				<OverlayEditChatComponent
					close={() => {
						setOpenOverlayEdit(false);
					}}
				/>
			</OverlayComponent>

			{/* Overlay Destroy */}
			<OverlayComponent show={openOverlayDestroy}>
				<OverlayDestroyChatComponent
					close={() => {
						setOpenOverlayDestroy(false);
					}}
				/>
			</OverlayComponent>
		</>
	);
};

export default ChatWindowComponent;
