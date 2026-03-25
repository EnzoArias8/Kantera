// Script para ejecutar el reset de categorías
// Ejecutar con: node run-reset.js

const fetch = require('node-fetch');

async function resetCategories() {
  try {
    console.log('🔄 Iniciando reset de categorías...');
    
    const response = await fetch('http://localhost:3000/api/setup-categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Reset completado exitosamente:');
    console.log(`   - Categorías insertadas: ${data.categoriesInserted}`);
    console.log('   - Categorías creadas:');
    data.categories?.forEach((cat, index) => {
      console.log(`     ${index + 1}. ${cat.name} (${cat.url})`);
    });
    
  } catch (error) {
    console.error('❌ Error al ejecutar reset:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   1. El servidor Next.js esté corriendo (npm run dev)');
    console.log('   2. La variable SUPABASE_SERVICE_ROLE_KEY esté configurada');
    console.log('   3. No haya restricciones de foreign key bloqueando');
  }
}

resetCategories();
