-- Script para crear la tabla de categorías y poblarla con datos iniciales

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Poblar con categorías existentes basadas en los productos actuales
INSERT INTO categories (name, label, description) VALUES
('adoquines-veredas', 'Adoquines y Veredas', 'Adoquines y baldosas para veredas con alta resistencia al tránsito vehicular y condiciones climáticas adversas.'),
('asadores', 'Asadores', 'Asadores y parrillas de camping para disfrutar de reuniones al aire libre con amigos y familia.'),
('bachas', 'Bachas', 'Bachas y lavamanos de alta calidad para baños y cocinas con diseños modernos y funcionales.'),
('cercos-tejidos', 'Cercos y Tejidos', 'Cercos eléctricos y tejidos para seguridad y delimitación de propiedades con materiales duraderos.'),
('decks-wpc', 'Decks WPC', 'Decks y revestimientos exteriores de Wood Plastic Composite, resistentes al clima y de bajo mantenimiento.'),
('ladrillos-refractarios', 'Ladrillos Refractarios', 'Ladrillos refractarios para hornos y chimeneas con alta resistencia al calor y temperaturas extremas.'),
('lajas-piedras', 'Lajas y Piedras', 'Lajas naturales y piedras decorativas para revestimientos, pisos y jardinería con acabados únicos.'),
('luminarias', 'Luminarias', 'Luminarias decorativas y funcionales para iluminación exterior e interior con diseños modernos.'),
('madera', 'Madera', 'Madera de calidad para construcción, postes, tablones y aplicaciones rurales con tratamientos especiales.'),
('mecano-ganadero', 'Mecano Ganadero', 'Paneles y estructuras metálicas para ganadería con galvanizado y alta durabilidad.'),
('pisos-spc', 'Pisos SPC', 'Pisos SPC (Stone Plastic Composite) de alta resistencia para interiores con acabados modernos.'),
('porcelanatos', 'Porcelanatos', 'Porcelanatos de alta calidad para pisos y paredes con diseños contemporáneos y duraderos.'),
('premoldeados', 'Premoldeados', 'Elementos premoldeados de hormigón para construcción civil con estándares de calidad.'),
('revestimientos-piscina', 'Revestimientos para Piscina', 'Revestimientos especiales para piscinas con materiales resistentes al cloro y al agua.'),
('travertinos-marmoles', 'Travertinos y Mármoles', 'Travertinos y mármoles naturales para revestimientos de lujo con acabados únicos.')
ON CONFLICT (name) DO NOTHING;

-- Actualizar timestamp de actualización
UPDATE categories SET updated_at = CURRENT_TIMESTAMP;

-- Comentario para verificar que se ejecutó correctamente
SELECT 'Tabla categories creada y poblada exitosamente' AS status;
