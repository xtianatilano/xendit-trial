require('dotenv').config();
import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
// import * as swaggerDocument from './swagger.json';

interface ApplicationProps { port: number; controllers: any; middlewares: any }

class App {
    public app: Application;
    public port: number

    constructor(application: ApplicationProps) {
        this.port = application.port;
        this.app = express();
        this.middlewares(application.middlewares);
        this.routes(application.controllers);
        // add swagger route
        // this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    public listen() {
        this.app.listen(this.port, () => {
          return console.log(`server is listening on ${this.port}`);
        });
    }

    /**
     * This will initialize middlewares
     * @param middleware
     */
    private middlewares(middlewares: { forEach: (arg0: (middleware: any) => void) => void; }) {
      middlewares.forEach(middleware => {
          this.app.use(middleware)
      })
  }

    /**
     * This will initialize routes per controller
     * @param controllers controllers provided in server.ts
     */
    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }): void {
        controllers.forEach(controller => {
            this.app.use('/', controller.router)
        })
    }
}

export default App;