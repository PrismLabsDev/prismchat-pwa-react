import React, { useEffect, useState } from 'react';
import { AppContext } from './contexts/AppContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './services/db';
import authUtil from './services/authUtil';
import {messageUtils} from './services/messageUtils'
import apiUtil from './services/apiUtil'

// Components
import ChatListComponent from './components/ChatListComponent';
import ChatWindowComponent from './components/ChatWindowComponent';
import OverlayComponent from './components/OverlayComponent';
import OverlayInitComponent from './components/OverlayInitComponent';

function App() {
  // State (App context)
	const [chatWindowSelected, setChatWindowSelected] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
	const [identityKeys, _setIdentityKeys]: any = useState(null);
  const [server, _setServer]: any = useState(null);
  const [boxKeys, _setBoxKeys]: any = useState(null);
	const [chats, setChats] = useState(null);
	const [selectedChat, setSelectedChat]: any = useState(null);

  // Overlay state
  const [initialized, setInitialized] = useState(false);
  const [openOverlayInit, setOpenOverlayInit] = useState(false);

  const setIdentityKeys = async (data: any) => {
    const query = await db.general.put({
      name: 'IdentityKeys',
			value: data,
		});

    if(query){
      _setIdentityKeys(data);
    }
  }

  const setServer = async (data: any) => {
    const query = await db.general.put({
      name: 'Server',
			value: data,
		});

    if(query){
      _setServer(data);
    }
  }

  const setBoxKeys = async (data: any) => {
    const query = await db.general.put({
      name: 'BoxKeys',
			value: data,
		});

    if(query){
      _setBoxKeys(data);
    }
  }

	// Watch for message change in db
	const chatsQuery: any = useLiveQuery(async () => {
		const chatQuery: any = await db.chat.toArray();
		if (chatQuery) {
			const chatList = chatQuery.map((chat: any) => {
				if (selectedChat !== null) {
					if (selectedChat.pubkey === chat.pubkey) {
						chat.newMessage = false;
					}
				}
				return chat;
			});

			return chatList;
		} else {
			return [];
		}
	});

	// On message change update state
	useEffect(() => {
		setChats(chatsQuery);
    if (chats) {
			if (!selectedChat) {
				setSelectedChat(chats[0]);
			}
		}
	}, [chatsQuery]);

  const registerNotifications = async (baseURL: string, accessToken: string, vapid: string) => {
    if('serviceWorker' in navigator){
      const api = apiUtil.init(baseURL, accessToken);
      navigator.serviceWorker.ready.then(async (registration) => {
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapid,
          });
        }
        api.post('/push/subscribe', subscription);
      });

      // Broadcast push from service worker
      const channel = new BroadcastChannel('prism-chat-sw');
      channel.addEventListener('message', (event) => {
        if (event.data.event === 'pushNotification') {
          switch(event.data.payload.type) {
            case 'M':
              messageUtils.get(baseURL, accessToken);
              break;
            default:
              messageUtils.get(baseURL, accessToken);
          }
        }
      });

    } else {
      console.log('Service worker is not available in this browser');
    }
  };

	// Effect on first open
	useEffect(() => {
		(async function () {
      // Check Identity keys
      let identityKeysCheck: any = await db.general
      .where('name')
      .equals('IdentityKeys')
      .first();

      // Check Server
      let serverCheck: any = await db.general
      .where('name')
      .equals('Server')
      .first();

      // Check Box keys
      let boxKeysCheck: any = await db.general
      .where('name')
      .equals('BoxKeys')
      .first();

      if(identityKeysCheck && serverCheck && boxKeysCheck){
        _setIdentityKeys(identityKeysCheck.value);
        _setServer(serverCheck.value);
        _setBoxKeys(boxKeysCheck.value);

        // Authenticate to server
        try {
          const { cypherText, nonce } = await authUtil.request(serverCheck.value.host);
          const _accessToken = await authUtil.verify(cypherText, nonce, serverCheck.value.host);

          // Get messages
          if(_accessToken){
            await messageUtils.get(serverCheck.value.host, _accessToken);
            
            // Request notifications permission from browser
            if (!('Notification' in window)) {
              console.log('This browser does not support notification');
            } else if (Notification.permission === 'granted') {
              await registerNotifications(serverCheck.value.host, _accessToken, serverCheck.value.keys.vapid);
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission().then(async (permission) => {
                if (permission === 'granted') {
                  await registerNotifications(serverCheck.value.host, _accessToken, serverCheck.value.keys.vapid);
                }
              });
            }

            setAccessToken(_accessToken);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        setOpenOverlayInit(true);
      }
		})();
	}, []);

	return (
		<>
			<AppContext.Provider
				value={{
					chatWindowSelected,
					setChatWindowSelected,
          accessToken,
          setAccessToken,
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
				}}
			>
				<div className="bg-zinc-900 h-screen text-white">
					<main className="h-full">
						{/* Desktop */}
						<div className="hidden md:flex flex-row">
							<div className="w-1/3 lg:w-1/4">
								<ChatListComponent />
							</div>
							<div className="w-2/3 lg:w-3/4">
								<ChatWindowComponent />
							</div>
						</div>
						{/* Mobile */}
						<div className="block md:hidden w-full">
							{chatWindowSelected ? (
								<ChatListComponent />
							) : (
								<ChatWindowComponent />
							)}
						</div>
					</main>
				</div>

        {/* Overlay Init */}
        <OverlayComponent show={openOverlayInit}>
          <OverlayInitComponent
            close={() => {
              setOpenOverlayInit(false);
              setInitialized(true);
            }}
          />
        </OverlayComponent>
			</AppContext.Provider>
		</>
	);
}

export default App;
