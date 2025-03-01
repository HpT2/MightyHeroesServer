export class EventName
{
    public static EVENT_LOGIN : string = "login";
    public static EVENT_MODIFY_NICKNAME : string = "modify nickname";
    public static EVENT_GET_ROOM_LIST : string = "get room list";
}

export class LoginFailedReason
{
    public static WRONG_PASSWORD : string = "wrong password";
    public static USERNAME_NOT_FOUND : string = "username not found";
}

export class LoginState
{
    public static SUCCESS : string = "success";
    public static FAIL : string = "failed";
}