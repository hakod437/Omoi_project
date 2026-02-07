-- =====================================================
-- OMOI DATABASE SCHEMA
-- Version: 1.0.0
-- Description: Initial schema for anime tracking app
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- Extends Supabase auth.users with app-specific data
-- =====================================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for email lookups
CREATE INDEX idx_users_email ON public.users(email);

-- =====================================================
-- ANIMES TABLE
-- Cache for Jikan/MAL anime data
-- =====================================================
CREATE TABLE public.animes (
    mal_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    title_english TEXT,
    title_japanese TEXT,
    synopsis TEXT,
    type TEXT,
    status TEXT,
    episodes INTEGER,
    duration TEXT,
    score DECIMAL(4,2),
    rank INTEGER,
    popularity INTEGER,
    season TEXT,
    year INTEGER,
    source TEXT,
    rating TEXT,
    images JSONB,
    genres JSONB DEFAULT '[]'::jsonb,
    themes JSONB DEFAULT '[]'::jsonb,
    demographics JSONB DEFAULT '[]'::jsonb,
    studios JSONB DEFAULT '[]'::jsonb,
    aired JSONB,
    cached_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for common queries
CREATE INDEX idx_animes_title ON public.animes USING gin(to_tsvector('simple', title));
CREATE INDEX idx_animes_cached_at ON public.animes(cached_at);

-- =====================================================
-- USER_ANIMES TABLE
-- User's anime list with personal ratings
-- =====================================================
CREATE TABLE public.user_animes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mal_id INTEGER NOT NULL REFERENCES public.animes(mal_id) ON DELETE CASCADE,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 6),
    animation_rating INTEGER CHECK (animation_rating >= 1 AND animation_rating <= 6),
    user_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Prevent duplicate entries
    CONSTRAINT unique_user_anime UNIQUE(user_id, mal_id)
);

-- Indexes for efficient queries
CREATE INDEX idx_user_animes_user_id ON public.user_animes(user_id);
CREATE INDEX idx_user_animes_mal_id ON public.user_animes(mal_id);

-- =====================================================
-- FRIENDSHIPS TABLE
-- Bidirectional friend relationships
-- =====================================================
CREATE TABLE public.friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Prevent duplicate/self friendships
    CONSTRAINT no_self_friendship CHECK (requester_id != addressee_id),
    CONSTRAINT unique_friendship UNIQUE(requester_id, addressee_id)
);

-- Indexes for friend lookups
CREATE INDEX idx_friendships_requester ON public.friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON public.friendships(addressee_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update timestamps
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_animes_updated_at
    BEFORE UPDATE ON public.user_animes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_animes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- USERS policies
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can view friends profiles"
    ON public.users FOR SELECT
    USING (
        id IN (
            SELECT addressee_id FROM public.friendships 
            WHERE requester_id = auth.uid() AND status = 'accepted'
            UNION
            SELECT requester_id FROM public.friendships 
            WHERE addressee_id = auth.uid() AND status = 'accepted'
        )
    );

-- ANIMES policies (public read, service role for writes)
CREATE POLICY "Anyone can read anime cache"
    ON public.animes FOR SELECT
    USING (true);

CREATE POLICY "Service role can manage anime cache"
    ON public.animes FOR ALL
    USING (auth.role() = 'service_role');

-- USER_ANIMES policies
CREATE POLICY "Users can view their own anime list"
    ON public.user_animes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own anime list"
    ON public.user_animes FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view friends anime lists"
    ON public.user_animes FOR SELECT
    USING (
        user_id IN (
            SELECT addressee_id FROM public.friendships 
            WHERE requester_id = auth.uid() AND status = 'accepted'
            UNION
            SELECT requester_id FROM public.friendships 
            WHERE addressee_id = auth.uid() AND status = 'accepted'
        )
    );

-- FRIENDSHIPS policies
CREATE POLICY "Users can view their friendships"
    ON public.friendships FOR SELECT
    USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can send friend requests"
    ON public.friendships FOR INSERT
    WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendships they're part of"
    ON public.friendships FOR UPDATE
    USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can delete friendships they're part of"
    ON public.friendships FOR DELETE
    USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- =====================================================
-- VIEWS (for optimized queries)
-- =====================================================

-- User's anime list with full anime data
CREATE OR REPLACE VIEW user_anime_details AS
SELECT 
    ua.id,
    ua.user_id,
    ua.user_rating,
    ua.animation_rating,
    ua.user_description,
    ua.created_at as added_at,
    a.*
FROM public.user_animes ua
JOIN public.animes a ON ua.mal_id = a.mal_id;

-- Friend list with user details
CREATE OR REPLACE VIEW friend_list AS
SELECT 
    f.id as friendship_id,
    f.status,
    f.created_at as friendship_created_at,
    CASE 
        WHEN f.requester_id = auth.uid() THEN f.addressee_id
        ELSE f.requester_id
    END as friend_id,
    u.display_name as friend_name,
    u.avatar_url as friend_avatar,
    u.email as friend_email
FROM public.friendships f
JOIN public.users u ON u.id = CASE 
    WHEN f.requester_id = auth.uid() THEN f.addressee_id
    ELSE f.requester_id
END
WHERE f.requester_id = auth.uid() OR f.addressee_id = auth.uid();
