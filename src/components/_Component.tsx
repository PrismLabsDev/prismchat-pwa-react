import React, { useEffect, useState, useContext } from 'react';

import { AppContext } from '../contexts/AppContext';

const _Component = () => {
	const { chatWindowSelected, setChatWindowSelected }: any =
		useContext(AppContext);

	const [text, setText]: any = useState('');

	useEffect(() => {
		setText('New Component');
		console.log(text);
	}, [text]);

	return (
		<>
			<div>{text}</div>
		</>
	);
};

export default _Component;
