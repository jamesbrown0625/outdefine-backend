import { bucketName, s3 } from "@config";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuid } from "uuid";
import path from "path";
const Busboy = require("busboy");

interface MultipartFile {
  filename?: {
    filename?: string
  }
  content?: Buffer
  contentType?: string
  encoding?: string
  fieldname?: string
}

const parse = (event) =>
  new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: {
        "content-type": event.headers["content-type"] || event.headers["Content-Type"],
      },
    });
    const result = {
      files: [],
    };

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const uploadFile: MultipartFile = {};

      file.on("data", (data) => {
        uploadFile.content = data;
      });

      file.on("end", () => {
        if (uploadFile.content) {
          uploadFile.filename = filename;
          uploadFile.contentType = mimetype;
          uploadFile.encoding = encoding;
          uploadFile.fieldname = fieldname;
          result.files.push(uploadFile);
        }
      });
    });

    busboy.on("field", (fieldname, value) => {
      result[fieldname] = value;
    });

    busboy.on("error", (error) => {
      reject(error);
    });

    busboy.on("finish", () => {
      resolve(result);
    });

    const encoding = event.encoding || (event.isBase64Encoded ? "base64" : "binary");

    busboy.write(event.body, encoding);
    busboy.end();
  });

const upload = async (event: APIGatewayProxyEvent) => {
  const result = (await parse(event)) as any;
  const { filename, content } = result.files[0];
  const newName = `${uuid()}${path.parse(filename.filename).ext}`;

  await s3
    .putObject({ Bucket: bucketName, Key: newName, ACL: "public-read", Body: content })
    .promise();
  return `https://${bucketName}.s3.amazonaws.com/${newName}`;
};

export { upload };
