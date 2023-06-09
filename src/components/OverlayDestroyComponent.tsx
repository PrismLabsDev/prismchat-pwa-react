import { db } from '../services/db';

const OverlayDestroyComponent = ({ close }: any) => {
	const selfDestruct = async () => {
		await db.general.clear();
    await db.chat.clear();
    await db.request.clear();
    await db.message.clear();

    indexedDB.deleteDatabase('PrismChatPWA');

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
