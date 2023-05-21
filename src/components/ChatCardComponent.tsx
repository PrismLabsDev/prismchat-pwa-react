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
			{index === 0 ? (
				<button className="bg-zinc-900 rounded-2xl py-2 px-5 w-full flex flex-row content-center space-x-5 outline outline-zinc-600	">
					<div className="basis-3/12 my-auto">
						<div className=" rounded-full">
							<img
								className="p-1 w-16"
								src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
								alt="avatar"
							/>
						</div>
					</div>
					<div className="basis-7/12 my-auto">
						<div className="text-left text-zinc-300">{name}</div>
						<div className="text-left text-zinc-400 text-sm">
							{lastMessage.substring(0, 10)}
						</div>
					</div>
					<div className="basis-2/12 my-auto flex flex-row justify-end">
						{newMessage ? (
							<span className="bg-gradient-to-b from-[#FF006E] to-[#3A86FF] rounded-full w-4 h-4"></span>
						) : null}
					</div>
				</button>
			) : (
				<button className="bg-zinc-900 rounded-2xl py-2 px-5 w-full flex flex-row content-center space-x-5">
					<div className="basis-3/12 my-auto">
						<div className=" rounded-full">
							<img
								className="p-1 w-16"
								src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
								alt="avatar"
							/>
						</div>
					</div>
					<div className="basis-7/12 my-auto">
						<div className="text-left text-zinc-300">{name}</div>
						<div className="text-left text-zinc-400 text-sm">
							{lastMessage.substring(0, 10)}
						</div>
					</div>
					<div className="basis-2/12 my-auto flex flex-row justify-end">
						{newMessage ? (
							<span className="bg-gradient-to-b from-[#FF006E] to-[#3A86FF] rounded-full w-4 h-4"></span>
						) : null}
					</div>
				</button>
			)}
		</>
	);
};

export default ChatCardComponent;
