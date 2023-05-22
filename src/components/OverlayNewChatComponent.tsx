import React, { useEffect, useState, useContext } from 'react';

import { AppContext } from '../contexts/AppContext';

const OverlayNewChatComponent = () => {
	const { onChats, setOnChats }: any = useContext(AppContext);

	return (
		<>
			<div>New Chat</div>
		</>
	);
};

export default OverlayNewChatComponent;
