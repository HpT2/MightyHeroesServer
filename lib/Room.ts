import { Socket } from "socket.io";

export class Room 
{
    private isStarted : boolean = false;
    password : string = "";
    name : string = "";
    socket_lst : Socket[] = [];

    constructor(name : string, password : string, creator : Socket)
    {
        this.name = name;
        this.password = password;
        this.socket_lst.push(creator);
    }

    public Add(InSocket : Socket) : void 
    {
        this.socket_lst.push(InSocket);
    }

    public Remove(RemovedSocket : Socket) : void
    {
        const index = this.socket_lst.findIndex(socket => socket === RemovedSocket);
        if(index != -1)
        {
            this.socket_lst.splice(index, 1);
        }
    }

    public StartGame()
    {
        this.isStarted = true;
    }

    public IsGameStarted()
    {
        return this.isStarted;
    }
}

