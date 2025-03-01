import * as SocketIO from "socket.io"
import * as HTTP from "http"
import { v4 } from "uuid"
import { Room } from "./lib/Room"
import * as DBHelper from "./lib/DatabaseHelper"
import { EventName, LoginFailedReason, LoginState } from "./lib/Constants"
import { Pool } from "mysql"
import { UserInfo } from "./lib/UserInfo"

let RoomLst : Room[] = [];
let ActiveUsers : Map<string, UserInfo> = new Map<string, UserInfo>();

const HttpServer = HTTP.createServer();

const SocketServer = new SocketIO.Server({
    allowEIO3 : true,
    allowUpgrades : true,
    pingTimeout : 20000,
    pingInterval : 10000
});

SocketServer.on("connection", (socket : SocketIO.Socket) => {
    console.log(`A new client connected, socket id: ${socket.id}`);

    socket.on(EventName.EVENT_LOGIN, ProcessLogin.bind(null, socket));

    socket.on(EventName.EVENT_MODIFY_NICKNAME, ProcessModifyNickName.bind(null, socket));

    socket.on("logout", ProcessLogout.bind(null, socket));

    socket.on("register", ProcessRegister.bind(null, socket));

    socket.on("create room", ProcessCreateRoom.bind(null, socket));

    socket.on("join room", ProcessJoinRoom.bind(null, socket));

    socket.on("leave room", ProcessLeaveRoom.bind(null, socket));

    socket.on("start game", ProcessStartGame.bind(null, socket));

    socket.on("buy item", ProcessBuyItem.bind(null, socket));

    socket.on("save item", ProcessSaveItem.bind(null, socket));

    socket.on(EventName.EVENT_GET_ROOM_LIST, ProcessGetRooms.bind(null, socket));

    socket.on("disconnect", ProcessDisconnect.bind(null, socket));

    socket.on("reconnect", ProcessReconnect.bind(null, socket));
});

HttpServer.listen(9999, '0.0.0.0', () => {
    const AddressIn4 : any = HttpServer.address();
    console.log(`Server running on address: ${AddressIn4.address}:9999`);
});

SocketServer.listen(HttpServer);


//Event Processor
const DBPool : Pool = DBHelper.DBPool;
async function ProcessLogin(socket : SocketIO.Socket, data : any)
{
    let json : any = JSON.parse(data);

    //query player info from db
    let result : any = await DBHelper.Select(DBPool, DBHelper.TableName.USER_INFO_TBL, "Username", json.Username);
    let response : string;
    if(result.length > 0)
    {
        let UserData : any = result[0];
        if(UserData.Password == json.Password)
        {
            response = MakeMessage(["State", "UserData"], [LoginState.SUCCESS, UserData]);
            let User : UserInfo = new UserInfo(UserData);
            ActiveUsers.set(socket.id, User);
        }
        else
        {
            response = MakeMessage(["State", "Reason"], [LoginState.FAIL, LoginFailedReason.WRONG_PASSWORD]);
        }
    }
    else 
    {
        response = MakeMessage(["State", "Reason"], [LoginState.FAIL, LoginFailedReason.USERNAME_NOT_FOUND]);
    }
    socket.emit(EventName.EVENT_LOGIN, response);
}

async function ProcessLogout(socket : SocketIO.Socket, data : any)
{
    console.log(data);
}

async function ProcessRegister(socket : SocketIO.Socket, data : any)
{
    let json : any = JSON.parse(data);
    let new_player_id : string = v4();

    //insert to database
}

function ProcessCreateRoom(socket : SocketIO.Socket, data : any)
{
    console.log(data);
}

function ProcessJoinRoom(socket : SocketIO.Socket, data : any)
{
    console.log(data);

    
        //verify password if set

        //inform other player
        //socket.join(data.room_name);
}

function ProcessLeaveRoom(socket : SocketIO.Socket, data : any)
{
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
}

function ProcessStartGame(socket : SocketIO.Socket, data : any)
{
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
}

async function ProcessBuyItem(socket : SocketIO.Socket, data : any)
{

}

async function ProcessSaveItem(socket : SocketIO.Socket, data : any)
{

}

async function ProcessGetRooms(socket : SocketIO.Socket, data : any)
{
    console.log("Getting rooms");
}

function ProcessDisconnect(socket : SocketIO.Socket, reason : SocketIO.DisconnectReason)
{
    const current_room : string = socket.rooms.values().next().value || "default" ;
    if(current_room != "default")
    {
        SocketServer.to(current_room).emit("player disconnect", /* custom data */);
    }
    console.log("User disconnect with reason: " + reason);
    ActiveUsers.delete(socket.id);
}

function ProcessReconnect(socket : SocketIO.Socket, data : any)
{

}

async function ProcessModifyNickName(socket : SocketIO.Socket, data : any)
{
    let json : any = JSON.parse(data);
    let User : UserInfo | undefined = ActiveUsers.get(socket.id);
    if(User)
    {
        if(User.IsFirstLogin)
        {
            await DBHelper.Update(DBPool, "user_info", "ID", User.ID, ["IsFirstLogin", "NickName"], [0, json.NickName]);
            User.IsFirstLogin = false;
            User.NickName = json.NickName;
        }
        else
        {
            await DBHelper.Update(DBPool, "user_info", "ID", User.ID, ["NickName"], [json.NickName]);
            User.NickName = json.NickName;
        }

        socket.emit(EventName.EVENT_MODIFY_NICKNAME, MakeMessage(['NickName'], [json.NickName]));
    }
}

//Make message
function MakeMessage(keys : string[], values : any) : any
{
    let message : any = {};
    for(let i = 0; i < keys.length; i++)
    {
        message[keys[i]] = values[i];
    }
    return message;
}