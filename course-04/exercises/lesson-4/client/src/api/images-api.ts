import { apiEndpoint } from "../config";
import { ImageModel } from "../types/ImageModel";
import { ImageUploadInfo } from "../types/ImageUploadInfo";
import { ImageUploadResponse } from "../types/ImageUploadResponse";

export async function getImages(groupId: string): Promise<ImageModel[]> {
  console.log("Fetching images");
  const response = await fetch(`${apiEndpoint}/groups/${groupId}/images`);
  const result = await response.json();

  return result.items;
}

/**
 * Creates image
 * @param newImage
 * @returns image
 */
export async function createImage(
  newImage: ImageUploadInfo
): Promise<ImageUploadResponse> {
  const reply = await fetch(
    `${apiEndpoint}/groups/${newImage.groupId}/images`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newImage.title
      })
    }
  );

  return await reply.json();
}

/**
 * Uploads file
 * @param uploadUrl
 * @param file
 * @returns file
 */
export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await fetch(uploadUrl, {
    method: "PUT",
    body: file
  });
}
