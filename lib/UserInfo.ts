export class UserInfo 
{
    public ID : string = "";
    public UserName : string = "";
    public IsFirstLogin : boolean = true;
    public NickName : string = "";

    constructor(data?: Partial<UserInfo>) {
        this.ID = data?.ID || "";
        this.UserName = data?.UserName || "";
        this.IsFirstLogin = data?.IsFirstLogin ?? true;
    }
}
