CREATE TABLE appointment (
                             id UUID NOT NULL,

                             employee_name VARCHAR(100) NOT NULL,
                             employee_cpf VARCHAR(11) NOT NULL,

                             enterprise_id UUID NOT NULL,

                             shift VARCHAR(50) NOT NULL,
                             exam_type VARCHAR(50) NOT NULL,
                             exam_status VARCHAR(50) NOT NULL,

                             observation VARCHAR(500),

                             created_at TIMESTAMP NOT NULL,
                             updated_at TIMESTAMP,
                             created_by UUID,
                             updated_by UUID,

                             CONSTRAINT pk_appointment
                                 PRIMARY KEY (id),

                             CONSTRAINT fk_appointment_enterprise
                                 FOREIGN KEY (enterprise_id)
                                     REFERENCES enterprise (id)
);


CREATE TABLE appointment_exams (
                                   appointment_id UUID NOT NULL,
                                   exam_id UUID NOT NULL,

                                   CONSTRAINT pk_appointment_exams
                                       PRIMARY KEY (appointment_id, exam_id),

                                   CONSTRAINT fk_appointment_exams_appointment
                                       FOREIGN KEY (appointment_id)
                                           REFERENCES appointment (id)
                                           ON DELETE CASCADE,

                                   CONSTRAINT fk_appointment_exams_exam
                                       FOREIGN KEY (exam_id)
                                           REFERENCES exam (id)
);