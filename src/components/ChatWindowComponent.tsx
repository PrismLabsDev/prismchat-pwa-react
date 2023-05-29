import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import apiUtil from '../services/apiUtil';
import prismClient from '../services/prismClient';
import { MdSend, MdDelete, MdModeEdit, MdChevronLeft, MdCall, MdVideocam } from 'react-icons/md';
import { toSvg } from 'jdenticon';

import { AppContext } from '../contexts/AppContext';

// Components
import ReceivedMessageComponent from './ReceivedMessageComponent';
import SentMessageComponent from './SentMessageComponent';
import OverlayComponent from './OverlayComponent';
import OverlayEditChatComponent from './OverlayEditChatComponent';
import OverlayDestroyChatComponent from './OverlayDestroyChatComponent';
import OverlayVoiceCallComponent from './OverlayVoiceCallComponent';
import OverlayVideoCallComponent from './OverlayVideoCallComponent';

const ChatWindowComponent = () => {
	const { 					
    chatWindowSelected,
    setChatWindowSelected,
    accessToken,
    setAccessToken,
    identityKeys,
    setIdentityKeys,
    server,
    setServer,
    boxKeys,
    setBoxKeys,
    chats,
    setChats,
    selectedChat,
    setSelectedChat, }: any =
	useContext(AppContext);

  const api = apiUtil.init(server?.host, accessToken);

	// State
	const [messages, setMessages]: any = useState([]);
	const [messageText, setMessageText] = useState('');
	const [avatar, setAvatar] = useState('');

	// State overlay
	const [openOverlayEdit, setOpenOverlayEdit]: any = useState(false);
	const [openOverlayDestroy, setOpenOverlayDestroy]: any = useState(false);
  const [openOverlayVoiceCall, setOpenOverlayVoiceCall]: any = useState(false);
  const [openOverlayVideoCall, setOpenOverlayVideoCall]: any = useState(false);

	// Refs
	const scrollElement: any = useRef(null);
	const inputElement: any = useRef(null);

	// Watch for message change in db
	const messageQuery: any = useLiveQuery(async () => {
		if (selectedChat) {
			const res = await db.message
				.where('pubkey')
				.equals(selectedChat.pubkey)
				.reverse()
				.limit(50)
				.offset(0)
				.sortBy('date');

			return res.reverse();
		} else {
			return [];
		}
	}, [selectedChat]);

	// On message change update state
	useEffect(() => {
		setMessages(messageQuery);
	}, [messageQuery]);

	// Run on selected chat change
	useEffect(() => {
		if (selectedChat) {
			setAvatar(toSvg(selectedChat.pubkey, 100));
		}
	}, [selectedChat]);

	// Scroll to bottom on message change
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const sendMessage = async (message: any) => {
		// add message to db
		const newMessageID = await db.message.add({
			pubkey: selectedChat.pubkey,
			date: Date.now(),
			type: 'M',
			data: message,
			sent: true,
		});
		setMessageText('');

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
		api
			.post('/message', {
				to: selectedChat.pubkey,
				data: encryptedData,
			})
			.catch(async () => {
				// If message does not send
				await db.message.where('id').equals(newMessageID).delete();
			});

		console.log('New Message Sent: ', {
			to: selectedChat.pubkey,
			message: message,
			encryptedData: encryptedData,
		});
	};

	const scrollToBottom = () => {
		if (scrollElement.current) {
			scrollElement.current.scrollTop = scrollElement.current.scrollHeight;
		}
	};

	return (
		<>
			{/* Header */}
			<div className="background">
				<div className="h-16 flex flex-row justify-between bg-zinc-900">
          {selectedChat ? (
            <>
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

                <div className='my-auto ml-2'>
                  <button
                    onClick={() => {
                      setOpenOverlayEdit(true);
                    }}
                  >
                    <MdModeEdit />
                  </button>
                </div>
                
              </div>
              <div className="flex flex-row my-auto space-x-2 mr-5">
                {selectedChat.receiveKey ? (
                  <>
                    <button
                      onClick={() => {
                        setOpenOverlayVoiceCall(true);
                      }}
                    >
                      <MdCall />
                    </button>

                    <button
                      onClick={() => {
                        setOpenOverlayVideoCall(true);
                      }}
                    >
                      <MdVideocam />
                    </button>
                  </>
                ) : (
                  <></>
                )}
                <button
                  onClick={() => {
                    setOpenOverlayDestroy(true);
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
				</div>

				{/* Message List */}
				<div className="flex flex-col h-[calc(100vh-64px)] justify-end">
					{selectedChat && selectedChat?.receiveKey ? (
						<>
							<div
								ref={scrollElement}
								className="flex flex-row overflow-scroll pb-0 overflow-x-hidden"
							>
								<div className="w-10/12 mx-auto">
									{messages?.map((message: any, index: any) => {
										if (message.sent) {
											return (
												<div key={index}>
													<SentMessageComponent
														text={message.data}
														sent={true}
													/>
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
											<textarea
												ref={inputElement}
												rows={1}
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
						</>
					) : (
						<></>
					)}
				</div>
			</div>

      {/* Overlay Voice Call */}
			<OverlayComponent show={openOverlayVoiceCall}>
				<OverlayVoiceCallComponent
					close={() => {
						setOpenOverlayVoiceCall(false);
					}}
				/>
			</OverlayComponent>

      {/* Overlay Video Call */}
			<OverlayComponent show={openOverlayVideoCall}>
				<OverlayVideoCallComponent
					close={() => {
						setOpenOverlayVideoCall(false);
					}}
				/>
			</OverlayComponent>

			{/* Overlay edit */}
			<OverlayComponent show={openOverlayEdit}>
				<OverlayEditChatComponent
					chat={selectedChat}
					close={() => {
						setOpenOverlayEdit(false);
					}}
				/>
			</OverlayComponent>

			{/* Overlay Destroy */}
			<OverlayComponent show={openOverlayDestroy}>
				<OverlayDestroyChatComponent
					chat={selectedChat}
					close={() => {
						setOpenOverlayDestroy(false);
					}}
				/>
			</OverlayComponent>
		</>
	);
};

export default ChatWindowComponent;
