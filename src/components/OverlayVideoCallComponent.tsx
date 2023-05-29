const OverlayVideoCallComponent = ({ close }: any) => {

	return (
		<>
			<p className="font-bold	text-3xl">Video Call</p>
			<div>
        controls
			</div>
			<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
				<button
					onClick={() => {
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

export default OverlayVideoCallComponent;
