import { rejects } from "assert";
import * as MySQL from "mysql"
import { resolve } from "path";

var db_config = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "Mighty Heroes"
};

export var DBPool = MySQL.createPool(db_config);

export function Select(pool : MySQL.Pool, table : string, key : string, valueOfKey : string, field : string[] | "*" = "*")
{
    let SelectedField : string = field != "*" ? field.join(",") : field;
    let query : string = `Select ${SelectedField} from \`${table}\` where ${key} = '${valueOfKey}'`;

    console.log(query);
    return new Promise((resolve, reject) => {
        pool.query(query, (err : any, res : any) => {
            if(err)
            {
                console.log(err);
                reject(err);
            } 
            else
            {
                resolve(res);
            }  
        });
    });
}

export function Insert(pool : MySQL.Pool, table : string, columns : string[], values : any)
{
    let inserted_values : string = values.join(",");
    let inserted_columns : string = columns.join(","); 
    let query : string = `insert into \`${table}\` (${inserted_columns}) values (${inserted_values})`;

    console.log(query);
    return new Promise((resolve, reject) => {
        pool.query(query, (err : any, res : any) => {
            if(err)
            {
                console.log(err);
                reject(err);
            } 
            else
            {
                resolve(res);
            }  
        });
    })
}

export function Update(pool : MySQL.Pool, table : string, key : string, valueOfKey : string, fields : string[], values : any)
{
    if(fields.length != values.length)
    {
        console.log("fields and values must be same length for update statement");
        return [];
    }

    let update_array : string[] = [];
    for(let i = 0; i < fields.length; i++)
    {
        update_array.push(`${fields[i]} = '${values[i]}'`);
    }
    let updated_fields : string = update_array.join(",");
    let query : string = `update ${table} set ${updated_fields} where ${key} = '${valueOfKey}'`;

    console.log(query);
    return new Promise((resolve, reject) => {
        pool.query(query, (err : any, res : any) => {
            if(err)
            {
                console.log(err);
                reject(err);
            } 
            else
            {
                resolve(res);
            }       
        });
    })
}

export function Delete(pool : MySQL.Pool, table : string, key : string, valueOfKey : string)
{
    let query : string = `delete from \`${table}\` where ${key} = '${valueOfKey}'`;

    console.log(query);
    return new Promise((resolve, reject) => {
        pool.query(query, (err : any, res : any) => {
            if(err)
            {
                console.log(err);
                reject(err);
            } 
            else
            {
                resolve(res);
            }  
        });
    })
}

export class TableName
{
    public static USER_INFO_TBL : string = "user_info";
}