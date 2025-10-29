CREATE TABLE IF NOT EXISTS ngos (
  ngo_id       BIGSERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE activity_modality AS ENUM ('onsite','remote','hybrid');
CREATE TYPE activity_status  AS ENUM ('draft','open','closed','archived');
CREATE TYPE enrollment_status AS ENUM ('enrolled','cancelled','completed');

CREATE TABLE IF NOT EXISTS students (
  student_id BIGSERIAL PRIMARY KEY,
  full_name  TEXT NOT NULL,
  email      TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS activities (
  activity_id    BIGSERIAL PRIMARY KEY,
  ngo_id         BIGINT NOT NULL REFERENCES ngos(ngo_id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT,
  category       TEXT,
  modality       activity_modality NOT NULL DEFAULT 'onsite',
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime   TIMESTAMPTZ,
  hours_value    NUMERIC(6,2) DEFAULT 0,
  capacity       INT,
  status         activity_status NOT NULL DEFAULT 'open',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS enrollments (
  enrollment_id  BIGSERIAL PRIMARY KEY,
  activity_id    BIGINT NOT NULL REFERENCES activities(activity_id) ON DELETE CASCADE,
  student_id     BIGINT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  status         enrollment_status NOT NULL DEFAULT 'enrolled',
  enrolled_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (activity_id, student_id)
);
