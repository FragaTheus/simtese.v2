CREATE TABLE enterprise (
                            id UUID NOT NULL,

                            name VARCHAR(200) NOT NULL,
                            cnpj VARCHAR(14) NOT NULL,

                            account_id UUID,

                            active BOOLEAN NOT NULL,

                            created_at TIMESTAMP NOT NULL,
                            updated_at TIMESTAMP,
                            created_by UUID,
                            updated_by UUID,

                            CONSTRAINT pk_enterprise
                                PRIMARY KEY (id),

                            CONSTRAINT uk_enterprise_cnpj
                                UNIQUE (cnpj),

                            CONSTRAINT fk_enterprise_account
                                FOREIGN KEY (account_id)
                                    REFERENCES account (id),

                            CONSTRAINT ck_enterprise_cnpj
                                CHECK (cnpj ~ '^[0-9]{14}$')
    );

CREATE INDEX idx_enterprise_account_id
    ON enterprise (account_id);