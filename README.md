# Product Catalogue Database

PostgreSQL database infrastructure for the Product Catalogue Migration project.

## Requirements

- Docker Desktop
- Docker Compose

## Project Structure

```text
product-catalogue-migration/
├── database/
│   ├── 001_schema.sql
│   ├── 002_device_types.sql
│   └── 003_catalogue_view.sql
├── source/
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Local Database Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd product-catalogue-migration
```

### 2. Configure environment variables

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure your own database password.

### 3. Start PostgreSQL

Run:

```bash
docker compose up -d
```

Docker automatically initializes the database and executes the SQL scripts in order:

1. `001_schema.sql` creates the database tables, constraints, indexes and timestamp triggers.
2. `002_device_types.sql` inserts the starting device types and JSONB specification rules.
3. `003_catalogue_view.sql` creates the `v_catalogue` view.
4. `004_readonly_user.sql` creates the read-only API database user and grants SELECT permissions.

### 4. Check database status

```bash
docker compose ps
```

The PostgreSQL service should report a healthy status.

### 5. Connect to PostgreSQL

```bash
docker compose exec postgres psql -U catalogue_admin -d product_catalogue
```

To exit PostgreSQL:

```sql
\q
```

## Database Structure

The database contains five tables:

- `brands`
- `device_types`
- `products`
- `product_variants`
- `product_images`

The `v_catalogue` view provides a combined catalogue read view for the API.

## Important Notes

- PostgreSQL 16 is used through Docker.
- Environment variables and passwords must not be committed to Git.
- The `.env.example` file is a template. Each developer must configure their own `.env`.
- SQL initialization scripts run automatically only when PostgreSQL initializes an empty data directory.
- Existing Docker volumes are preserved when the container is stopped or restarted.
- Avoid `docker compose down -v` unless you intentionally want to delete the local database volume.

## Stopping the Database

```bash
docker compose down
```

This stops the container while preserving the database volume.

## Starting the Database Again

```bash
docker compose up -d
```
