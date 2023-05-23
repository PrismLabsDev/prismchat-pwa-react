import React, { useEffect, useState, useContext } from 'react';
import { toSvg } from 'jdenticon';

// Context
import { AppContext } from '../contexts/AppContext';

const RequestCardComponent = ({ request }: any) => {
	const [avatar, setAvatar] = useState('');

	useEffect(() => {
		setAvatar(toSvg(request.pubkey, 100));
	}, [request]);

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
					</div>
				</div>
			</div>
		</>
	);
};

export default RequestCardComponent;
