import "source-map-support/register";
//import { getAllGroups } from "../../businessLogic/groups";
import { GroupAccess } from "../../dataLayer/groupsAccess";

import * as express from "express";
import * as awsServerlessExpress from "aws-serverless-express";

const app = express();
const groupAccess = new GroupAccess();

app.get("/groups", async (_req, res) => {
  const groups = await groupAccess.getAllGroups();

  res.json({
    items: groups
  });
});

const server = awsServerlessExpress.createServer(app);
exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
