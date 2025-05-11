//-----------Подключаемые модули-----------//
const WorkerController = require('./../worker/WorkerController');
const config_restapi = require('./../../../config/restapi.json');
//-----------Подключаемые модули-----------//

/**
 * Класс для работы с Get запросами к серверу
 */
class Get {
  /** Объект для работы с сервером */
  app;
  /** Массив обрабатываемых маршрутов */
  routes;

  /** Конструктор класса */
  constructor(app) {
    this.app = app;
    this.routes = config_restapi.GET;
    this.ListGet();
  }

  /**
   * Список всех обрабатываемых сервером Get запросов
   */
  ListGet() {
    for(let i = 0; i < this.routes.length; i++) {
      this.app.get(this.routes[i], (req, res) => {
        req.query.type_request = `GET ${this.routes[i]}`;
        WorkerController.HandleRequest(req, res);
      });
    }
  }
}

//-----------Экспортируемые модули-----------//
module.exports = Get;
//-----------Экспортируемые модули-----------//










