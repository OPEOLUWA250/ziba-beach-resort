#!/bin/bash

# Paystack secret key, read from the environment (this file is in a public repository).
PAYSTACK_SECRET="${PAYSTACK_SECRET_KEY:?Set PAYSTACK_SECRET_KEY first}"

# References from the screenshot (update these with actual references from your DB)
REFERENCES=(
  "ziba-1772401467318-wg7st"
  "ziba-1772401803654-ndq2ph"
  "ziba-1772401168029-vr7wt"
)

echo "🔍 Verifying Paystack Payments..."
echo "=================================="
echo ""

for ref in "${REFERENCES[@]}"; do
  echo "📌 Reference: $ref"
  
  response=$(curl -s -X GET "https://api.paystack.co/transaction/verify/$ref" \
    -H "Authorization: Bearer $PAYSTACK_SECRET")
  
  status=$(echo "$response" | grep -o '"status":true' | head -1)
  
  if [ -z "$status" ]; then
    echo "   ❌ Not found on Paystack or error"
  else
    payment_status=$(echo "$response" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    amount=$(echo "$response" | grep -o '"amount":[0-9]*' | cut -d':' -f2 | head -1)
    
    if [ -n "$amount" ]; then
      amount_naira=$((amount / 100))
      echo "   ✅ Status: $payment_status | Amount: ₦$amount_naira"
    else
      echo "   ⚠️  Could not parse response"
    fi
  fi
  echo ""
done

echo "=================================="
echo "Use the above information to manually update the database if needed."
