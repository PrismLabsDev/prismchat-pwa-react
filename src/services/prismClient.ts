import { db } from './db';
import { Prism } from 'prismchat-lib';

const init: any = async (pubKey?: any, prvKey?: any) => {
	const identityKeys = await db.general
		.where('name')
		.equals('IdentityKeys')
		.first();

	if (pubKey && prvKey) { // If keys given to function
		const prism: Prism = new Prism(pubKey, prvKey);
		await prism.init();
		return prism;
	} else if (identityKeys) { // If keys are found in db
		const prism: Prism = new Prism(
			identityKeys.value.public,
			identityKeys.value.private
		);
		await prism.init();
		return prism;
	} else { // If no keys given and no keys
		const prism: Prism = new Prism();
		await prism.init();
		prism.generateIdentityKeys();
		return prism;
	}
};

const exportObj = {
	init,
};

export default exportObj;
