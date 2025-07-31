# AWS Signature Server

A lightweight Express.js server that generates AWS signatures for API requests. This server is designed to be deployed on Render and provides CORS-enabled endpoints for generating AWS signatures.

## Features

- ✅ AWS signature generation for API requests
- ✅ CORS enabled for cross-origin requests
- ✅ Health check endpoints
- ✅ Ready for Render deployment
- ✅ Environment variable configuration

## Endpoints

### `GET /`

Health check endpoint that returns server status.

**Response:**

```json
{
  "status": "AWS Signature Server is running",
  "timestamp": "2025-07-31T12:00:00.000Z"
}
```

### `GET /health`

Simple health check endpoint.

**Response:**

```json
{
  "status": "healthy"
}
```

### `POST /sign`

Generate AWS signatures for API requests.

**Request Body:**

```json
{
  "accessKey": "your-aws-access-key",
  "secretKey": "your-aws-secret-key",
  "region": "us-east-1",
  "service": "ProductAdvertisingAPI",
  "host": "webservices.amazon.com",
  "endpoint": "https://webservices.amazon.com",
  "amzTarget": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
  "contentEncoding": "amz-1.0",
  "userAgent": "YourApp/1.0",
  "requestPayload": {
    // Your API request payload
  }
}
```

**Response:**

```json
{
  "X-Amz-Date": "20250731T120000Z",
  "Authorization": "AWS4-HMAC-SHA256 Credential=..."
}
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## Deployment to Render

### Option 1: Deploy from GitHub

1. Push this code to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18 or higher

### Option 2: Deploy from Local Directory

1. Install Render CLI:

```bash
npm install -g @render/cli
```

2. Login to Render:

```bash
render login
```

3. Deploy:

```bash
render deploy
```

## Environment Variables

The server uses the following environment variables:

- `PORT`: Port number (automatically set by Render)

## CORS Configuration

The server is configured with CORS enabled to allow cross-origin requests from any domain. This is suitable for development and testing. For production, consider restricting CORS to specific origins.

## Security Considerations

⚠️ **Important**: This server processes AWS credentials. Make sure to:

1. Use HTTPS in production
2. Validate and sanitize all inputs
3. Consider rate limiting
4. Monitor for suspicious activity
5. Never log sensitive credentials

## License

MIT License
