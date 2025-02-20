CREATE TABLE IF NOT EXISTS public.users (
	id serial primary key,
	username varchar(64) not null unique,
	email varchar(128) not null unique,
	password varchar(256) not null,
	admin boolean default false,
	created timestamp with time zone not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS public.practice (
	id serial primary key,
	date timestamp with time zone not null unique,
	duration interval not null,
	ages text check (ages in ('5-7 ára', '8-12 ára', 'fullorðnir')) not null,
	capacity int not null,
	created timestamp with time zone not null default current_timestamp
);

CREATE TABLE IF NOT EXISTS public.practice_signups (
	id serial primary key,
	user_id int references users(id) not null on delete cascade,
	practice_id int references practice(id) not null on delete cascade,
	signup_date timestamp with time zone not null default current_timestamp,
	unique (user_id, practice_id)
);

CREATE TABLE IF NOT EXISTS public.courses (
	id serial primary key,
	name text not null,
	description text,
	level text check (level in ('byrjendur', 'miðstig', 'hæsta stig')) not null,
	start_date date not null,
	end_date date not null
);

CREATE TABLE IF NOT EXISTS public.course_signups (
	id serial primary key,
	user_id int references users(id) on delete cascade,
	course_id int references courses(id) on delete cascade,
	signup_date timestamp with time zone not null default current_timestamp,
	unique (user_id, course_id)
);
