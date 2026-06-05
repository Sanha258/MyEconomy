CREATE TABLE IF NOT EXISTS monthly_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    reference_month DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_monthly_limits_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_monthly_limits_user_reference_month
        UNIQUE (user_id, reference_month)
);

CREATE INDEX idx_monthly_limits_user_month
    ON monthly_limits(user_id, reference_month);
