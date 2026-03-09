-- =====================================================
-- Migration: Add phoneNumber to users table
-- Description: Add phone number field for authentication
-- =====================================================

-- Add phoneNumber column to users table
ALTER TABLE public.users
ADD COLUMN phone_number TEXT UNIQUE;

-- Create index for phone number lookups
CREATE INDEX idx_users_phone_number ON public.users(phone_number);

-- Add comment
COMMENT ON COLUMN public.users.phone_number IS 'User phone number for authentication';
