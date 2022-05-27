import websocket from 'websocket';
import http from 'http';
import { randomUUID } from 'crypto';
import logging from '../config/logging';
import Notes from '../db/notes';

let clients: {
    userID: string;
    connection: websocket.connection;
}[] = [];

const connectWebSocketServer = async (expressServer: http.Server) => {
    const websocketServer = new websocket.server({
        httpServer: expressServer
    });
    websocketServer.on('request', function (request) {
        const userID = randomUUID();
        logging.info('WebSocket', `${new Date()} Received a new connection from origin: ${request.origin}.`);
        const connection = request.accept(null, request.origin);
        clients?.push({ userID, connection: connection });
        logging.info('WebSocket', `connected: ${userID} in ${clients?.find((client) => client.userID === userID)?.userID}`);
        const notes = Notes?.getNotes();
        const notesToSend = {
            type: 'notes',
            data: notes
        };
        connection.send(JSON.stringify(notesToSend));
        connection.on('close', function () {
            clients = clients.filter((client) => client.userID === userID);
            console.log('No', clients?.length);
            logging.info('WebSocket', `${new Date()} Connection closed. Connection ID: ${userID}`);
        });
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
                const { type, data } = JSON.parse(message.utf8Data);
                if (type === 'note') {
                    const { id, userId, author, bgColor, text, placement } = data;
                    let note = id ? Notes.getNote(id) : null;
                    if (note) {
                        note = Notes.updateNote(data);
                    } else {
                        note = Notes.addNote({ id: randomUUID(), userId: userId, author: author, bgColor: bgColor, text: text, placement: placement });
                    }
                    console.log('MEME', clients?.length);
                    //broadcast the message to all the clients
                    const sendNote = {
                        type: 'note',
                        data: note
                    };
                    clients?.forEach((client) => {
                        client?.connection?.send(JSON.stringify(sendNote));
                        console.log('Sent: ' + JSON.stringify(sendNote));
                    });
                }
            }
        });
    });
};

export default connectWebSocketServer;
