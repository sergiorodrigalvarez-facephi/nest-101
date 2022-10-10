create table transactions (
    transactionid uuid primary key default gen_random_uuid(), 
    time timestamp not null, 
    customid varchar unique not null,
    flowid varchar not null,
    data jsonb not null,
    status varchar default 'CREATED',
    step varchar
);

create table events (
    eventid uuid primary key default gen_random_uuid(),
    transactionid uuid references transactions,
    time timestamp not null,
    type varchar not null,
    data jsonb not null,
    processed boolean default false,
    unique (transactionid, type, data)
);