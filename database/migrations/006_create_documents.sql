CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID NOT NULL,

    document_type VARCHAR(50) NOT NULL,

    file_name VARCHAR(255) NOT NULL,

    file_url TEXT NOT NULL,

    file_size BIGINT,

    mime_type VARCHAR(100),

    verification_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (
            verification_status IN (
                'pending',
                'verified',
                'rejected'
            )
        ),

    rejection_reason TEXT,

    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    verified_at TIMESTAMPTZ,

    CONSTRAINT fk_document_application
        FOREIGN KEY (application_id)
        REFERENCES admission_applications(id)
        ON DELETE CASCADE
);