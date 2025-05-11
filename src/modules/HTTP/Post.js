//-----------Подключаемые модули-----------//
const WorkerController = require('./../worker/WorkerController');
const bodyParser = require('body-parser');
const config_restapi = require('./../../../config/restapi.json');
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
}

//-----------Экспортируемые модули-----------//
module.exports = Post;
//-----------Экспортируемые модули-----------//










