//-----------Подключаемые модули-----------//
const WorkerController = require('./../worker/WorkerController');
const bodyParser = require('body-parser');
const config_restapi = require('./../../../config/restapi.json');
const sequelize = require('./../sequelize/db');
//-----------Подключаемые модули-----------//

/**
 * Класс для работы с Post запросами к серверу
 */
class Post {
  /** Объект для работы с сервером */
  app;
  /** Массив обрабатываемых маршрутов */
  routes;

  /** Конструктор класса */
  constructor(app) {
    this.app = app;
    this.routes = config_restapi.POST;
    this.PostBodyParser();
    this.ListPost();
  }

  /**
   * Список всех обрабатываемых сервером Post запросов
   */
  ListPost() {
    for(let i = 0; i < this.routes.length; i++) {
      this.app.post(this.routes[i], (req, res) => {
        req.query.type_request = `POST ${this.routes[i]}`;
        WorkerController.HandleRequest(req, res);
      });
    }
  }

  /**
   * 
   */
  PostBodyParser() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  /**
   * Функция, которая обрабатывает CRUD-операции
   */
  static async CRUD(message, model) {
    // Проверка наличия связей many-to-many
    let hasManyToMany = Object.values(model.associations).some(
      association => association.associationType === 'BelongsToMany'
    );
    // Получаем список всех many-to-many
    let modelAssociations;
    if(hasManyToMany) {
      modelAssociations = Object.values(model.associations)
        .filter(a => a.associationType === 'BelongsToMany')
        .map(a => a.as);
    }

    if(message.body.act == 'create') {
      let result;
      
      result = await model.create(message.body.object);

      if(hasManyToMany) {
        for(let association of modelAssociations) {
          if(message.body.object[association] !== undefined) {
            await result[`add${association}`](message.body.object[association]);
          }
        }
      }

      return result.dataValues;
    }
    else if(message.body.act == 'read') {
      let params = {};

      if(hasManyToMany) {
        params.include = modelAssociations;
      }

      if(message.body.selection_type == "one") {
        return await model.findByPk(message.body.object.id, params);
      }
      else if(message.body.selection_type == "all") {
        return await model.findAll(params);
      }
    }
    else if(message.body.act == 'update') {

    }
    else if(message.body.act == 'delete') {

    }
    else {
      return "bad act";
    }
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Post;
//-----------Экспортируемые модули-----------//










