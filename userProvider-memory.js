const bcrypt = require('bcrypt');

var userCounter = 1;
let salt = bcrypt.genSaltSync(10);
let hash =bcrypt.hashSync("teste", salt);
var users = [];

class User{
    async create(name, email, passwd){
        if(name == undefined){
            return false;
        }
        else if(email == undefined){
            return false;
        }
        else if(passwd == undefined || passwd.length < 5){
            return false;
        }
        let salt = bcrypt.genSaltSync(10);
        let hash = await bcrypt.hashSync(passwd, salt);
        
        var user = {
            id:userCounter,
            name,
            email,
            passwd:hash
        }
        userCounter++;
        users.push(user);
        return true;
    }

    async findByPk(pk){

        for(let i = 0; i < users.length; i++){
            if(users[i].id == pk){
                return {user:users[i]};
            }
        }
        return undefined;
    }
    async findByEmail(email){
        for(let i = 0; i < users.length; i++){
            if(users[i].email == email){
                return {user:users[i]};
            }
        }
       return undefined;
    }

}
module.exports = new User();