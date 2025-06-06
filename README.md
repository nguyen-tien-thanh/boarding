# Boarding Microservice

A microservice for managing boarding houses, rooms, and related services using RabbitMQ and MySQL with Prisma.

## Features

- **RabbitMQ Consumer**: Processes events for houses, rooms, assets, tenant contracts, and QR codes
- **MySQL Database**: Using Prisma ORM for data management
- **Event-Driven Architecture**: Handles various boarding-related events
- **Data Models**: Houses, Rooms, Assets, Asset Categories, Room Assets, Tenant Contracts, QR Codes

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Yarn package manager

## Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Start Infrastructure

```bash
# Start MySQL and RabbitMQ
docker-compose up -d
```

### 3. Setup Environment

Create a `.env` file:

```env
# Database
DATABASE_URL="mysql://root:root@localhost:3306/boarding"

# RabbitMQ
RABBITMQ_URL="amqp://localhost:5672"
RABBITMQ_QUEUE="boarding_queue"

# Application
NODE_ENV="development"
PORT="3000"
```

### 4. Setup Database

```bash
# Generate Prisma client
yarn db:generate

# Run database migrations
yarn db:migrate

# (Optional) Open Prisma Studio
yarn db:studio
```

### 5. Start the Service

```bash
# Development mode
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

## Database Schema (ERD)

![ERD Diagram](erd.png)

## Message Patterns

The microservice uses a standardized pattern format for all RabbitMQ messages:

```
{lowercaseEntityName}.{action}
```

For example:

- `house.create` - Create a new house
- `room.findAll` - Get all rooms
- `assetCategory.findOne` - Get a specific asset category

### Pattern Structure

- **Entity Name**: Lowercase name of the entity (house, room, asset, etc.)
- **Action**: The operation to perform (create, findAll, findOne, update, remove)

### Example RabbitMQ Requests

#### 1. Create House

```bash
# Queue: boarding_queue
# Pattern: house.create
# Payload:
{
  "name": "Sunny Villa",
  "address": "123 Main Street, City",
  "ownerId": 1,
  "description": "Beautiful house with garden",
  "totalArea": 150.5,
  "totalRooms": 4,
  "status": "ACTIVE",
  "createdBy": 1
}
```

#### 2. Find All Rooms

```bash
# Queue: boarding_queue
# Pattern: room.findAll
# Payload: {}
```

#### 3. Update Asset

```bash
# Queue: boarding_queue
# Pattern: asset.update
# Payload:
{
  "id": 1,
  "data": {
    "name": "Updated Queen Size Bed",
    "description": "New comfortable queen size bed",
    "updatedBy": 1
  }
}
```

#### 4. Create Room Asset

```bash
# Queue: boarding_queue
# Pattern: roomAsset.create
# Payload:
{
  "roomId": 1,
  "assetId": 1,
  "quantity": 2,
  "createdBy": 1
}
```

#### 5. Find One Tenant Contract

```bash
# Queue: boarding_queue
# Pattern: tenantContract.findOne
# Payload: 1  # Contract ID
```

#### 6. Remove QR Code

```bash
# Queue: boarding_queue
# Pattern: qrCode.remove
# Payload: 1  # QR Code ID
```

### Testing with RabbitMQ Management UI

1. Access RabbitMQ Management UI at http://localhost:15672 (guest/guest)
2. Go to "Queues" tab
3. Select "boarding_queue"
4. Click "Publish message"
5. Enter the pattern in "Routing key"
6. Enter the payload in "Payload"
7. Click "Publish message"

### Testing with amqp-tools

```bash
# Install amqp-tools
apt-get install amqp-tools

# Publish a message
amqp-publish --url=amqp://localhost:5672 \
  --routing-key=house.create \
  --body='{"name":"Sunny Villa","address":"123 Main Street","ownerId":1,"description":"Beautiful house","totalArea":150.5,"totalRooms":4,"status":"ACTIVE","createdBy":1}'

# Consume messages
amqp-consume --url=amqp://localhost:5672 \
  --queue=boarding_queue \
  --ack
```

## Development Scripts

```bash
# Install dependencies
yarn install

# Start development server
yarn start:dev

# Build for production
yarn build

# Run tests
yarn test

# Database operations
yarn db:generate    # Generate Prisma client
yarn db:migrate     # Run migrations
yarn db:push        # Push schema changes
yarn db:studio      # Open Prisma Studio

# Linting and formatting
yarn lint
yarn format
```

## Services Access

- **Application**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **MySQL**: localhost:3306
- **Prisma Studio**: http://localhost:5555 (when running)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   RabbitMQ      │────│  Boarding       │────│   MySQL         │
│   Message       │    │  Microservice   │    │   Database      │
│   Queue         │    │  (NestJS)       │    │   (Prisma)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Error Handling

The service implements robust error handling:

- Message acknowledgment on successful processing
- Message rejection and requeue on failures
- Comprehensive logging for debugging
- Database transaction rollback on errors
