CREATE TABLE account (
                         id UUID NOT NULL,

                         name VARCHAR(100) NOT NULL,
                         email VARCHAR(200) NOT NULL,
                         password VARCHAR(255) NOT NULL,

                         role VARCHAR(50) NOT NULL,
                         active BOOLEAN NOT NULL,

                         created_at TIMESTAMP NOT NULL,
                         updated_at TIMESTAMP,
                         created_by UUID,
                         updated_by UUID,

                         CONSTRAINT pk_account
                             PRIMARY KEY (id),

                         CONSTRAINT uk_account_email
                             UNIQUE (email)
);