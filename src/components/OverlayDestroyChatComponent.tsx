import React, { useEffect, useState, useContext } from 'react';

import { AppContext } from '../contexts/AppContext';

const OverlayDestroyChatComponent = ({ close }: any) => {
	const { chatWindowSelected, setChatWindowSelected }: any =
		useContext(AppContext);

	return (
		<>
			<p className="font-bold	text-3xl">Destroy Chat</p>
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

export default OverlayDestroyChatComponent;
