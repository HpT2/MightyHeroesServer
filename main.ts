import * as SocketIO from "socket.io"
import * as HTTP from "http"
import { Pool } from "mysql"
import { v4 } from "uuid"
import { Room } from "./lib/Room"
import * as DBHelper from "./lib/DatabaseHelper"

let RoomLst : Room[] = [];

const HttpServer = HTTP.createServer();

const SocketServer = new SocketIO.Server({
    allowEIO3 : true,
    allowUpgrades : true,
    pingTimeout : 20000,
    pingInterval : 10000
});

const DBPool : Pool = DBHelper.DBPool;

SocketServer.on("connection", (socket : SocketIO.Socket) => {
    console.log(socket);

    socket.on("login", (data : any) => {
        console.log(data);

        //query player info from db
    });

    socket.on("logout", (data : any) => {
        console.log(data);
    });

    socket.on("register", (data : any) => {
        console.log(data);
        let new_player_id : string = v4();
        //insert to database
    });

    socket.on("create room", (data : any) => {
        console.log(data);
    });

    socket.on("join room", (data : any) => {
        console.log(data);

        //verify password if set

        //inform other player
        //socket.join(data.room_name);
    });

    socket.on("leave room", (data : any) => {
        console.log(data);
        
        //inform other player
        //socket.leave(data.room_name);

        //if no one in room, remove room from array
        const roomIdx = RoomLst.findIndex(room => room.name == data.room_name);
        const room : Room = RoomLst[roomIdx];
        if(room.socket_lst.length == 0)
        {
            RoomLst.splice(roomIdx, 1);
        }
    });

    socket.on("start game", (data : any) => {
        const current_room : string = socket.rooms.values().next().value || "default" ;
        if(current_room != "default")
        {
            socket.to(current_room).emit("start game");
            RoomLst.find(room => room.name = current_room)?.StartGame();
        }
        else
        {
            socket.emit("start game");
        }
    });

    socket.on("buy item", (data : any) => {
        console.log(data);
    });

    socket.on("save item", (data : any) => {
        console.log(data);
    });

    socket.on("get item info", (data : any) => {
        console.log(data);
    });

    socket.on("get rooms", (data : any) => {
        console.log(data); 
        //return available room first
    });

    socket.on("disconnect", (reason : SocketIO.DisconnectReason) => {
        const current_room : string = socket.rooms.values().next().value || "default" ;
        if(current_room != "default")
        {
            SocketServer.to(current_room).emit("player disconnect", /* custom data */);
        }
    });

    socket.on("reconnect", (data : any) => {
        console.log(data);
    });
});

HttpServer.listen(9999, '0.0.0.0', () => {
    const AddressIn4 : any = HttpServer.address();
    console.log(`Server running on address: ${AddressIn4.address}:9999`);
});

SocketServer.listen(HttpServer);
