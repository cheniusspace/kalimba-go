// Simple test script to verify environment variables
const fs = require('fs')
const path = require('path')

// Load .env.local file manually
const envPath = path.join(__dirname, '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      if (value && !value.includes('your-') && !value.includes('here')) {
        process.env[key.trim()] = value
      }
    }
  })
}

console.log('🔍 Checking environment variables...')
console.log('')

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

let allPresent = true

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`❌ ${varName}: Missing`)
    allPresent = false
  }
})

console.log('')
if (allPresent) {
  console.log('🎉 All environment variables are set!')
  console.log('🚀 You can now run: pnpm dev')
} else {
  console.log('⚠️  Please add the missing environment variables to .env.local')
  console.log('')
  console.log('📝 Example .env.local file:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here')
}