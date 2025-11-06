INSERT INTO ngos (name)
VALUES ('Helping Hands')
ON CONFLICT DO NOTHING;

INSERT INTO students (full_name, email) VALUES
('Mauricio Ramírez', 'mauricio@uni.edu'),
('Javier Avilés',    'javier@uni.edu')
ON CONFLICT (email) DO NOTHING;

INSERT INTO activities
  (ngo_id, title, description, category, modality, start_datetime, end_datetime, hours_value, capacity, status)
VALUES
  (1, 'Limpieza de playas',
     'Jornada de limpieza', 'Medio ambiente', 'onsite',
     NOW() + INTERVAL '2 day', NOW() + INTERVAL '2 day 3 hour',
     3.0, 30, 'open'),
  (1, 'Reforestación comunitaria',
     'Siembra de árboles nativos', 'Medio ambiente', 'onsite',
     NOW() + INTERVAL '5 day', NOW() + INTERVAL '5 day 4 hour',
     4.0, 25, 'open')
ON CONFLICT DO NOTHING;

INSERT INTO enrollments (activity_id, student_id, status) VALUES
(1, 1, 'enrolled'),
(1, 2, 'completed')
ON CONFLICT DO NOTHING;
