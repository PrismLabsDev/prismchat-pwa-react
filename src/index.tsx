import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import api from './services/api';

import { db } from './services/db';
import authUtil from './services/authUtil';
import { messageUtils } from './services/messageUtils';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const registerNotifications = () => {
	navigator.serviceWorker.ready.then(async (registration) => {
		let subscription = await registration.pushManager.getSubscription();
		if (subscription === null) {
			subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey:
					'BFkzzEXLYpaxhxRu97TtNHKUJ56b6cTBo25dXnBmEjIgJqMi-ccU2sf2gKF18SbSw8DBzkjssECCdXJvfWLmoyo',
			});
		}
		api.post('/push/subscribe', subscription);
	});
};

const getMessage = async () => {
	let identityKeysCheck = await db.general
		.where('name')
		.equals('IdentityKeys')
		.first();

	if (identityKeysCheck) {
		await messageUtils.get();
	}
};

(async function () {
	let identityKeysCheck = await db.general
		.where('name')
		.equals('IdentityKeys')
		.first();

	// Checks if you are a user or not
	if (identityKeysCheck) {
		// authenticate
		const { cypherText, nonce } = await authUtil.request();
		const access_token = await authUtil.verify(cypherText, nonce);
		localStorage.setItem('access_token', access_token);

		await messageUtils.get();
	}

	await getMessage();

	navigator.serviceWorker.addEventListener('message', (event) => {
		if (event.data.type === 'pushNotification') {
			const payload = event.data.payload;
			if (payload.type === 'M') {
				(async function () {
					await getMessage();
				})();
			}
		}
	});

	// Request permissions for notification
	if (!('Notification' in window)) {
		// Check if the browser supports notifications
		alert('This browser does not support desktop notification');
	} else if (Notification.permission === 'granted') {
		// Check whether notification permissions have already been granted;
		// if so, create a notification
		registerNotifications();
	} else if (Notification.permission !== 'denied') {
		// We need to ask the user for permission
		Notification.requestPermission().then((permission) => {
			// If the user accepts, let's create a notification
			if (permission === 'granted') {
				registerNotifications();
			}
		});
	}
})();

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
//serviceWorkerRegistration.unregister();
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
