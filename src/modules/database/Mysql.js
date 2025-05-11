//-----------Подключаемые модули-----------//
const mysql = require('mysql2');
const config_databases = require('./../../../config/databases.json');
//-----------Подключаемые модули-----------//

/**
 * Класс для работы с базой данных Mysql
 */
class Mysql {
    static databases = config_databases.mysql;

    /** 
     * Асинхронная функция, которая отправляет SQL команду в mysql по данным из переменной connection
     */
    static async Request(database, command) {
        let connection = await this.NewConnection(database);
        let result = "null";
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

        connection.connect();
        connection.query(command, function (error, results, fields) {
            if (error) {
                console.log(error);
                result = "Error request";
            } else {
            result = results;
            }
        });
        connection.end();

        while (result == "null") {
            await delay(5);
        }

        return result;
    }

    /**
     * Функция, которая создаёт переменную, через которую мы общаемся с базой данных
     */
    static async NewConnection(database) {
        /** Переменная, через которую мы общаемся с базой данных */
        let connection = mysql.createConnection({
            database: database,
            host: this.databases[database].host,
            user: this.databases[database].user,
            password: this.databases[database].password,
        });
        return connection;
    }
}

//-----------Экспортируемые модули-----------//
module.exports = Mysql;
//-----------Экспортируемые модули-----------//