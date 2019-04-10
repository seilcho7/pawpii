create table users (
    id serial primary key,
    first_name varchar(100),
    last_name varchar(100),
    email varchar(500),
    password varchar(500)
);

create table dogs (
    id serial primary key,
    name varchar(200),
    breed varchar(500),
    age varchar(100),
    description varchar(8000),
    org_id integer references organizations(id)
);

create table favorites (
    id serial primary key,
    user_id integer references users(id),
    org_id integer references organizations(id)
);

create table organizations (
    id serial primary key,
    name varchar(200),
    website varchar(8000),
    address varchar(500),
    city varchar(100),
    state varchar(100),
    email varchar(500),
    password varchar(500)
);