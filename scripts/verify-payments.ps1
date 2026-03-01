$PAYSTACK_SECRET = "sk_test_09a0b8dd608b54f21ebe3f06620bb2819b508c6a"

Write-Host "🔍 Verifying Paystack Payments..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# These are the references from the Supabase table shown in your screenshot
$references = @(
    "ziba-1772401467318-wg7st",
    "ziba-1772401803654-ndq2ph", 
    "ziba-1772401168029-vr7wt"
)

$results = @()

foreach ($ref in $references) {
    Write-Host "📌 Reference: $ref"
    
    try {
        $response = Invoke-RestMethod `
            -Uri "https://api.paystack.co/transaction/verify/$ref" `
            -Method GET `
            -Headers @{"Authorization" = "Bearer $PAYSTACK_SECRET"} `
            -ContentType "application/json"
        
        if ($response.status -eq $true) {
            $transaction = $response.data
            $amountNGN = $transaction.amount / 100
            
            Write-Host "   ✅ Status: $($transaction.status)" -ForegroundColor Green
            Write-Host "   💰 Amount: ₦$amountNGN" -ForegroundColor Green
            Write-Host "   📧 Email: $($transaction.customer.email)" -ForegroundColor Green
            
            $results += @{
                Reference = $ref
                Status = $transaction.status
                Amount = $amountNGN
                Email = $transaction.customer.email
            }
        } else {
            Write-Host "   ⚠️  Invalid response from Paystack" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan

if ($results.Count -gt 0) {
    foreach ($result in $results) {
        if ($result.Status -eq "success") {
            Write-Host "✅ $($result.Reference) - SUCCESS - ₦$($result.Amount)" -ForegroundColor Green
            Write-Host "   → Update database: payment_status = 'COMPLETED'" -ForegroundColor Gray
        } else {
            Write-Host "⚠️  $($result.Reference) - $($result.Status.ToUpper())" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ No successful payments found" -ForegroundColor Red
}
