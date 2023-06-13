import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

// レスポンスを返すための関数
const sendResponse = (
  response: functions.Response,
  statusCode: number,
  body: any
) => {
  response.send({
    statusCode,
    body: JSON.stringify(body),
  });
};

export const addDataset = functions.https.onRequest(
  async (req: any, res: any) => {
    if (req.method !== "POST") {
      console.log(res);
      sendResponse(res, 405, {error: "invalid request"});
    } else {
      // datasetにreq.bodyを代入している
      // req.bodyとしてjsonファイルが渡される
      const dataset = req.body;
      // datasetはオブジェクトなので、keyを取り出して配列を作る必要がある
      for (const key of Object.keys(dataset)) {
        const data = dataset[key];
        await db.collection("questions").doc(key).set(data);
      }
      sendResponse(res, 200, {message: "successfully added data"});
    }
  }
);
