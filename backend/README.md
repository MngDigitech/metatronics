# Methertech Backend

The Methertech Backend is the server-side application for the Methertech e-commerce catalogue migration project.

The project aims to move product catalogue data from hardcoded JSON files into a structured database, making product information easier to manage, retrieve and maintain through a backend API.

The backend is built with **NestJS, TypeScript, Prisma ORM and PostgreSQL**.

## Project Objectives

- Replace hardcoded product data with database-driven data.
- Provide REST API endpoints for accessing product catalogue information.
- Separate backend business logic from frontend presentation.
- Support maintainable and scalable data access.
- Establish a foundation for future catalogue management features.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js 22 | JavaScript runtime |
| NestJS 12 | Backend application framework |
| TypeScript | Application development |
| PostgreSQL | Relational database |
| Prisma ORM 7 | Database access and schema management |
| Vitest | Unit and end-to-end testing |
| Oxlint | Code quality and linting |
| GitHub Actions | Continuous Integration |

## Project Structure

```text
metatronics/
├── .github/
│   └── workflows/
│       └── backend-ci.yml
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.controller.spec.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── test/
│   │   └── app.e2e-spec.ts
│   ├── prisma7.config.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── README.md
│
├── assets/
├── data.json
├── index.html
├── products.html
├── script.js
└── styles.css
```

## Prerequisites

Before setting up the backend, install:

- Node.js 22
- npm
- PostgreSQL
- Git

## Installation

Clone the repository:

```bash
git clone https://github.com/MngDigitech/metatronics.git
```

Navigate to the backend directory:

```bash
cd metatronics/backend
```

Install dependencies:

```bash
npm ci
```

## Environment Configuration

The backend uses environment variables for database configuration.

Create a `.env` file inside the `backend` directory.

Add your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/methertech_db?schema=public"
```

Replace `YOUR_PASSWORD` with your local PostgreSQL password.

**Important:**
- Never commit `.env` files to Git.
- Never share database passwords or credentials.
- Use environment variables for production database credentials.

The Prisma configuration loads environment variables through `dotenv`.

## Running the Application

Start the backend in development mode:

```bash
npm run start:dev
```

The application runs at:

```text
http://localhost:3000
```

The current scaffold provides a basic GET endpoint:

```text
GET /
```

It currently returns:

```text
Hello World!
```

## Build and Production

Compile the application:

```bash
npm run build
```

Run the production build:

```bash
npm run start:prod
```

## Database and Prisma

Prisma 7 is configured to work with PostgreSQL.

The Prisma schema is located at:

```text
prisma/schema.prisma
```

The Prisma configuration is located at:

```text
prisma7.config.ts
```

Validate the Prisma schema:

```bash
npx prisma validate
```

Generate the Prisma Client when the schema is ready:

```bash
npx prisma generate
```

Database models and migrations will be developed in accordance with the approved project database schema.

Do not create or apply migrations against shared or production databases without the team's approval.

## Testing

The backend uses Vitest for automated testing.

Run unit tests:

```bash
npm test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Run tests with coverage:

```bash
npm run test:cov
```

Run lint checks:

```bash
npm run lint
```

Build the application:

```bash
npm run build
```

## Continuous Integration

The project uses GitHub Actions for automated backend verification.

Workflow file:

```text
.github/workflows/backend-ci.yml
```

The workflow runs when:

- Code is pushed to the `feature/backend-setup` branch.
- A pull request targets the `main` branch.

The CI pipeline performs the following checks:

1. Checks out the repository.
2. Sets up Node.js 22.
3. Installs dependencies using `npm ci`.
4. Builds the backend.
5. Runs lint checks.
6. Runs unit tests.
7. Runs end-to-end tests.

All checks must pass before the changes are considered ready for review.

## Development Status

The backend foundation has been established.

**Completed:**
- NestJS backend project setup.
- TypeScript configuration.
- Vitest unit and end-to-end testing setup.
- Linting and formatting configuration.
- PostgreSQL connection configuration.
- Prisma 7 installation and initial configuration.
- GitHub Actions CI workflow.

**In progress:**
- Finalisation of the project database schema.
- Prisma data models and relationships.
- Database migrations.
- Product catalogue REST API endpoints.
- Integration with the existing frontend.

Features listed as in progress are not yet available as completed backend functionality.

## Development Guidelines

- Follow the existing NestJS project structure.
- Keep database credentials out of source control.
- Use appropriate validation for incoming API requests.
- Write tests for new functionality.
- Run build, lint, unit and e2e checks before submitting changes.
- Follow the team's agreed database schema and development conventions.

## Useful Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
