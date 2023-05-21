import React, { useEffect, useState } from 'react';

// Components
import HeaderComponent from './components/HeaderComponent';
import ChatListComponent from './components/ChatListComponent';
import ChatWindowComponent from './components/ChatWindowComponent';

function App() {
	return (
		<>
			<div className="bg-zinc-900 h-screen text-white">
				<header className="h-16">
					<div className="h-full">
						<HeaderComponent />
					</div>
				</header>
				<main className="h-[calc(100vh-64px)]">
					<div className="h-full flex flex-row">
						<div className="basis-1/4 bg-gradient-to-t from-zinc-900	to-zinc-800">
							<ChatListComponent />
						</div>
						<div className="basis-3/4 background">
							<ChatWindowComponent />
						</div>
					</div>
				</main>
			</div>
		</>
	);
}

export default App;
