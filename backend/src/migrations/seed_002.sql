INSERT INTO ngos (name) VALUES ('Helping Hands') ON CONFLICT DO NOTHING;

INSERT INTO students (full_name, email) VALUES
('Mauricio Ramírez','mauricio@uni.edu'),
('Javier Avilés','javier@uni.edu')
ON CONFLICT DO NOTHING;

INSERT INTO activities (ngo_id,title,description,category,modality,start_datetime,end_datetime,hours_value,capacity,status)
VALUES (1,'Limpieza de playas','Jornada de limpieza','Medio ambiente','onsite', NOW() + INTERVAL '2 day', NOW() + INTERVAL '2 day 3 hour', 3, 30, 'open')
ON CONFLICT DO NOTHING;

INSERT INTO enrollments (activity_id, student_id, status)
VALUES (1,1,'enrolled'), (1,2,'completed')
ON CONFLICT DO NOTHING;
