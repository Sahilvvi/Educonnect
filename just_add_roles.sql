-- SUPER SIMPLE - Just add roles to existing users
-- Run this ONLY

-- Insert roles for your existing users
INSERT INTO user_roles (user_id, role, school_id, status) VALUES
('250ac25d-12f5-4339-ad71-5af1bc344127', 'super_admin', NULL, 'active'),
('c42da86e-9e3c-408a-8b4c-1a175890c1c1', 'admin', NULL, 'active'),
('5ffd6eba-9d94-4984-b6c8-bfdb8713469a', 'teacher', NULL, 'active'),
('e5788499-19e3-4366-96fc-324ac5d4199b', 'parent', NULL, 'active'),
('47628858-b733-4555-aac7-a6a91b5fb964', 'student', NULL, 'active')
ON CONFLICT (user_id, role, school_id) DO NOTHING;

-- Done
SELECT 'Roles assigned!' as message;
