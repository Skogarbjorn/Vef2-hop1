CREATE TABLE IF NOT EXISTS public.users (
	id serial primary key,
	username varchar(64) not null unique,
	email varchar(128) not null unique,
	password varchar(256) not null,
	admin boolean default false,
	created timestamp with time zone not null default current_timestamp
);
