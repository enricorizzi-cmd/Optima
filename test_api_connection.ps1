# Test API Connection and Permissions
# This script tests the API endpoints to verify they work correctly

Write-Host "=== Testing API Connection ===" -ForegroundColor Green

# Configurazione Supabase
$supabaseUrl = "https://skmljuuxwnikfthgjrkg.supabase.co"
$supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbWxqdXV4d25pa2Z0aGdqcmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU1NzgsImV4cCI6MjA3NDkwMTU3OH0.DNhbvmtWCj3C8hnjhVxfh0E-zunfu2X4oLlI5kRlnrs"
$backendUrl = "https://optima-212r.onrender.com"

try {
    Write-Host "1. Testing Supabase connectivity..." -ForegroundColor Yellow
    
    # Test Supabase connection
    $headers = @{
        "apikey" = $supabaseAnonKey
        "Authorization" = "Bearer $supabaseAnonKey"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$supabaseUrl/auth/v1/user" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "✓ Supabase connection successful" -ForegroundColor Green
    
    Write-Host "2. Testing backend API..." -ForegroundColor Yellow
    
    # Test backend health endpoint
    $backendResponse = Invoke-RestMethod -Uri "$backendUrl/api/health" -Method GET -ErrorAction Stop
    Write-Host "✓ Backend API accessible: $backendResponse" -ForegroundColor Green
    
    Write-Host "3. Testing database schema..." -ForegroundColor Yellow
    
    # Test direct Supabase query (should work without auth)
    $queryHeaders = @{
        "apikey" = $supabaseAnonKey
        "Authorization" = "Bearer $supabaseAnonKey"
        "Content-Type" = "application/json"
        "Prefer" = "count=exact"
    }
    
    # Try to read a table that exists
    $tableResponse = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/organizations?select=*&limit=1" -Method GET -Headers $queryHeaders -ErrorAction Stop
    Write-Host "✓ Database schema accessible" -ForegroundColor Green
    Write-Host "  Organizations found: $($tableResponse.Count)" -ForegroundColor Cyan
    
    Write-Host "`n=== Summary ===" -ForegroundColor Green
    Write-Host "✓ Supabase connection working" -ForegroundColor Green
    Write-Host "✓ Backend API responsive" -ForegroundColor Green
    Write-Host "✓ Database schema accessible" -ForegroundColor Green
    Write-Host "✓ Ready for fixing user data" -ForegroundColor Green
    
} catch {
    Write-Host "✗ Error during testing: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Details: $($_.Exception)" -ForegroundColor Red
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Run the SQL migration: supabase/migrations/0005_fix_jwt_claims.sql" -ForegroundColor White
Write-Host "2. Run the user metadata fix: fix_user_metadata.sql" -ForegroundColor White  
Write-Host "3. Test creating entities in the app" -ForegroundColor White
