INSERT INTO authors (name, email, bio)
VALUES
    (
        'Ana López',
        'ana@ejemplo.com',
        'Escritora especializada en tecnología e innovación'
    ),
    (
        'Laura García',
        'laura@ejemplo.com',
        'Diseñadora apasionada por compartir ideas'
    )
ON CONFLICT (email) DO NOTHING
RETURNING id, name, email;

INSERT INTO posts (author_id, title, content, published)
SELECT
    a.id,
    'Diseño para todos',
    'Una buena idea debe ser accesible para todas las personas.',
    TRUE
FROM authors AS a
WHERE a.email = 'laura@ejemplo.com'
AND NOT EXISTS (
    SELECT 1
    FROM posts AS p
    WHERE p.author_id = a.id
    AND p.title = 'Diseño para todos'
)
RETURNING id, author_id, title, published;

INSERT INTO posts (author_id, title, content, published)
SELECT
    a.id,
    'Mi primera idea',
    'La tecnología nos permite transformar ideas en soluciones.',
    FALSE
FROM authors AS a
WHERE a.email = 'ana@ejemplo.com'
AND NOT EXISTS (
    SELECT 1
    FROM posts AS p
    WHERE p.author_id = a.id
    AND p.title = 'Mi primera idea'
)
RETURNING id, author_id, title, published;