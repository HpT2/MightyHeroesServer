import * as MySQL from "mysql"

var db_config = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "game_db"
};

export var DBPool = MySQL.createPool(db_config);

export function Select(pool : MySQL.Pool, table : string, field : string[] | "*" = "*")
{

}

export function Insert(pool : MySQL.Pool, table : string, value : string[])
{

}

export function Update(pool : MySQL.Pool, table : string, field : string[], value : string[])
{

}

export function Delete(pool : MySQL.Pool, table : string, key : string)
{

}