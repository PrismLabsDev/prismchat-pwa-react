import React, { useEffect, useState, useContext } from 'react';

import { AppContext } from '../contexts/AppContext';

const OverlayQRComponent = () => {
	const { onChats, setOnChats }: any = useContext(AppContext);

	return (
		<>
			<div>QR Component</div>
		</>
	);
};

export default OverlayQRComponent;
