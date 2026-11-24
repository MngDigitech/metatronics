BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_roles
        WHERE rolname = 'catalogue_api_readonly'
    ) THEN
        CREATE ROLE catalogue_api_readonly
            LOGIN
            NOINHERIT
            NOSUPERUSER
            NOCREATEDB
            NOCREATEROLE;
    ELSE
        ALTER ROLE catalogue_api_readonly
            LOGIN
            NOINHERIT
            NOSUPERUSER
            NOCREATEDB
            NOCREATEROLE;
    END IF;
END
$$;

GRANT CONNECT ON DATABASE product_catalogue
    TO catalogue_api_readonly;

GRANT USAGE ON SCHEMA public
    TO catalogue_api_readonly;

GRANT SELECT ON ALL TABLES IN SCHEMA public
    TO catalogue_api_readonly;

GRANT SELECT ON ALL SEQUENCES IN SCHEMA public
    TO catalogue_api_readonly;

ALTER DEFAULT PRIVILEGES
    FOR ROLE catalogue_admin
    IN SCHEMA public
    GRANT SELECT ON TABLES TO catalogue_api_readonly;

ALTER DEFAULT PRIVILEGES
    FOR ROLE catalogue_admin
    IN SCHEMA public
    GRANT SELECT ON SEQUENCES TO catalogue_api_readonly;

COMMIT;
