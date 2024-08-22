'use client'
import { getFileName } from "@/lib/file";
import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from "next/navigation";

export const connectionProvider = createContext({
});

export function useConnection() {
    return useContext(connectionProvider);
}

const ConnectionProvider = ({ children }) => {
    const [user, setUser] = useState('');
    const pathname = usePathname();
    const [progress, setProgress] = useState(0);
    const [chats, setChats] = useState([]);
    const [chat, setChat] = useState('');
    const handleChat = (id) => {
        setChat(id);
    }
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    const sendMessage = (data) => {
        const {type, message, to, from, file, members, targetType} = data;
        if(type === 'text'){
            const msg = `text;${JSON.stringify({message, to, from, targetType})}`;
            fetch('/api/encrypt', {
                method: 'POST',
                body: JSON.stringify({type: 'message', data: msg}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(result => {
                ws.send(result.result);
            })
        }
        if(type === 'file'){
            const isPhoto = file.type.includes('image');
            const sendData = {
                id: user,
                type: isPhoto ? 'images' : 'documents',
                name: file.name,
                to,
                from,
                message,
                targetType
            }
            const msg = `upload;${JSON.stringify(sendData)}`;
            ws.send(msg);
            const reader = new FileReader();
            reader.onload = async (event) => {
                const arrayBuffer = event.target.result;
                const chunkSize = 1024;
                let ofset = 0;
    
                async function sendChunk(){
                    if(ofset < arrayBuffer.byteLength){
                        const chunk = arrayBuffer.slice(ofset, ofset + chunkSize);
                        ws.send(chunk);
                        ofset += chunkSize;
                        const percent = Math.floor((ofset / arrayBuffer.byteLength) * 100);
                        setProgress(percent);
                        setTimeout(sendChunk, 10);
                    }else{
                        ws.send('finish');
                        setProgress(0);
                        return
                        
                    }
                }
                await sendChunk();
                
            }
            reader.readAsArrayBuffer(file);
        }

        if(type === 'new_group'){
            const sendData = {
                id: user,
                name: message,
                type: 'group',
                members
            }
            const msg = `new_group;${JSON.stringify(sendData)}`;
            fetch('/api/encrypt', {
                method: 'POST',
                body: JSON.stringify({type: 'message', data: msg}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(result => {
                ws.send(result.result);
            })
        }
    }

    useEffect(() => {
        const ws = new WebSocket('wss://localhost:41200');

        ws.onopen = () => {
            console.log('Connected to server');
            setWs(ws);
        };

        ws.onmessage = (message) => {
            fetch('/api/decrypt', {
                method: 'POST',
                body: JSON.stringify({message: message.data}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json()).then(result => {
                const msg = result.result;
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
                        setMessages(msg.data);
                        break;
                    default:
                        break;
                }
            })
        };

        ws.onclose = () => {
            console.log('Disconnected from server a');
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

    useEffect(() => {
        if(chat && ws && chats.length > 0){
            const toType = chats.find(client => client.id === chat)
            if(toType){
                ws.send(`messages;${JSON.stringify({to: chat, from: user, targetType: toType.type})}`);
            }
        }
    }, [chat, ws])

    useEffect(() => {
        if(pathname === '/'){
            setChat('');
        }
    }, [pathname])
    return (
        <connectionProvider.Provider value={{
            user,
            progress,
            chats,
            getClient,
            sendMessage,
            messages,
            handleChat
        }}>
            {children}
        </connectionProvider.Provider>
    );
}

export default ConnectionProvider;