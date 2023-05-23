import React, { useEffect, useState, useContext } from 'react';
import { toSvg } from 'jdenticon';

// Context
import { AppContext } from '../contexts/AppContext';

const RequestCardComponent = ({ request }: any) => {
	const {
		chatWindowSelected,
		setChatWindowSelected,
		identityPublickey,
		selectedChat,
		setSelectedChat,
	}: any = useContext(AppContext);

	const [avatar, setAvatar] = useState('');
	const [selected, setSelected] = useState(false);

	useEffect(() => {
		console.log(request);
		// if (selectedChat) {
		// 	if (selectedChat.pubkey === chat.pubkey) {
		// 		setSelected(true);
		// 	}
		// }
		setAvatar(toSvg(request.pubkey, 100));
	});

	return (
		<>
			<div className={`bg-zinc-900 rounded-2xl py-2 px-2 w-full`}>
				<div className="flex flex-row my-auto max-w-full space-x-3">
					<div className="flex-none my-auto">
						<img
							className="p-1 w-12"
							src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
							alt="avatar"
						/>
					</div>
					<div className="flex-grow flex flex-col my-auto w-full overflow-hidden">
						<p className="text-left truncate">{request.pubkey}</p>
						{/* <p className="text-left text-sm text-zinc-400 truncate">{'test'}</p> */}
					</div>
					{/* <div className="flex-none w-6 m-auto">
						{chat.newMessage && (
							<span className="block bg-gradient-to-b from-[#FF006E] to-[#3A86FF] rounded-full w-4 h-4"></span>
						)}
					</div> */}
				</div>
			</div>
		</>
	);
};

export default RequestCardComponent;
