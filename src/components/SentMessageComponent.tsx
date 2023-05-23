import React from 'react';

interface PropsObj {
	text: string;
	sent: boolean;
}

const SentMessageComponent = ({ text, sent }: PropsObj) => {
	return (
		<>
			<div className="flex flex-row justify-end">
				<div className="rounded-l-3xl rounded-tr-3xl bg-[#6A66DC] text-white py-2 px-6 mt-5 w-11/12">
					<p className="break-words">{text}</p>
				</div>
			</div>
		</>
	);
};

export default SentMessageComponent;
