import React, { useEffect, useState, useContext, useRef } from 'react';
import { MdSend, MdDelete, MdModeEdit, MdChevronLeft } from 'react-icons/md';
import { toSvg } from 'jdenticon';
import testMessageData from '../testMessageData';

import { AppContext } from '../contexts/AppContext';

// Components
import ReceivedMessageComponent from './ReceivedMessageComponent';
import SentMessageComponent from './SentMessageComponent';

const ChatWindowComponent = () => {
	const { onChats, setOnChats }: any = useContext(AppContext);

	const [messages, setMessages]: any = useState([]);
	const [messageText, setMessageText] = useState('');
	const [avatar, setAvatar] = useState('');

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
					<div className="flex flex-row">
						<button
							className="px-5 block md:hidden"
							onClick={() => {
								setOnChats(true);
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
					<div className="flex flex-row my-auto mr-5 space-x-2">
						<button>
							<MdModeEdit />
						</button>
						<button>
							<MdDelete />
						</button>
					</div>
				</div>
				<div className="flex flex-col h-[calc(100vh-64px)]">
					<div
						ref={scrollElement}
						className="flex flex-row overflow-scroll pb-0 overflow-x-hidden"
					>
						<div className="basis-10/12 mx-auto">
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
						<div className="basis-10/12 w-full mx-auto mt-5 mb-10 bg-zinc-900 rounded-full">
							<div className="flex flex-row my-3 mx-3 space-x-2">
								<div className="basis-10/12">
									<input
										ref={inputElement}
										autoFocus
										className="rounded-full bg-zinc-800 px-3 py-1 w-full outline-none"
										placeholder="Aa"
										type="text"
										value={messageText}
										onChange={(e) => {
											setMessageText(e.target.value);
										}}
										onKeyUp={(event) => {
											if (event.key === 'Enter') {
												sendMessage();
											}
										}}
									/>
								</div>
								<div className="basis-2/12 flex flex-row justify-center">
									<button
										className="rounded-full bg-gradient-to-r from-[#FF006E] to-[#3A86FF] w-full"
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
		</>
	);
};

export default ChatWindowComponent;
