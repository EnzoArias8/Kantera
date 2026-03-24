const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addOrigenColumn() {
  try {
    console.log('Adding "origen" column to products table...')
    
    // Execute SQL to add the column
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS origen TEXT;'
    })
    
    if (error) {
      console.error('Error adding column:', error)
      
      // Try alternative approach using raw SQL
      console.log('Trying alternative approach...')
      const { error: altError } = await supabase
        .from('products')
        .select('origen')
        .limit(1)
      
      if (altError && altError.message.includes('column "origen" does not exist')) {
        console.log('Column does not exist. You need to add it manually in Supabase Dashboard.')
        console.log('Go to: https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0])
        console.log('Navigate to: Table Editor > products > Add column > origen > text')
      } else {
        console.log('Column might already exist or was added successfully.')
      }
    } else {
      console.log('✅ Column "origen" added successfully!')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

addOrigenColumn()
