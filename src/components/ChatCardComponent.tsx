import React, { useEffect, useState } from 'react';
import { toSvg } from 'jdenticon';

interface PropsObj {
	name: string;
	newMessage: boolean;
	lastMessage: string;
	index: number;
}

const ChatCardComponent = ({
	name,
	newMessage,
	lastMessage,
	index,
}: PropsObj) => {
	const [avatar, setAvatar] = useState('');
	useEffect(() => {
		setAvatar(toSvg(name, 100));
	});

	return (
		<>
			<button
				className={`${
					index === 0 ? 'outline outline-zinc-600' : ''
				} bg-zinc-900 rounded-2xl py-2 px-2 w-full`}
			>
				<div className="flex flex-row my-auto max-w-full space-x-3">
					{/* image */}
					<div className="flex-none my-auto">
						<img
							className="p-1 w-12"
							src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
							alt="avatar"
						/>
					</div>
					{/* text */}
					<div className="flex-grow flex flex-col my-auto w-full overflow-hidden">
						<p className="text-left truncate">{name}</p>
						<p className="text-left text-sm text-zinc-400 truncate">
							{lastMessage}
						</p>
					</div>
					{/* new msg */}
					<div className="flex-none w-6 m-auto">
						{newMessage && (
							<span className="block bg-gradient-to-b from-[#FF006E] to-[#3A86FF] rounded-full w-4 h-4"></span>
						)}
					</div>
				</div>
			</button>
		</>
	);
};

export default ChatCardComponent;
