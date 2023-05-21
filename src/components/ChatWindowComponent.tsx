import React, { useEffect, useState } from 'react';
import { MdSend } from 'react-icons/md';
import testMessageData from '../testMessageData';

// Components
import ReceivedMessageComponent from './ReceivedMessageComponent';
import SentMessageComponent from './SentMessageComponent';

const ChatWindowComponent = () => {
	const [messages, setMessages]: any = useState([]);
	const [messageText, setMessageText] = useState('');

	useEffect(() => {
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
	};

	const scrollToBottom = () => {
		let scrollingElement: any = document.querySelector('#messageList');
		scrollingElement.scrollTop = scrollingElement.scrollHeight;
	};

	return (
		<>
			<div className="flex flex-col h-[calc(100vh-64px)]">
				<div
					id="messageList"
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
									<ReceivedMessageComponent text={message.text} sent={false} />
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
		</>
	);
};

export default ChatWindowComponent;
