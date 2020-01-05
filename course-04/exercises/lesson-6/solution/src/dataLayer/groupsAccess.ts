import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const XAWS = AWSXRay.captureAWS(AWS);

import { Group } from "../models/Group";

export class GroupAccess {
  /**
   * Creates an instance of group access.
   * @param [docClient]
   * @param [groupsTable]
   */
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly groupsTable = process.env.GROUPS_TABLE
  ) {}

  /**
   * Gets all groups
   * @returns all groups
   */
  async getAllGroups(): Promise<Group[]> {
    console.log("Getting all groups");

    const result = await this.docClient
      .scan({
        TableName: this.groupsTable
      })
      .promise();

    const items = result.Items;
    return items as Group[];
  }

  /**
   * Creates group
   * @param group
   * @returns group
   */
  async createGroup(group: Group): Promise<Group> {
    await this.docClient
      .put({
        TableName: this.groupsTable,
        Item: group
      })
      .promise();

    return group;
  }
}

/**
 * Creates dynamo dbclient
 * @returns
 */
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log("Creating a local DynamoDB instance");
    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000"
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}
