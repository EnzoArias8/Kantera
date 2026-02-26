-- Agregar columna measure a la tabla products si no existe
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS measure TEXT;
