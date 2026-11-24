
-- Product Catalogue Migration
-- Starting device types and JSONB specification rules

BEGIN;

INSERT INTO device_types (code, name, specs_schema)
VALUES

(
    'phone',
    'Phone',
    '{
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
            "screen_size_inches": {
                "type": "number",
                "exclusiveMinimum": 0
            },
            "ram_gb": {
                "type": "number",
                "exclusiveMinimum": 0
            },
            "storage_gb": {
                "type": "number",
                "exclusiveMinimum": 0
            },
            "rear_camera_mp": {
                "type": "number",
                "minimum": 0
            },
            "front_camera_mp": {
                "type": "number",
                "minimum": 0
            },
            "battery_mah": {
                "type": "integer",
                "minimum": 0
            },
            "operating_system": {
                "type": "string",
                "minLength": 1
            },
            "connectivity": {
                "type": "array",
                "items": {
                    "type": "string"
                },
                "uniqueItems": true
            }
        },
        "required": [
            "screen_size_inches",
            "ram_gb",
            "storage_gb",
            "operating_system"
        ],
        "additionalProperties": false
    }'::jsonb
),

(
    'tablet',
    'Tablet',
    '{
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
            "screen_size_inches": {
                "type": "number",
                "exclusiveMinimum": 0
            },
            "ram_gb": {
                "type": "number",
                "exclusiveMinimum": 0
            },
            "storage_gb": {
                "type": "number",
                "exclusiveMinimum": 0
            },
            "battery_mah": {
                "type": "integer",
                "minimum": 0
            },
            "operating_system": {
                "type": "string",
                "minLength": 1
            },
            "connectivity": {
                "type": "array",
                "items": {
                    "type": "string"
                },
                "uniqueItems": true
            }
        },
        "required": [
            "screen_size_inches",
            "storage_gb",
            "operating_system"
        ],
        "additionalProperties": false
    }'::jsonb
),

(
    'watch',
    'Watch',
    '{
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
            "display_size_inches": {
                "type": "number",
                "exclusiveMinimum": 0
            },
            "battery_life_days": {
                "type": "number",
                "exclusiveMinimum": 0
            },
            "battery_mah": {
                "type": "integer",
                "minimum": 0
            },
            "operating_system": {
                "type": "string",
                "minLength": 1
            },
            "connectivity": {
                "type": "array",
                "items": {
                    "type": "string"
                },
                "uniqueItems": true
            },
            "water_resistance": {
                "type": "string"
            },
            "heart_rate_monitor": {
                "type": "boolean"
            }
        },
        "required": [
            "display_size_inches",
            "operating_system"
        ],
        "additionalProperties": false
    }'::jsonb
),

(
    'other',
    'Other',
    '{
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
            "model_number": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "dimensions": {
                "type": "string"
            },
            "weight_g": {
                "type": "number",
                "exclusiveMinimum": 0
            },
            "warranty_months": {
                "type": "integer",
                "minimum": 0
            }
        },
        "additionalProperties": true
    }'::jsonb
)

ON CONFLICT (code)
DO UPDATE SET
    name = EXCLUDED.name,
    specs_schema = EXCLUDED.specs_schema;

COMMIT;
