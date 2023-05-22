import React, { useEffect, useState, useContext } from 'react';

import { AppContext } from '../contexts/AppContext';

const OverlayDestroyComponent = () => {
	const { onChats, setOnChats }: any = useContext(AppContext);

	return (
		<>
			<div>Destroy Component</div>
		</>
	);
};

export default OverlayDestroyComponent;
