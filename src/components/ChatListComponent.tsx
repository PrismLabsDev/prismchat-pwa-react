import React, { useEffect, useState, useContext } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import {
	MdQrCode2,
	MdOutlineKey,
	MdMessage,
	MdSwapHoriz,
	MdDelete,
} from 'react-icons/md';
import testChatData from '../testChatData';
import { toSvg } from 'jdenticon';

// Context
import { AppContext } from '../contexts/AppContext';

// components
import ChatCardComponent from './ChatCardComponent';
import RequestCardComponent from './RequestCardComponent';
import OverlayComponent from './OverlayComponent';
import OverlayQRComponent from './OverlayQRComponent';
import OverlayDestroyComponent from './OverlayDestroyComponent';
import OverlayExchangeComponent from './OverlayExchangeComponent';
import OverlayNewChatComponent from './OverlayNewChatComponent';
import OverlayRequestApprovalComponent from './OverlayRequestApprovalComponent';

const ChatListComponent = () => {
	const {
		chatWindowSelected,
		setChatWindowSelected,
		identityPublickey,
		selectedChat,
		setSelectedChat,
	}: any = useContext(AppContext);

	// Overlay toggle
	const [openOverlayQR, setOpenOverlayQR]: any = useState(false);
	const [openOverlayDestroy, setOpenOverlayDestroy]: any = useState(false);
	const [openOverlayExchange, setOpenOverlayExchange]: any = useState(false);
	const [openOverlayNew, setOpenOverlayNew]: any = useState(false);
	const [openOverlayRequestApproval, setOpenOverlayRequestApproval]: any =
		useState(false);

	// State
	const [chats, setChats]: any = useState([]);
	const [showChatList, setShowChatList]: any = useState(true);
	const [avatar, setAvatar] = useState('');
	const [selectedRequest, setSelectedRequest]: any = useState(null);

	useEffect(() => {
		setAvatar(toSvg(identityPublickey, 100));
	});

	const requests: any = useLiveQuery(async () => {
		return await db.request.toArray();
	});

	useLiveQuery(async () => {
		const chatQuery: any = await db.chat.toArray();
		const chatsTest = chatQuery.map((chat: any) => {
			if (selectedChat !== null) {
				if (selectedChat.pubkey === chat.pubkey) {
					chat.newMessage = false;
				}
			}
			return chat;
		});

		setChats(chatsTest);
	});

	useEffect(() => {
		if (selectedChat) {
			db.chat.update(selectedChat.pubkey, {
				newMessage: false,
			});
		}
	});

	return (
		<>
			<div className="flex flex-col border-r border-zinc-700 w-full">
				{/* Header */}
				<div className="flex flex-row items-center px-5 h-16 bg-zinc-900">
					<div className="basis-1/2 flex flex-row justify-start space-x-3">
						<button
							onClick={() => {
								setOpenOverlayQR(true);
							}}
						>
							<MdQrCode2 />
						</button>
						<button
							onClick={() => {
								navigator.clipboard.writeText(identityPublickey);
							}}
						>
							<MdOutlineKey />
						</button>
					</div>
					<div className="basis-1/2 flex flex-row justify-end space-x-3">
						<button
							onClick={() => {
								setOpenOverlayDestroy(true);
							}}
						>
							<MdDelete />
						</button>
						<button
							onClick={() => {
								setOpenOverlayExchange(true);
							}}
						>
							<MdSwapHoriz />
						</button>
						<button
							onClick={() => {
								setOpenOverlayNew(true);
							}}
						>
							<MdMessage />
						</button>
					</div>
				</div>

				{/* Scroll window */}
				<div className="h-[calc(100vh-64px)] overflow-scroll overflow-x-hidden bg-gradient-to-t from-zinc-900 to-zinc-800">
					{/* Chat & Request selector */}
					<div className="flex flex-col">
						<div className="mx-auto p-5">
							<button
								onClick={() => {
									navigator.clipboard.writeText(identityPublickey);
								}}
							>
								<img
									className="p-1 w-20"
									src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
									alt="avatar"
								/>
							</button>
						</div>
						<div className="flex flex-row mb-3">
							<div className="w-1/2 w-full">
								<button
									className="w-full"
									onClick={() => {
										setShowChatList(true);
									}}
								>
									Chats
								</button>
							</div>
							<div className="w-1/2 w-full">
								<button
									className="w-full"
									onClick={() => {
										setShowChatList(false);
									}}
								>
									Requests
								</button>
							</div>
						</div>
					</div>

					{/* Lists */}
					<div>
						{showChatList ? (
							// chats
							<div className="flex flex-col space-y-2 p-2">
								{chats.map((chat: any, index: any) => {
									return (
										<button
											key={index}
											onClick={() => {
												setSelectedChat(chat);
												setChatWindowSelected(false);
											}}
										>
											<ChatCardComponent chat={chat} />
										</button>
									);
								})}
							</div>
						) : (
							// Requests
							<div className="flex flex-col space-y-2 p-2">
								{requests?.map((request: any, index: any) => {
									return (
										<button
											key={index}
											onClick={() => {
												setSelectedRequest(request);
												setOpenOverlayRequestApproval(true);
											}}
										>
											<RequestCardComponent request={request} />
										</button>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Overlay QR */}
			<OverlayComponent show={openOverlayQR}>
				<OverlayQRComponent
					close={() => {
						setOpenOverlayQR(false);
					}}
				/>
			</OverlayComponent>

			{/* Overlay Destroy */}
			<OverlayComponent show={openOverlayDestroy}>
				<OverlayDestroyComponent
					close={() => {
						setOpenOverlayDestroy(false);
					}}
				/>
			</OverlayComponent>

			{/* Overlay Exchange */}
			<OverlayComponent show={openOverlayExchange}>
				<OverlayExchangeComponent
					close={() => {
						setOpenOverlayExchange(false);
					}}
				/>
			</OverlayComponent>

			{/* Overlay New */}
			<OverlayComponent show={openOverlayNew}>
				<OverlayNewChatComponent
					close={() => {
						setOpenOverlayNew(false);
					}}
				/>
			</OverlayComponent>

			{/* Overlay Request Approval */}
			<OverlayComponent show={openOverlayRequestApproval}>
				<OverlayRequestApprovalComponent
					request={selectedRequest}
					close={() => {
						setSelectedRequest(null);
						setOpenOverlayRequestApproval(false);
					}}
				/>
			</OverlayComponent>
		</>
	);
};

export default ChatListComponent;
