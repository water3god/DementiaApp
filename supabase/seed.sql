-- Optional: fills one patient with sample data.
-- First sign up as a caretaker and create a patient in the app, then replace
-- YOUR_PATIENT_USERNAME below and run this in the SQL Editor.

with p as (select id from public.profiles where role = 'patient' and username = 'YOUR_PATIENT_USERNAME')
insert into public.contacts (patient_id, name, full_name, relationship, contact_group, about, schedule, phone)
select p.id, c.* from p, (values
  ('Maggie', 'Margaret Lee', 'Your daughter', 'family',
   'She lives nearby with her husband Tom. She grows the tomatoes you like and brings some when she visits.',
   'Visits every Sunday afternoon', '+1 555 010 1234'),
  ('David', 'David Lee', 'Your son', 'family',
   'He lives in Seattle with his wife Anna and your grandchildren, Sam and Lily.',
   'Calls every Wednesday evening', '+1 555 010 5678'),
  ('James', 'James Walker', 'Your neighbor', 'friends',
   'He lives next door. His dog, Biscuit, likes to say hello.',
   'Walks past most mornings', '+1 555 010 2468'),
  ('Emily', 'Emily Carter', 'Your caregiver', 'care',
   'She helps you with your medicine and makes breakfast with you.',
   'Here weekday mornings, 8am to noon', '+1 555 010 1357')
) as c;

with p as (select id from public.profiles where role = 'patient' and username = 'YOUR_PATIENT_USERNAME')
insert into public.tasks (patient_id, text)
select p.id, t.text from p, (values
  ('Take your morning pills'),
  ('Drink a glass of water'),
  ('Call Maggie after lunch'),
  ('Water the plants on the windowsill'),
  ('Go for a short walk')
) as t(text);

with p as (select id from public.profiles where role = 'patient' and username = 'YOUR_PATIENT_USERNAME')
insert into public.places (patient_id, name, description, lat, lng)
select p.id, pl.* from p, (values
  ('Home', 'Where you live', 40.7128, -74.006),
  ('Maggie''s house', 'Your daughter lives here', 40.73, -73.99),
  ('Central Park', 'Where you like to walk', 40.7829, -73.9654)
) as pl;
