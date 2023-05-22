import React, { useEffect, useState, useContext } from 'react';

import { AppContext } from '../contexts/AppContext';

const OverlayExchangeComponent = () => {
	const { onChats, setOnChats }: any = useContext(AppContext);

	return (
		<>
			<div>Exchange Component</div>
		</>
	);
};

export default OverlayExchangeComponent;
