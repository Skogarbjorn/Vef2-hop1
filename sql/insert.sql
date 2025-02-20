insert into public.users (
	username, 
	email,
	password, 
	admin
	) values (
	'admin',
	'admin@example.org',
	'$2b$04$I97OXgLAPR9FG6UCEdUnZ.TqHtf79yZrdAmJDsxpahN3YzBBCmtj6',
	true
);

insert into public.practice (
  date,
	duration,
	ages,
	capacity
) values (
  NOW() + INTERVAL '1 day',
	INTERVAL '1 hour 30 minutes',
	'5-7 ára',
	20
);
