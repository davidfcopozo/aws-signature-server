// save as aws-signature-server.js
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();
app.use(bodyParser.json());

function sign(key, msg) {
  return crypto.createHmac("sha256", key).update(msg, "utf8").digest();
}
function sha256(msg) {
  return crypto.createHash("sha256").update(msg, "utf8").digest("hex");
}
function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = sign("AWS4" + key, dateStamp);
  const kRegion = sign(kDate, regionName);
  const kService = sign(kRegion, serviceName);
  const kSigning = sign(kService, "aws4_request");
  return kSigning;
}

app.post("/sign", (req, res) => {
  const {
    accessKey,
    secretKey,
    region,
    service,
    host,
    endpoint,
    amzTarget,
    contentEncoding,
    userAgent,
    requestPayload,
  } = req.body;

  const now = new Date();
  const amzDate =
    now
      .toISOString()
      .replace(/[:-]|\.\d{3}/g, "")
      .slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);

  const canonicalUri = "/paapi5/searchitems";
  const canonicalQuerystring = "";
  const canonicalHeaders =
    `content-encoding:${contentEncoding}\n` +
    `host:${host}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:${amzTarget}\n`;
  const signedHeaders = "content-encoding;host;x-amz-date;x-amz-target";
  const payloadHash = sha256(JSON.stringify(requestPayload));

  const canonicalRequest = `POST\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${sha256(
    canonicalRequest
  )}`;

  const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign, "utf8")
    .digest("hex");

  const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  res.json({
    "X-Amz-Date": amzDate,
    Authorization: authorizationHeader,
  });
});

app.listen(3000, () =>
  console.log("AWS Signature server running on port 3000")
);
