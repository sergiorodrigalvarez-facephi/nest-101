create table transactions (
    transactionid uuid primary key default gen_random_uuid (), 
    time timestamp, 
    customid varchar unique,
    status varchar default 'CREATED',
    step varchar
);

create table events (
    eventid uuid primary key default gen_random_uuid(),
    transactionid uuid references transactions,
    time timestamp,
    type varchar,
    data jsonb,
    processed boolean default false,
    unique (transactionid, type, data)
);