import React from 'react';

interface PropsObj {
	text: string;
	sent: boolean;
}

const ReceivedMessageComponent = ({ text, sent }: PropsObj) => {
	return (
		<>
			<div className="flex flex-row justify-start">
				<div className="rounded-r-3xl rounded-tl-3xl bg-zinc-900 text-zinc-300 py-2 px-6 mt-5 mr-[10%] break-words w-fit">
					<p>{text}</p>
				</div>
			</div>
		</>
	);
};

export default ReceivedMessageComponent;
