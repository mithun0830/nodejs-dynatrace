# Simple Node.js API with Dynatrace Monitoring

This project is a simple Node.js API containerized with Docker and monitored using Dynatrace.

## Prerequisites

- Google Cloud Platform account
- Dynatrace account
- Docker and Docker Compose installed on your local machine

## Deployment to Google Cloud VM

1. Create a new VM instance in Google Cloud Platform.
2. Install Docker and Docker Compose on the VM.
3. Clone this repository to the VM.
4. Navigate to the project directory.
5. Build and run the Docker container:
   ```
   docker-compose up -d --build
   ```

## Setting up Dynatrace Monitoring

1. Log in to your Dynatrace SaaS account.
2. Ensure that the OneAgent is installed on your Google Cloud VM.
3. Get your Dynatrace environment information:
   - Get your environment ID (tenant) from your Dynatrace URL
   - Generate an API token with the following permissions:
     * metrics.ingest
     * metrics.read
     * logs.ingest
     * logs.read

4. Create a `.env` file in the project root with your Dynatrace credentials:
   ```
   DT_TENANT=your-environment-id.live.dynatrace.com
   DT_API_TOKEN=your-api-token
   ```
   Note: Never commit this file to version control. It's already included in .gitignore.

5. For local development, you can create a `.env.local` file with your development credentials. This file is also ignored by git.

5. Enable Log Monitoring:
   - Go to "Settings" > "Log Monitoring" and enable it
   - Set up a new log source:
     * Go to "Settings" > "Log Monitoring" > "Log sources and storage"
     * Click "Add log source"
     * Choose "File-based log source"
     * Set the log source name (e.g., "Simple Node.js API")
     * Set the log directory path to `/var/log/nodejs`
     * Set the log file pattern to `*.log`

6. Deploy the application:
   ```bash
   docker-compose up -d --build
   ```

## Viewing API Metrics and Logs in Dynatrace

1. View Service Metrics:
   - Go to "Applications & Microservices" > "Services"
   - Find and click on "simple-nodejs-api"
   - View default metrics like response time, throughput, and failure rate

2. View Custom Metrics:
   - Go to "Metrics" in the navigation menu
   - Search for custom metrics with prefix "custom.simple-nodejs-api"
   - Available custom metrics include:
     * itemCount: Number of items in the API
     * apiCallDuration: Duration of API calls by endpoint
     * error metrics for failed requests

3. Create a Custom Dashboard:
   - Go to "Dashboards" > "Create dashboard"
   - Add tiles for:
     * Service response time
     * Request count by endpoint
     * Custom metrics (itemCount, apiCallDuration)
     * Error rates and types

4. View API Logs:
   - Go to "Logs" in the navigation menu
   - Use query: `service:simple-nodejs-api`
   - Filter options:
     * By endpoint: `path:/api/items`
     * By status: `statusCode:200`
     * By request type: `message:"API Request"`

5. Set up Alerts:
   - Go to "Settings" > "Anomaly detection" > "Custom metrics"
   - Create alerts for:
     * High response times
     * Error rate increases
     * Unusual item count changes

## Troubleshooting

If you don't see logs in Dynatrace:
1. Ensure the OneAgent is properly installed and running on your VM.
2. Check that the log file is being created at `/var/log/nodejs/api.log`.
3. Verify that the Dynatrace log source is correctly configured.
4. Review the Dynatrace documentation for any additional steps specific to your environment.

## Security Notes

1. Always use environment variables for sensitive information like API keys and tokens.
2. Never commit .env files or any files containing secrets to version control.
3. Use .gitignore to exclude files that may contain sensitive information.
4. For production deployments, use secure secret management solutions provided by your cloud platform.
5. Regularly rotate your API tokens and update your environment variables accordingly.

## API Endpoints

- GET /health: Health check endpoint
- GET /api/items: Get all items
- GET /api/items/:id: Get a specific item by ID
- POST /api/items: Create a new item

## Local Development

1. Install dependencies:
   ```
   npm install
   ```
2. Run the application:
   ```
   npm run dev
   ```

The API will be available at http://localhost:3000.
