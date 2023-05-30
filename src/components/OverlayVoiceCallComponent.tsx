import { useEffect, useRef } from "react";
import { Peer } from "peerjs";

const OverlayVoiceCallComponent = ({ close }: any) => {

  const videoElement: any = useRef(null);

  useEffect(() => {
    
  }, []);

  const connect = () => {
    const peer = new Peer({
      host: "localhost",
      port: 9000,
      path: "/",
    });

    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });
  };

	return (
		<>
			<p className="font-bold	text-3xl">Voice Call</p>
			<div>
        <video ref={videoElement} autoPlay className="w-300 h-300"></video>
        <button className="btn" onClick={() => {
          connect();
        }}>
          connect
        </button>
			</div>
			<div className="flex flex-row justify-end space-x-5 border-t-2 border-zinc-800 pt-3">
				<button
					onClick={() => {
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

export default OverlayVoiceCallComponent;
