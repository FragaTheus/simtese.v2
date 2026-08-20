INSERT INTO account (
    id,
    name,
    email,
    password,
    role,
    active,
    created_at,
    updated_at,
    created_by,
    updated_by
)
VALUES (
           '11111111-1111-1111-1111-111111111111',
           'Administrador',
           'admin@simtese.com.br',
           '$argon2id$v=19$m=16384,t=2,p=1$LuX3RhqEgrMAFdgo/gMrTA$4sMdAQSBC6qXkmOJi1zZbr6bXJVtQwbMmgyyRvWtr7s',
           'ADMIN',
           TRUE,
           CURRENT_TIMESTAMP,
           NULL,
           NULL,
           NULL
       );