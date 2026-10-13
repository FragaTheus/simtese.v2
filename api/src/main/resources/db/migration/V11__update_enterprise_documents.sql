ALTER TABLE enterprise
    ALTER COLUMN cnpj DROP NOT NULL;

ALTER TABLE enterprise
    ADD COLUMN caepf VARCHAR(14),
    ADD COLUMN cpf VARCHAR(11);

ALTER TABLE enterprise
    DROP CONSTRAINT IF EXISTS ck_enterprise_cnpj;

ALTER TABLE enterprise
    DROP CONSTRAINT IF EXISTS uk_enterprise_caepf,
    DROP CONSTRAINT IF EXISTS uk_enterprise_cpf,
    DROP CONSTRAINT IF EXISTS ck_enterprise_caepf,
    DROP CONSTRAINT IF EXISTS ck_enterprise_cpf,
    DROP CONSTRAINT IF EXISTS ck_enterprise_single_document;

ALTER TABLE enterprise
    ADD CONSTRAINT uk_enterprise_caepf UNIQUE (caepf),
    ADD CONSTRAINT uk_enterprise_cpf UNIQUE (cpf),
    ADD CONSTRAINT ck_enterprise_cnpj CHECK (cnpj IS NULL OR cnpj ~ '^[0-9]{14}$'),
    ADD CONSTRAINT ck_enterprise_caepf CHECK (caepf IS NULL OR caepf ~ '^[0-9]{14}$'),
    ADD CONSTRAINT ck_enterprise_cpf CHECK (cpf IS NULL OR cpf ~ '^[0-9]{11}$'),
    ADD CONSTRAINT ck_enterprise_single_document CHECK (
        ((CASE WHEN cnpj IS NOT NULL THEN 1 ELSE 0 END) +
         (CASE WHEN caepf IS NOT NULL THEN 1 ELSE 0 END) +
         (CASE WHEN cpf IS NOT NULL THEN 1 ELSE 0 END)) = 1
    );
