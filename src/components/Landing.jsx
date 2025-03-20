import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();
    const [roomId, setRoomId] = React.useState('');

    const handleCreateRoom = () => {
        const roomId = Math.random().toString(36).substring(7); // mock room ID
        console.log(roomId)
        navigate(`/editor/${roomId}`);
    };

    const handleJoinRoom = () => {
        if (roomId) navigate(`/editor/${roomId}`);
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-2xl shadow-md">
                <button className="bg-red-400 text-white px-4 py-2 rounded-xl hover:bg-red-500 transition" onClick={handleCreateRoom}>
                    Create a Room
                </button>
                <p className="text-gray-600 font-semibold">OR</p>
                <button className="bg-blue-400 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition" onClick={handleJoinRoom}>
                    Join a Room
                </button>
                <form className="w-full mt-4">
                    <input
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter room ID"
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                </form>
            </div>
        </div>
    );
}

export default Landing;