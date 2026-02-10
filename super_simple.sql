-- SIMPLEST VERSION - No extra columns
-- Just user_id, role, school_id

INSERT INTO user_roles (user_id, role, school_id) VALUES
('250ac25d-12f5-4339-ad71-5af1bc344127', 'super_admin', NULL),
('c42da86e-9e3c-408a-8b4c-1a175890c1c1', 'admin', NULL),
('5ffd6eba-9d94-4984-b6c8-bfdb8713469a', 'teacher', NULL),
('e5788499-19e3-4366-96fc-324ac5d4199b', 'parent', NULL),
('47628858-b733-4555-aac7-a6a91b5fb964', 'student', NULL)
ON CONFLICT DO NOTHING;

SELECT 'Done!' as message;
