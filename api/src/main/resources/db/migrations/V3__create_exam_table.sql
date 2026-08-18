CREATE TABLE exam (
                      id UUID NOT NULL,

                      name VARCHAR(100) NOT NULL,
                      active BOOLEAN NOT NULL,

                      created_at TIMESTAMP NOT NULL,
                      updated_at TIMESTAMP,
                      created_by UUID,
                      updated_by UUID,

                      CONSTRAINT pk_exam
                          PRIMARY KEY (id),

                      CONSTRAINT uk_exam_name
                          UNIQUE (name)
);