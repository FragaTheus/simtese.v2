ALTER TABLE account DROP CONSTRAINT ck_account_role;

ALTER TABLE account
    ADD CONSTRAINT ck_account_role
        CHECK (
            role = 'ADMIN'
                OR role = 'NURSE'
                OR role = 'RECEPTIONIST'
                OR role = 'ENTERPRISE'
        );
