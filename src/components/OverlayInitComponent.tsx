import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../contexts/AppContext';
import prismClient from '../services/prismClient';

const OverlayInitComponent = ({ close }: any) => {
  const {
		chatWindowSelected,
    setChatWindowSelected,
    identityKeys,
    setIdentityKeys,
    server,
    setServer,
    boxKeys,
    setBoxKeys,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
	}: any = useContext(AppContext);

  const [serverURI, setServerURI]: any = useState('');

  const createNewAccount: any = async () => {

    let formattedServerURL: string = serverURI;

    // Remove characters for formatting
    formattedServerURL = formattedServerURL.replace('https://', '');
    formattedServerURL = formattedServerURL.replace('http://', '');
    formattedServerURL = formattedServerURL.replace('/', '');

    if(formattedServerURL.includes('localhost')){
      formattedServerURL = `http://${formattedServerURL}`;
    } else {
      formattedServerURL = `https://${formattedServerURL}`;
    }

		// Get server keys
		const serverIdentify = await axios.get(formattedServerURL);
    setServer({
      host: serverURI,
      keys: serverIdentify.data.keys,
    });

		// Create new account & IdentityKeys
		const prism: any = await prismClient.init();
    setIdentityKeys(prism.IdentityKeys);

		// Create new box keys
		const prismBox: any = await prismClient.init();
		const generatedBoxKeys = prismBox.generateIdentityKeys();
    setBoxKeys(generatedBoxKeys);

    // Close window
		close();
	};

	return (
		<>
			<p className="font-bold	text-3xl">Setup</p>
        <p>
          We did not find any Prism keys in this browser. Do we have your
          permission to generate keys for you to start using the Prism Chat
          service?
        </p>
        <p className="font-bold">
          This application is for demonstration purposes ONLY!
        </p>
        <p className="font-bold">Demo Server: api1.prism.chat</p>
        <div>
          <input
            className="input"
            placeholder="Preferred prism server"
            type="text"
            value={serverURI}
            onChange={(e: any) => {
              setServerURI(e.target.value);
            }}
          />
        </div>
			<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
				<button
					onClick={() => {
						createNewAccount();
					}}
				>
					Accept
				</button>
				<button
					onClick={() => {
						close();
					}}
				>
					Close
				</button>
			</div>
		</>
	);
};

export default OverlayInitComponent;
