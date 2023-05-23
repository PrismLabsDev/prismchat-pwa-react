import React, { useEffect, useState } from 'react';

// interface PropsObj {
// 	show: boolean;
// }

const OverlayComponent = ({ show, onClose, children }: any) => {
	return (
		<>
			{show && (
				<div className="z-10 fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-opacity-50 bg-zinc-900 backdrop-blur">
					<div className="bg-zinc-900 text-zinc-300 p-7 rounded-2xl">
						<div className="max-w-[75vw] md:max-w-[50vw] flex flex-col space-y-5">
							{children}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default OverlayComponent;
