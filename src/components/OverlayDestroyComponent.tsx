import React, { useEffect, useState, useContext } from 'react';

import { AppContext } from '../contexts/AppContext';

const OverlayDestroyComponent = ({ close }: any) => {
	const { chatWindowSelected, setChatWindowSelected }: any =
		useContext(AppContext);

	const selfDestruct = async () => {
		localStorage.removeItem('access_token');

		await window.indexedDB.databases().then((r: any) => {
			for (var i = 0; i < r.length; i++)
				window.indexedDB.deleteDatabase(r[i].name);
		});

		window.location.reload();
	};

	return (
		<>
			<p className="font-bold	text-3xl">Self Destruct</p>
			<p className="font-bold">
				This will destroy all data stored on your local device, including chats,
				messages and all keys.
			</p>
			<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
				<button
					onClick={() => {
						selfDestruct();
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

export default OverlayDestroyComponent;
