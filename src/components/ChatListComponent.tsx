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

import OverlayQRComponent from './OverlayQRComponent';
import OverlayDestroyComponent from './OverlayDestroyComponent';
import OverlayExchangeComponent from './OverlayExchangeComponent';
import OverlayNewChatComponent from './OverlayNewChatComponent';

const ChatListComponent = () => {
	const { onChats, setOnChats, identityPublickey }: any =
		useContext(AppContext);

	const [chats, setChats]: any = useState([]);
	const [openOverlayQR, setOpenOverlayQR]: any = useState(false);
	const [openOverlayDestroy, setOpenOverlayDestroy]: any = useState(false);
	const [openOverlayExchange, setOpenOverlayExchange]: any = useState(false);
	const [openOverlayNew, setOpenOverlayNew]: any = useState(false);

	useEffect(() => {
		setChats(testChatData);
	}, [chats]);

	return (
		<>
			<div className="flex flex-col border-r border-zinc-700 w-full">
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
		</>
	);
};

export default ChatListComponent;
