CREATE TABLE result
(
    id UUID NOT NULL,

    enterprise_id UUID NOT NULL,

    employee_name VARCHAR(100) NOT NULL,
    employee_cpf VARCHAR(14) NOT NULL,

    apt BOOLEAN NOT NULL,

    file_name VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID,

    CONSTRAINT pk_results
        PRIMARY KEY (id),

    CONSTRAINT fk_result_enterprise
        FOREIGN KEY (enterprise_id)
            REFERENCES enterprise (id)
);

CREATE INDEX idx_result_enterprise_id
    ON result (enterprise_id);

CREATE INDEX idx_result_employee_cpf
    ON result (employee_cpf);