CREATE TABLE IF NOT EXISTS academic_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL,

    qualification VARCHAR(100) NOT NULL,

    institution_name VARCHAR(255) NOT NULL,

    board_or_university VARCHAR(255),

    passing_year INTEGER,

    percentage NUMERIC(5,2),

    grade VARCHAR(20),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_academic_student
        FOREIGN KEY (student_id)
        REFERENCES student_profiles(id)
        ON DELETE CASCADE
);