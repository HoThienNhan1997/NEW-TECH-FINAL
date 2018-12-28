CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

drop table if EXISTS users CASCADE;


CREATE TABLE users (
  id				text PRIMARY KEY,
  name			text,
  email			text,
	phone			text 								
);

drop table if EXISTS accounts CASCADE;


CREATE TABLE accounts (
  id 				uuid DEFAULT uuid_generate_v1() PRIMARY KEY,
  number		text,
  bank			text,
  balance		DOUBLE PRECISION,    
	userID		text,
  FOREIGN KEY(userID) REFERENCES users(id)
	
);

DROP TABLE IF EXISTS transactions CASCADE;

CREATE TABLE transactions (
	id											uuid DEFAULT uuid_generate_v1() PRIMARY KEY,
	senderAccId							uuid,
	recAccId								uuid,
	senderId								text,
	recId										text,
	amount									FLOAT,
	note										text,
	sendernumber						text,
	recnumber								text,
	date 										text,
	FOREIGN KEY(senderAccId) REFERENCES accounts(id),
	FOREIGN KEY(recAccId) REFERENCES accounts(id),
	FOREIGN KEY(senderId) REFERENCES users(id),
	FOREIGN KEY(recId) REFERENCES users(id)
);









