-- Agregar columna variants a la tabla products si no existe
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- Crear índice para mejor rendimiento (opcional)
-- CREATE INDEX IF NOT EXISTS idx_products_variants ON products USING GIN (variants);

-- Comentario para documentación
COMMENT ON COLUMN products.variants IS 'Array de variantes de producto con medidas, precios y unidades';
