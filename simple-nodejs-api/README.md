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
3. In the Dynatrace web UI, go to "Settings" > "Log Monitoring" and enable it if not already done.
4. Set up a new log source:
   - Go to "Settings" > "Log Monitoring" > "Log sources and storage"
   - Click "Add log source"
   - Choose "File-based log source"
   - Set the log source name (e.g., "Simple Node.js API")
   - Set the log directory path to `/var/log/nodejs`
   - Set the log file pattern to `*.log`
   - Configure any additional settings as needed

## Viewing API Logs in Dynatrace

1. In the Dynatrace web UI, go to "Logs" in the navigation menu.
2. Use the following query to filter logs from your API:
   ```
   service:simple-nodejs-api
   ```
3. You can further refine your search using additional filters or by searching for specific log content.
4. To view detailed information about API requests:
   - Look for log entries with the message "API Request"
   - These entries contain information such as method, path, status code, and duration

## Troubleshooting

If you don't see logs in Dynatrace:
1. Ensure the OneAgent is properly installed and running on your VM.
2. Check that the log file is being created at `/var/log/nodejs/api.log`.
3. Verify that the Dynatrace log source is correctly configured.
4. Review the Dynatrace documentation for any additional steps specific to your environment.

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
