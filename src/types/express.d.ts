declare module "express" {
  import * as http from "http";
  import { IncomingMessage, ServerResponse } from "http";
  type Request = IncomingMessage & { params: any; body?: any };
  type Response = ServerResponse & {
    json: (body: any) => void;
    status: (code: number) => Response;
  };
  function express(): any;
  namespace express {}
  export = express;
}
