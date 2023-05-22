import React, { useEffect, useState, useContext } from 'react';

import { AppContext } from '../contexts/AppContext';

const OverlayDestroyChatComponent = () => {
	const { onChats, setOnChats }: any = useContext(AppContext);

	return (
		<>
			<div>Destroy Chat Component</div>
		</>
	);
};

export default OverlayDestroyChatComponent;
