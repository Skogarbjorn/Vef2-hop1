insert into public.users 
	(username, email, password, admin) 
values 
	('admin', 'admin@example.org', '$2b$04$I97OXgLAPR9FG6UCEdUnZ.TqHtf79yZrdAmJDsxpahN3YzBBCmtj6', true),
	('user', 'user@example.org', 'some_password', false);

insert into public.practice 
	(date, duration, ages, capacity) 
values
	(NOW() + INTERVAL '1 day', INTERVAL '1 hour 30 minutes', '5-7 ára', 20),
	(NOW() + INTERVAL '2 day', INTERVAL '30 minutes', '5-7 ára', 25),
	(NOW() + INTERVAL '5 days 2 hours', INTERVAL '50 seconds', '8-12 ára', 52),
	(NOW() + INTERVAL '1 day', INTERVAL '1 hour 30 minutes', 'fullorðnir', 5),
	(NOW(), INTERVAL '15 days', 'fullorðnir', 120);

insert into public.practice_signups
  (user_id, practice_id)
values
  (2, 1),
	(1, 5);

insert into public.courses
	(name, description, level, start_date, end_date)
values
  ('beginner course', 'course for beginners', 'byrjendur', NOW(), NOW() + INTERVAL '1 day'),
  ('course something', 'desc', 'byrjendur', NOW(), NOW() + INTERVAL '2 day'),
  ('gamer', 'gamer', 'byrjendur', '2023-02-02T12:00:00Z', '2023-03-02T15:00:00Z'),
  ('epic', 'epic', 'miðstig', NOW() + INTERVAL '15 days', NOW() + INTERVAL '20 days'),
  ('super', 'super', 'hæsta stig', NOW() + INTERVAL '51 days', NOW() + INTERVAL '82 days'),
  ('something', 'something desc', 'byrjendur', NOW(), NOW() + INTERVAL '1 day'),
  ('advanced training', 'A course for advanced users', 'hæsta stig', NOW(), NOW() + INTERVAL '10 days'),
  ('intermediate skills', 'For those with some experience', 'miðstig', NOW() + INTERVAL '5 days', NOW() + INTERVAL '12 days'),
  ('beginner friendly', 'Perfect for absolute beginners', 'byrjendur', NOW() + INTERVAL '3 days', NOW() + INTERVAL '8 days'),
  ('pro gamer', 'Master-level course', 'hæsta stig', '2023-06-15T09:30:00Z', '2023-07-15T17:45:00Z'),
  ('speedrun training', 'Fast-paced learning', 'miðstig', NOW() + INTERVAL '7 days', NOW() + INTERVAL '14 days'),
  ('ultimate challenge', 'For those who want to push their limits', 'hæsta stig', NOW() + INTERVAL '30 days', NOW() + INTERVAL '45 days'),
  ('fundamentals', 'Basic knowledge for everyone', 'byrjendur', NOW(), NOW() + INTERVAL '4 days'),
  ('deep dive', 'Explore advanced concepts', 'miðstig', NOW() + INTERVAL '20 days', NOW() + INTERVAL '25 days'),
  ('masterclass', 'Expert-level course', 'hæsta stig', NOW() + INTERVAL '60 days', NOW() + INTERVAL '90 days'),
  ('crash course', 'Quick and efficient learning', 'byrjendur', NOW(), NOW() + INTERVAL '2 days'),
  ('night class', 'Evening sessions available', 'miðstig', NOW() + INTERVAL '15 days', NOW() + INTERVAL '22 days'),
  ('workshop', 'Hands-on learning', 'hæsta stig', NOW() + INTERVAL '12 days', NOW() + INTERVAL '20 days'),
  ('game theory', 'Learn the mechanics behind games', 'byrjendur', '2024-01-10T14:00:00Z', '2024-01-20T16:00:00Z'),
  ('skill boost', 'Improve your technique', 'miðstig', NOW() + INTERVAL '8 days', NOW() + INTERVAL '18 days'),
  ('endgame', 'Final step before mastery', 'hæsta stig', NOW() + INTERVAL '40 days', NOW() + INTERVAL '60 days');

insert into public.course_signups
  (user_id, course_id)
values
  (2, 1),
  (2, 3),
  (2, 4),
  (2, 6),
  (2, 7),
  (1, 9),
  (2, 15),
  (1, 16),
  (2, 17),
  (1, 20),
  (1, 21);

insert into public.moves
  (title, description, image)
values
  ('move1', 'cool move', 'https://res.cloudinary.com/dgvboari8/image/upload/dkhdsweafsqi5ue1e2ua.jpg'),
  ('move2', 'epic move', 'https://res.cloudinary.com/dgvboari8/image/upload/bfcw4oel6dc0dypdcqck.jpg'),
  ('move3', 'desc yayy', 'https://res.cloudinary.com/dgvboari8/image/upload/rzzvt4xjangqd3uf0sxr.jpg'),
  ('move4', 'move 4 epic', 'https://res.cloudinary.com/dgvboari8/image/upload/sf795rwch25jqo4ogqgy.png'),
  ('move5', 'i have desc', 'https://res.cloudinary.com/dgvboari8/image/upload/fd8vhvbeel5qjtogghru.jpg'),
  ('move6', 'its cool trust me', 'https://res.cloudinary.com/dgvboari8/image/upload/njep2qcgde2b8o5zxowp.jpg'),
  ('move7', 'this ones sigma', 'https://res.cloudinary.com/dgvboari8/image/upload/jmden891guwvcplbyaqp.jpg'),
  ('move8', 'uhh idk', 'https://res.cloudinary.com/dgvboari8/image/upload/s6mldz6zgbigamup5amm.jpg'),
  ('move9', 'last one!!!', 'https://res.cloudinary.com/dgvboari8/image/upload/gnwz55dhramqaibybjhk.jpg');
