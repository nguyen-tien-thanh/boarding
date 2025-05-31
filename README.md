<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Boarding Microservice

A NestJS microservice for managing boarding houses, rooms, and related services using RabbitMQ and PostgreSQL with Prisma.

## Features

- **RabbitMQ Consumer**: Processes events for houses, rooms, maintenance, and QR codes
- **PostgreSQL Database**: Using Prisma ORM for data management
- **Event-Driven Architecture**: Handles various boarding-related events
- **Data Models**: Houses, Rooms, Room Images, Assets, Tenant Contracts, QR Codes, Maintenance

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
# Start PostgreSQL and RabbitMQ
docker-compose up -d
```

### 3. Setup Environment

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boarding?schema=public"

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

## Database Schema

The service uses the following main entities:

- **House**: Main property entity with owner information
- **Room**: Individual rooms within houses
- **RoomImage**: Images for rooms with type classification
- **Asset**: Furniture and equipment catalog
- **RoomAsset**: Assets assigned to specific rooms
- **TenantContract**: Rental agreements
- **QRCode**: QR codes for house identification
- **Maintenance**: Maintenance requests and tracking

## Supported Events

The microservice consumes the following RabbitMQ events:

### House Events

- `house.created` - Creates a new house
- `house.updated` - Updates house information

### Room Events

- `room.created` - Creates a new room

### Maintenance Events

- `maintenance.created` - Creates a maintenance request

### QR Code Events

- `qr.generated` - Generates QR code for house

## Event Payload Examples

### House Created Event

```json
{
  "name": "Sunny Villa",
  "address": "123 Main Street, City",
  "ownerId": "uuid-owner-id",
  "description": "Beautiful house with garden",
  "totalArea": 150.5,
  "totalRooms": 4,
  "status": "ACTIVE"
}
```

### Room Created Event

```json
{
  "name": "Room A1",
  "roomNumber": "A1",
  "area": 25.0,
  "baseRent": 500.0,
  "houseId": "uuid-house-id",
  "description": "Spacious room with balcony",
  "status": "AVAILABLE"
}
```

### Maintenance Created Event

```json
{
  "roomId": "uuid-room-id",
  "reportedBy": "uuid-user-id",
  "assignedTo": "uuid-technician-id",
  "title": "Air conditioner repair",
  "description": "AC not cooling properly",
  "priority": "HIGH",
  "status": "REPORTED",
  "cost": 150.0
}
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
- **PostgreSQL**: localhost:5432
- **Prisma Studio**: http://localhost:5555 (when running)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   RabbitMQ      │────│  Boarding       │────│   PostgreSQL    │
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the UNLICENSED License.
