import React, { useEffect, useState, useContext } from 'react';

import { AppContext } from '../contexts/AppContext';

const OverlayEditChatComponent = ({ close }: any) => {
	const { onChats, setOnChats }: any = useContext(AppContext);

	return (
		<>
			<p className="font-bold	text-3xl">Edit Chat</p>
			<p className="font-bold">Info</p>
			<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
				<button
					onClick={() => {
						console.log('accept');
					}}
				>
					Accept
				</button>
				<button
					onClick={() => {
						close();
					}}
				>
					Close
				</button>
			</div>
		</>
	);
};

export default OverlayEditChatComponent;
