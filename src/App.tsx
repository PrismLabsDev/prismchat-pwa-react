import React, { useEffect, useState } from 'react';

// Components
import HeaderComponent from './components/HeaderComponent';
import ChatListComponent from './components/ChatListComponent';
import ChatWindowComponent from './components/ChatWindowComponent';

function App() {
	const [onChats, setonChats] = useState(true);

	return (
		<>
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
						{onChats ? <ChatListComponent /> : <ChatWindowComponent />}
					</div>
				</main>
			</div>
		</>
	);
}

export default App;
