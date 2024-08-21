'use client'
import { getFileName } from "@/lib/file";
import { createContext, useContext, useEffect, useState } from 'react';

export const connectionProvider = createContext({
});

export function useConnection() {
    return useContext(connectionProvider);
}

const ConnectionProvider = ({ children }) => {
    const [user, setUser] = useState('');

    const [progress, setProgress] = useState(0);
    const [chats, setChats] = useState([]);

    const [ws, setWs] = useState(null);

    const uploadPP = (data) => {
        const sendData = {
            id: user.id,
            name: data.name,
            type: 'profile_pics'
        }
        const msg = `upload;${JSON.stringify(sendData)}`
        ws.send(msg);
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            const chunkSize = 1024;
            let ofset = 0;

            function sendChunk(){
                if(ofset < arrayBuffer.byteLength){
                    const chunk = arrayBuffer.slice(ofset, ofset + chunkSize);
                    ws.send(chunk);
                    ofset += chunkSize;
                    const percent = Math.floor((ofset / arrayBuffer.byteLength) * 100);
                    setProgress(percent);
                    setTimeout(sendChunk, 10);
                }else{
                    ws.close();
                    console.log('File sent');
                    setUser(prev => {
                        return {
                            ...prev,
                            image: getFileName(prev.id, 'profile_pics', data.name)
                        }
                    })
                    setProgress(0);
                }
            }

            sendChunk();
            
        }
        reader.readAsArrayBuffer(data);
    }

    const sendMessage = (data) => {
        const {type, message, to, from} = data;
        if(type === 'text'){
            const msg = `text;${JSON.stringify({message, to, from})}`;
            ws.send(msg);
        }

        if(type === 'file'){
            const isPhoto = message.type.includes('image');
            const sendData = {
                id: user.id,
                type: isPhoto ? 'image' : 'file',
                name: message.name,
                to,
                from
            }
            const msg = `upload;${JSON.stringify(sendData)}`;
            ws.send(msg);
            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const chunkSize = 1024;
                let ofset = 0;
    
                function sendChunk(){
                    if(ofset < arrayBuffer.byteLength){
                        const chunk = arrayBuffer.slice(ofset, ofset + chunkSize);
                        ws.send(chunk);
                        ofset += chunkSize;
                        const percent = Math.floor((ofset / arrayBuffer.byteLength) * 100);
                        setProgress(percent);
                        setTimeout(sendChunk, 10);
                    }else{
                        ws.close();
                        console.log('File sent');
                        setUser(prev => {
                            return {
                                ...prev,
                                image: getFileName(prev.id, 'profile_pics', message.name)
                            }
                        })
                        setProgress(0);
                    }
                }
    
                sendChunk();
                
            }
            reader.readAsArrayBuffer(message);
        }
    }

    useEffect(() => {
        const ws = new WebSocket('wss://localhost:41200');

        ws.onopen = () => {
            console.log('Connected to server');
            setWs(ws);
        };

        ws.onmessage = (message) => {
            const msg = JSON.parse(message.data);
            switch (msg.type) {
                case 'connected':
                    setUser(msg.data.you);
                    setChats(msg.data.clients);
                    break;
                case 'new_client':;
                    setChats(msg.data.clients);
                    break;
                case 'message':
                    console.log(msg.data);
                    const newChats = chats.map(client => {
                        if(client.id === msg.data.from){
                            client.messages.push(msg.data);
                        }
                        return client;
                    });
                    setChats(newChats);
                    break;
                default:
                    break;
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from server');
        };

        ws.onerror = (error) => {
            console.error(error);
        }

        return () => {
            ws.close();
        };

    }, []);

    function getClient(id){
        const data = chats.find(client => client.id === id);
        return data;
    }

    return (
        <connectionProvider.Provider value={{
            user,
            uploadPP,
            progress,
            chats,
            getClient,
            sendMessage
        }}>
            {children}
        </connectionProvider.Provider>
    );
}

export default ConnectionProvider;