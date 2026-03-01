-- Supabase SQL Query to Update Payment Status
-- Run this in the SQL Editor in Supabase Dashboard if payments were successful

-- OPTION 1: Update all PENDING payments to COMPLETED
-- (Use this if you confirmed all visible pending payments succeeded on Paystack)
UPDATE public.bookings 
SET payment_status = 'COMPLETED', 
    paid_at = NOW()
WHERE payment_status = 'PENDING' 
AND paystack_reference IS NOT NULL;

-- OPTION 2: Update specific bookings only
-- (Uncomment and run one at a time after verifying on Paystack)
-- UPDATE public.bookings 
-- SET payment_status = 'COMPLETED', paid_at = NOW()
-- WHERE id = 'BOOKING_ID_HERE' AND payment_status = 'PENDING';

-- View the results
SELECT id, paystack_reference, payment_status, total_amount_ngn, created_at 
FROM public.bookings 
WHERE payment_status IN ('PENDING', 'COMPLETED')
ORDER BY created_at DESC
LIMIT 10;
