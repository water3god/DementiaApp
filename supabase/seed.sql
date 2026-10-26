-- Optional: fills one account with the old sample data.
-- Sign up in the app first, replace YOUR_EMAIL below, then run in the SQL Editor.

with u as (select id from auth.users where email = 'YOUR_EMAIL')
insert into public.contacts (user_id, name, full_name, relationship, contact_group, about, schedule, phone, image_url)
select u.id, c.* from u, (values
  ('Maggie', 'Margaret Lee', 'Your daughter', 'family',
   'She lives nearby with her husband Tom. She grows the tomatoes you like and brings some when she visits.',
   'Visits every Sunday afternoon', '+1 555 010 1234', '/contacts/margaret.svg'),
  ('David', 'David Lee', 'Your son', 'family',
   'He lives in Seattle with his wife Anna and your grandchildren, Sam and Lily.',
   'Calls every Wednesday evening', '+1 555 010 5678', '/contacts/david.svg'),
  ('James', 'James Walker', 'Your neighbor', 'friends',
   'He lives next door. His dog, Biscuit, likes to say hello.',
   'Walks past most mornings', '+1 555 010 2468', '/contacts/james.svg'),
  ('Emily', 'Emily Carter', 'Your caregiver', 'care',
   'She helps you with your medicine and makes breakfast with you.',
   'Here weekday mornings, 8am to noon', '+1 555 010 1357', '/contacts/emily.svg')
) as c;

with u as (select id from auth.users where email = 'YOUR_EMAIL')
insert into public.tasks (user_id, text)
select u.id, t.text from u, (values
  ('Take your morning pills'),
  ('Drink a glass of water'),
  ('Call Maggie after lunch'),
  ('Water the plants on the windowsill'),
  ('Go for a short walk')
) as t(text);

with u as (select id from auth.users where email = 'YOUR_EMAIL')
insert into public.places (user_id, name, description, lat, lng)
select u.id, p.* from u, (values
  ('Home', 'Where you live', 40.7128, -74.006),
  ('Maggie''s house', 'Your daughter lives here', 40.73, -73.99),
  ('Central Park', 'Where you like to walk', 40.7829, -73.9654)
) as p;
