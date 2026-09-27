CREATE TABLE IF NOT EXISTS admission_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL,

    course_id UUID NOT NULL,

    application_number VARCHAR(30) UNIQUE NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'submitted'
        CHECK (
            status IN (
                'draft',
                'submitted',
                'under_review',
                'approved',
                'rejected',
                'withdrawn'
            )
        ),

    submitted_at TIMESTAMPTZ,

    reviewed_at TIMESTAMPTZ,

    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_application_student
        FOREIGN KEY (student_id)
        REFERENCES student_profiles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_application_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE RESTRICT
);