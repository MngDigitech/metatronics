
-- Product Catalogue Migration
-- Catalogue read view for the API

BEGIN;

CREATE OR REPLACE VIEW v_catalogue AS

SELECT
    p.id AS product_id,
    b.id AS brand_id,
    b.brand_name,

    dt.id AS device_type_id,
    dt.code AS device_type_code,
    dt.name AS device_type_name,

    p.model,
    p.description,
    p.specs,
    p.is_active AS product_is_active,

    pv.id AS variant_id,
    pv.sku,
    pv.storage,
    pv.colour,
    pv.price,
    pv.currency,
    pv.stock,
    pv.is_active AS variant_is_active,

    primary_image.image_url,
    primary_image.alt_text AS image_alt_text

FROM products p

INNER JOIN brands b
    ON b.id = p.brand_id

INNER JOIN device_types dt
    ON dt.id = p.device_type_id

LEFT JOIN product_variants pv
    ON pv.product_id = p.id

LEFT JOIN LATERAL (
    SELECT
        pi.image_url,
        pi.alt_text,
        pi.variant_id

    FROM product_images pi

    WHERE pi.product_id = p.id
      AND pi.is_primary = TRUE
      AND (
          pi.variant_id = pv.id
          OR pi.variant_id IS NULL
      )

    ORDER BY
        CASE
            WHEN pv.id IS NOT NULL
             AND pi.variant_id = pv.id
            THEN 0
            ELSE 1
        END,
        pi.id

    LIMIT 1

) primary_image ON TRUE;

COMMIT;
