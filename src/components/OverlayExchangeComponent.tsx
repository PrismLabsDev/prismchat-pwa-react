import React, { useEffect, useState, useContext } from 'react';
import { db } from '../services/db';
import authUtil from '../services/authUtil';
import prismClient from '../services/prismClient';

import { AppContext } from '../contexts/AppContext';

const OverlayExchangeComponent = ({ close }: any) => {
	const { chatWindowSelected, setChatWindowSelected }: any =
		useContext(AppContext);

	const [encryptRecipientKey, setEncryptRecipientKey] = useState('');
	const [encrypted, setEncrypted] = useState('');
	const [decryptMessage, setDecryptMessage] = useState('');
	const [decrypted, setDecrypted] = useState('');

	const [boxPublicKey, setBoxPublickey]: any = useState('');
	const [identityPublicKey, setIdentityPublicKey]: any = useState('');

	useEffect(() => {
		(async function () {
			let identityKeyCheck: any = await db.general
				.where('name')
				.equals('IdentityKeys')
				.first();

			let boxKeysCheck: any = await db.general
				.where('name')
				.equals('BoxKeys')
				.first();

			if (boxKeysCheck !== undefined && identityKeyCheck !== undefined) {
				setBoxPublickey(boxKeysCheck.value.public);
				setIdentityPublicKey(identityKeyCheck.value.public);
			}
		})();
	});

	const boxEncrypt = async () => {
		let boxKeysQuery: any = await db.general
			.where('name')
			.equals('BoxKeys')
			.first();

		const prism: any = await prismClient.init(
			boxKeysQuery.value.public,
			boxKeysQuery.value.private
		);

		const encrypted = prism.boxEncrypt(identityPublicKey, encryptRecipientKey);

		setEncrypted(
			`${boxKeysQuery.value.public}:${encrypted.nonce}:${encrypted.cypherText}`
		);
	};

	const boxDecrypt = async () => {
		let boxKeysQuery: any = await db.general
			.where('name')
			.equals('BoxKeys')
			.first();

		const prism: any = await prismClient.init(
			boxKeysQuery.value.public,
			boxKeysQuery.value.private
		);

		const [decryptSenderKey, nonce, cypherText] = decryptMessage.split(':');
		const decrypted = prism.boxDecrypt(cypherText, nonce, decryptSenderKey);

		setDecrypted(decrypted);
	};

	const newBoxKey = async () => {
		// Create new box keys
		const prismBox: any = await prismClient.init();
		const generatedBoxKeys = prismBox.generateIdentityKeys();
		await db.general.update('BoxKeys', {
			value: generatedBoxKeys,
		});

		setBoxPublickey(generatedBoxKeys.public);
	};

	return (
		<>
			<p className="font-bold	text-3xl">Key Exchange</p>

			<div className="flex flex-col space-y-3">
				<div className="flex flex-col my-auto space-y-2">
					<button
						onClick={() => {
							navigator.clipboard.writeText(boxPublicKey);
						}}
					>
						{boxPublicKey}
					</button>
					<button
						className="btn-sm w-full"
						onClick={() => {
							newBoxKey();
						}}
					>
						Generate New Exchange Key
					</button>
				</div>
			</div>

			<div className="flex flex-row space-x-3">
				<div className="w-1/2 flex flex-col space-y-3">
					<p className="font-bold text-xl text-center	">Encrypt</p>
					<input
						className="input"
						placeholder="Recipient Key"
						type="text"
						value={encryptRecipientKey}
						onChange={(e: any) => {
							setEncryptRecipientKey(e.target.value);
						}}
					/>
					<button
						className="btn"
						onClick={() => {
							boxEncrypt();
						}}
					>
						Generate
					</button>
					<button
						className="border border-zinc-600 rounded h-20 px-2 py-1 text-left"
						onClick={() => {
							navigator.clipboard.writeText(encrypted);
						}}
					>
						<p className="overflow-hidden">{encrypted}</p>
					</button>
				</div>
				<div className="w-1/2 flex flex-col space-y-3">
					<p className="font-bold text-xl text-center">Decrypt</p>
					<input
						className="input"
						placeholder="Cipher Text"
						type="text"
						value={decryptMessage}
						onChange={(e: any) => {
							setDecryptMessage(e.target.value);
						}}
					/>
					<button
						className="btn"
						onClick={() => {
							boxDecrypt();
						}}
					>
						Decrypt
					</button>
					<button
						className="border border-zinc-600 rounded h-20 px-2 py-1 text-left"
						onClick={() => {
							navigator.clipboard.writeText(decrypted);
						}}
					>
						<p className="overflow-hidden">{decrypted}</p>
					</button>
				</div>
			</div>

			<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
				{/* <button
					onClick={() => {
						console.log('accept');
					}}
				>
					Accept
				</button> */}
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

export default OverlayExchangeComponent;
