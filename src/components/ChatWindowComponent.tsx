import React, { useEffect, useState, useContext, useRef } from 'react';
import { MdSend, MdDelete, MdModeEdit, MdChevronLeft } from 'react-icons/md';
import { toSvg } from 'jdenticon';
import testMessageData from '../testMessageData';

import { AppContext } from '../contexts/AppContext';

// Components
import ReceivedMessageComponent from './ReceivedMessageComponent';
import SentMessageComponent from './SentMessageComponent';
import OverlayComponent from './OverlayComponent';
import OverlayEditChatComponent from './OverlayEditChatComponent';
import OverlayDestroyChatComponent from './OverlayDestroyChatComponent';

const ChatWindowComponent = () => {
	const { onChats, setOnChats }: any = useContext(AppContext);

	const [messages, setMessages]: any = useState([]);
	const [messageText, setMessageText] = useState('');
	const [avatar, setAvatar] = useState('');
	const [openOverlayEdit, setOpenOverlayEdit]: any = useState(false);
	const [openOverlayDestroy, setOpenOverlayDestroy]: any = useState(false);
	const [testAreaCols, setTextAreCols] = useState(1);

	const scrollElement: any = useRef(null);
	const inputElement: any = useRef(null);

	useEffect(() => {
		setAvatar(toSvg('ex', 100));
		setMessages([...testMessageData].reverse());
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const sendMessage = () => {
		if (messageText !== '') {
			setMessages([
				...messages,
				{
					text: messageText,
					sent: true,
				},
			]);
		}
		setMessageText('');

		if (inputElement.current) {
			inputElement.current.focus();
		}
	};

	const scrollToBottom = () => {
		scrollElement.current.scrollTop = scrollElement.current.scrollHeight;
	};

	return (
		<>
			{/* h-screen */}
			<div className="background">
				<div className="h-16 flex flex-row justify-between bg-zinc-900">
					<div className="flex flex-row pl-2">
						<button
							className="px-3 block md:hidden"
							onClick={() => {
								setOnChats(!onChats);
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
							<p>ex</p>
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
				<div className="flex flex-col h-[calc(100vh-64px)]">
					<div
						ref={scrollElement}
						className="flex flex-row overflow-scroll pb-0 overflow-x-hidden"
					>
						<div className="w-10/12 mx-auto">
							{messages.map((message: any, index: any) => {
								if (message.sent) {
									return (
										<div key={index}>
											<SentMessageComponent text={message.text} sent={true} />
										</div>
									);
								}
								return (
									<div key={index}>
										<ReceivedMessageComponent
											text={message.text}
											sent={false}
										/>
									</div>
								);
							})}
						</div>
					</div>

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
											// let currentCols =
											// 	(inputElement.current.scrollHeight - 32) / 24;
											// console.log(currentCols);
											// if (currentCols < 3) {
											// 	setTextAreCols(currentCols + 1);
											// }
										}}
										onKeyUp={(event) => {
											if (event.key === 'Enter') {
												sendMessage();
											}
										}}
									></textarea>
								</div>
								<div className="w-2/12 flex flex-col justify-end">
									<button
										className="rounded-full bg-gradient-to-r from-[#FF006E] to-[#3A86FF] w-full h-8"
										onClick={() => {
											sendMessage();
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
