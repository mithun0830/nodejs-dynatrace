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

1. Log in to your Dynatrace account.
2. Go to "Deploy Dynatrace" > "Start installation" > "Linux".
3. Copy the OneAgent download command.
4. SSH into your Google Cloud VM and run the copied command to install the OneAgent.
5. In the Dynatrace web UI, go to "Settings" > "Server-side service monitoring" > "Deep monitoring" > "Node.js".
6. Follow the instructions to enable Node.js monitoring.

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
