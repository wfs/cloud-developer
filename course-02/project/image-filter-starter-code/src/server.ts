import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  //
  // RUBIC
  //  Development Server
  //    The project demonstrates an understanding of RESTFUL design
  //      The stubbed @TODO1 endpoint in src/server.ts is completed and accepts valid requests including:
  //      http://localhost:{{PORT}}/filteredimage?image_url=https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg
  //
  //    The project demonstrates an understanding of HTTP status codes
  //      Successful responses have a 200 code, at least one error code for caught errors (i.e. 422)

  /**************************************************************************** */

  app.get( "/filteredimage", requireAuth, async (request, response) => {
    let isValid, filteredImagePath;
    try {
        isValid = await imageExists(request.query.image_url);

        if (isValid) {
            filteredImagePath = await filterImageFromURL(request.query.image_url);
            response.sendFile(filteredImagePath);
        } else {
            return response.send('This is not a valid image');
        }
    } catch(e) {
        response.send(e);
    }
  });

  // POST /filter-image
  // endpoint to upload image and filter
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.post(
      '/filter-image', 
      upload.single('file'),
      requireAuth,
      async (request, response) => {
          
          if (!request.file || !isValidImageFileExt(path.extname(request.file.originalname))) {
              return response
                  .status(403)
                  .contentType('text/plain')
                  .end('This is a not valid image file');
          }

          const filteredImagePath = await filterImageFromURL(path.join(appRoot.path, request.file.path));
          response.sendFile(filteredImagePath); 
      }
  )

  // POST /clear-files
  // endpoint to delete temp. and uploaded files
  // RETURNS
  //    String response
  app.post('/clear-files', requireAuth, async (request, response) => {
      deleteLocalFiles(getTempFiles());
      deleteLocalFiles(getUploadedFiles());
      response.send('All image files have been removed');
  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
