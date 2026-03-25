// Script para probar la conexión entre productos y categorías
// Ejecutar con: node test-categories.js

async function testCategories() {
  try {
    console.log('🔍 Probando categorías...');
    
    // 1. Obtener categorías
    const categoriesResponse = await fetch('http://localhost:3000/api/products');
    const categoriesData = await categoriesResponse.json();
    
    console.log('✅ Categorías disponibles:');
    console.log(`   - Total productos: ${categoriesData.count}`);
    
    if (categoriesData.products && categoriesData.products.length > 0) {
      const uniqueCategories = [...new Set(categoriesData.products.map(p => p.category))];
      console.log('   - Categorías con productos:');
      uniqueCategories.forEach(cat => {
        console.log(`     * ${cat}`);
      });
    }
    
    // 2. Probar filtro por categoría
    console.log('\n🔍 Probando filtro por categoría...');
    const testCategory = 'Travertinos';
    const filteredResponse = await fetch(`http://localhost:3000/api/products?category=${testCategory}`);
    const filteredData = await filteredResponse.json();
    
    console.log(`   - Categoría: ${testCategory}`);
    console.log(`   - Productos encontrados: ${filteredData.count}`);
    
    if (filteredData.products && filteredData.products.length > 0) {
      console.log('   - Productos en esta categoría:');
      filteredData.products.forEach((product, index) => {
        console.log(`     ${index + 1}. ${product.name} (category: ${product.category})`);
      });
    } else {
      console.log('   ❌ No se encontraron productos para esta categoría');
      console.log('   💡 Posibles soluciones:');
      console.log('      1. Verifica que los productos tengan el campo "category" con el nombre exacto');
      console.log('      2. Asegúrate que el nombre coincida con el campo "name" de la categoría');
      console.log('      3. Revisa si hay espacios o mayúsculas/minúsculas diferentes');
    }
    
  } catch (error) {
    console.error('❌ Error al probar categorías:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   1. El servidor Next.js esté corriendo (npm run dev)');
    console.log('   2. Las categorías estén configuradas correctamente');
    console.log('   3. Los productos tengan el campo category asignado');
  }
}

testCategories();
