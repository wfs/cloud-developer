import { GroupModel } from "../types/GroupModel";
import { apiEndpoint } from "../config";
import { GroupUploadInfo } from "../types/GroupUploadInfo";

/**
 * Gets groups
 * @returns groups
 */
export async function getGroups(): Promise<GroupModel[]> {
  console.log("Fetching groups");

  const response = await fetch(`${apiEndpoint}/groups`);
  console.log("response: ", response);
  const result = await response.json();
  console.log("result: ", result);

  return result.items;
}

/**
 * Creates group
 * @param newGroup
 * @returns group
 */
export async function createGroup(
  newGroup: GroupUploadInfo
): Promise<GroupModel> {
  const reply = await fetch(`${apiEndpoint}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: newGroup.name,
      description: newGroup.description
    })
  });
  const result = await reply.json();
  return result.newItem;
}
