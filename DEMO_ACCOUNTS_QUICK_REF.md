# 🎯 Demo Accounts Quick Reference

## Login Credentials

| Role | Email | Password | Dashboard URL |
|------|-------|----------|---------------|
| **Super Admin** | superadmin@demo.school | Demo@123 | /super-admin/dashboard |
| **Admin** | admin@demo.school | Demo@123 | /admin/dashboard |
| **Teacher** | teacher@demo.school | Demo@123 | /teacher/dashboard |
| **Parent** | parent@demo.school | Demo@123 | /parent/dashboard |
| **Student** | student@demo.school | Demo@123 | /student/dashboard |

## Setup Steps

1. **Create Users** → Supabase Dashboard → Authentication → Add User
2. **Copy User IDs** → Save each UUID
3. **Update SQL** → Replace placeholders in `create_demo_accounts.sql`
4. **Run Script** → Supabase SQL Editor → Paste & Run
5. **Test Login** → http://localhost:3000/login

## Demo Data Summary

- **School**: Demo High School
- **Classes**: 3 (Grade 9-B, 10-A, 11-A)
- **Teachers**: 1 (John Smith - Mathematics)
- **Students**: 2 (Emily Johnson, Michael Wilson)
- **Parents**: 1 (Robert Wilson - Michael's father)
- **Homework**: 2 assignments
- **Attendance**: 10 days of records
- **Fees**: ₹5,000 pending for Michael
- **Timetable**: Mon-Fri schedule for Grade 10-A
- **Announcements**: 2 active announcements

## Quick Test Checklist

### ✅ Super Admin
- [ ] See Demo High School in schools list
- [ ] Analytics page works
- [ ] Can view all 5 users

### ✅ Admin
- [ ] Stats: 2 students, 1 teacher, 3 classes
- [ ] Can manage timetable
- [ ] Can create subjects

### ✅ Teacher
- [ ] See 2 assigned classes
- [ ] View 2 homework assignments
- [ ] Mark attendance works

### ✅ Parent
- [ ] See 1 child card (Michael)
- [ ] Shows class, attendance %, homework, fees
- [ ] Fee: ₹5,000 pending

### ✅ Student
- [ ] See profile (Emily Johnson, Grade 10-A)
- [ ] Next Class shows timetable
- [ ] 1 homework assignment
- [ ] 10 attendance records
- [ ] Weekly timetable loads

## Files Reference

- **SQL Script**: `create_demo_accounts.sql`
- **Full Guide**: `DEMO_ACCOUNTS_GUIDE.md`
- **Testing**: `TESTING_CHECKLIST.md`

---

**Default Password for All**: `Demo@123`  
**Login URL**: http://localhost:3000/login
