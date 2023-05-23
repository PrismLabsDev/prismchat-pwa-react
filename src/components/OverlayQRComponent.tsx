import React, { useEffect, useState, useContext } from 'react';
import QRCode from 'qrcode';

import { AppContext } from '../contexts/AppContext';

const OverlayQRComponent = ({ close }: any) => {
	const { onChats, setOnChats, identityPublickey }: any =
		useContext(AppContext);

	const [qrUri, setQrUri] = useState('');

	useEffect(() => {
		(async function () {
			setQrUri(
				await QRCode.toDataURL(identityPublickey, {
					width: 1000,
				})
			);
		})();
	});

	return (
		<>
			<p className="font-bold	text-3xl">QR Identity</p>
			<div className="font-bold max-w-[300px] flex flex-row mx-auto">
				<img src={qrUri} alt="Generated QR Public Identity key." />
			</div>
			<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
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

export default OverlayQRComponent;
