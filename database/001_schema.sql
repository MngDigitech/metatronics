
-- Product Catalogue Migration
-- PostgreSQL database schema

BEGIN;

-- 1. BRANDS
CREATE TABLE brands (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT brands_name_not_blank
        CHECK (BTRIM(brand_name) <> '')
);

CREATE UNIQUE INDEX uq_brands_name_lower
    ON brands (LOWER(brand_name));


-- 2. DEVICE TYPES
CREATE TABLE device_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    specs_schema JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT device_types_code_not_blank
        CHECK (BTRIM(code) <> ''),

    CONSTRAINT device_types_schema_object
        CHECK (JSONB_TYPEOF(specs_schema) = 'object')
);


-- 3. PRODUCTS
CREATE TABLE products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    brand_id BIGINT NOT NULL,
    device_type_id BIGINT NOT NULL,
    model VARCHAR(200) NOT NULL,
    description TEXT,
    specs JSONB NOT NULL DEFAULT '{}'::JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT products_brand_fk
        FOREIGN KEY (brand_id)
        REFERENCES brands(id)
        ON DELETE RESTRICT,

    CONSTRAINT products_device_type_fk
        FOREIGN KEY (device_type_id)
        REFERENCES device_types(id)
        ON DELETE RESTRICT,

    CONSTRAINT products_model_not_blank
        CHECK (BTRIM(model) <> ''),

    CONSTRAINT products_specs_object
        CHECK (JSONB_TYPEOF(specs) = 'object')
);

CREATE UNIQUE INDEX uq_products_brand_type_model
    ON products (brand_id, device_type_id, LOWER(model));


-- 4. PRODUCT VARIANTS
CREATE TABLE product_variants (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL,
    sku VARCHAR(150) NOT NULL,
    storage VARCHAR(50),
    colour VARCHAR(50),
    price NUMERIC(12, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'ZAR',
    stock INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT variants_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT variants_sku_unique
        UNIQUE (sku),

    CONSTRAINT variants_product_id_unique
        UNIQUE (product_id, id),

    CONSTRAINT variants_sku_not_blank
        CHECK (BTRIM(sku) <> ''),

    CONSTRAINT variants_price_non_negative
        CHECK (price >= 0),

    CONSTRAINT variants_stock_non_negative
        CHECK (stock >= 0),

    CONSTRAINT variants_currency_valid
        CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE UNIQUE INDEX uq_variants_product_storage_colour
    ON product_variants (product_id, storage, colour)
    NULLS NOT DISTINCT;


-- 5. PRODUCT IMAGES
CREATE TABLE product_images (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL,
    variant_id BIGINT,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT images_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT images_variant_product_fk
        FOREIGN KEY (product_id, variant_id)
        REFERENCES product_variants(product_id, id)
        ON DELETE RESTRICT,

    CONSTRAINT images_url_not_blank
        CHECK (BTRIM(image_url) <> ''),

    CONSTRAINT images_sort_order_non_negative
        CHECK (sort_order >= 0)
);


-- Indexes
CREATE INDEX idx_products_brand
    ON products (brand_id);

CREATE INDEX idx_products_device_type
    ON products (device_type_id);

CREATE INDEX idx_variants_product
    ON product_variants (product_id);

CREATE INDEX idx_variants_price
    ON product_variants (price);

CREATE INDEX idx_images_product
    ON product_images (product_id);

CREATE INDEX idx_images_variant
    ON product_images (variant_id);

CREATE INDEX idx_products_specs
    ON products USING GIN (specs);


-- Only one primary image per product (without a variant)
CREATE UNIQUE INDEX uq_images_primary_product
    ON product_images (product_id)
    WHERE is_primary = TRUE AND variant_id IS NULL;

-- Only one primary image per variant
CREATE UNIQUE INDEX uq_images_primary_variant
    ON product_images (variant_id)
    WHERE is_primary = TRUE AND variant_id IS NOT NULL;


-- Automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

COMMIT;
