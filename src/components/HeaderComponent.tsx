import React, { useEffect, useState } from 'react';
import {
	MdQrCode2,
	MdOutlineKey,
	MdMessage,
	MdSwapHoriz,
	MdDelete,
} from 'react-icons/md';
import { toSvg } from 'jdenticon';

const HeaderComponent = () => {
	const [avatar, setAvatar] = useState('');
	useEffect(() => {
		setAvatar(toSvg('ex', 100));
	});
	return (
		<>
			<div className="flex flex-row h-full">
				<div className="basis-1/4 flex flex-row border-r border-zinc-700 items-center px-5">
					<div className="basis-1/2 flex flex-row justify-start space-x-3">
						<button>
							<MdQrCode2 />
						</button>
						<button>
							<MdOutlineKey />
						</button>
					</div>
					<div className="basis-1/2 flex flex-row justify-end space-x-3">
						<button>
							<MdDelete />
						</button>
						<button>
							<MdSwapHoriz />
						</button>
						<button>
							<MdMessage />
						</button>
					</div>
				</div>
				<div className="basis-3/4 flex flex-row justify-between">
					<div className="flex flex-row">
						<img
							className="p-1 w-16"
							src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar)}`}
							alt="avatar"
						/>
						<div className="flex flex-col my-auto ml-5">
							<p>et</p>
						</div>
					</div>
					<div className="flex flex-row my-auto mr-5 space-x-2">
						<MdDelete />
					</div>
				</div>
			</div>
		</>
	);
};

export default HeaderComponent;
