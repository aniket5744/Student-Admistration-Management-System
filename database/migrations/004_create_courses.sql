CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    course_code VARCHAR(20) UNIQUE NOT NULL,

    course_name VARCHAR(255) NOT NULL,

    description TEXT,

    duration_years INTEGER NOT NULL,

    total_seats INTEGER NOT NULL,

    available_seats INTEGER NOT NULL,

    eligibility_criteria TEXT,

    application_fee NUMERIC(10,2) NOT NULL DEFAULT 0,

    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);