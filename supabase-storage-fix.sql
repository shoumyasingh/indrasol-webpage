-- Simplified script to add enhanced columns first
-- Run this BEFORE the full enhanced-fields-sql script

-- Step 1: Add columns to blogs table
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS document_structure JSONB,
ADD COLUMN IF NOT EXISTS word_count INTEGER,
ADD COLUMN IF NOT EXISTS image_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS table_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS list_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS code_block_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS table_of_contents JSONB,
ADD COLUMN IF NOT EXISTS metadata JSONB,
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Step 2: Add columns to whitepapers table
ALTER TABLE public.whitepapers 
ADD COLUMN IF NOT EXISTS document_structure JSONB,
ADD COLUMN IF NOT EXISTS word_count INTEGER,
ADD COLUMN IF NOT EXISTS image_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS table_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS list_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS code_block_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS table_of_contents JSONB,
ADD COLUMN IF NOT EXISTS metadata JSONB,
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Step 3: Verify columns were added
SELECT 
    table_name,
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name IN ('blogs', 'whitepapers')
AND column_name IN (
    'document_structure', 'word_count', 'image_count', 
    'table_count', 'list_count', 'code_block_count',
    'table_of_contents', 'metadata', 'processing_status',
    'processed_at', 'error_message'
)
ORDER BY table_name, column_name;







-- Add enhanced fields from edge function to blogs and whitepapers tables
-- Run this after the main supabase-storage-fix.sql

-- Add enhanced fields to blogs table
DO $$
BEGIN
    -- Add document_structure column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'document_structure' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN document_structure JSONB;
        COMMENT ON COLUMN public.blogs.document_structure IS 'Structured representation of document headings and sections';
    END IF;
    
    -- Add read_time column if it doesn't exist (standardized from readTime)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'read_time' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN read_time TEXT;
        COMMENT ON COLUMN public.blogs.read_time IS 'Estimated reading time for the document';
    END IF;
    
    -- Add image_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'image_count' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN image_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.blogs.image_count IS 'Number of images in the document';
    END IF;
    
    -- Add table_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'table_count' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN table_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.blogs.table_count IS 'Number of tables in the document';
    END IF;
    
    -- Add list_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'list_count' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN list_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.blogs.list_count IS 'Number of lists in the document';
    END IF;
    
    -- Add code_block_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'code_block_count' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN code_block_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.blogs.code_block_count IS 'Number of code blocks in the document';
    END IF;
    
    -- Add table_of_contents column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'table_of_contents' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN table_of_contents JSONB;
        COMMENT ON COLUMN public.blogs.table_of_contents IS 'Automatically generated table of contents';
    END IF;
    
    -- Add metadata column if it doesn't exist (for additional edge function data)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'metadata' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN metadata JSONB;
        COMMENT ON COLUMN public.blogs.metadata IS 'Additional metadata from document processing';
    END IF;
    
    -- Add processing_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'processing_status' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN processing_status TEXT DEFAULT 'pending';
        COMMENT ON COLUMN public.blogs.processing_status IS 'Status of document processing (pending, processing, completed, failed)';
    END IF;
    
    -- Add processed_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'processed_at' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE;
        COMMENT ON COLUMN public.blogs.processed_at IS 'Timestamp when document was processed by edge function';
    END IF;
    
    -- Add error_message column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'error_message' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN error_message TEXT;
        COMMENT ON COLUMN public.blogs.error_message IS 'Error message if processing failed';
    END IF;
END $$;

-- Add the same enhanced fields to whitepapers table
DO $$
BEGIN
    -- Add document_structure column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'document_structure' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN document_structure JSONB;
        COMMENT ON COLUMN public.whitepapers.document_structure IS 'Structured representation of document headings and sections';
    END IF;
    
    -- Add word_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'word_count' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN word_count INTEGER;
        COMMENT ON COLUMN public.whitepapers.word_count IS 'Total word count of the document';
    END IF;
    
    -- Ensure read_time column exists (handle both readTime and readtime variations)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name IN ('read_time', 'readtime', 'readTime') AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN read_time TEXT;
        COMMENT ON COLUMN public.whitepapers.read_time IS 'Estimated reading time for the document';
    END IF;
    
    -- Add image_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'image_count' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN image_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.whitepapers.image_count IS 'Number of images in the document';
    END IF;
    
    -- Add table_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'table_count' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN table_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.whitepapers.table_count IS 'Number of tables in the document';
    END IF;
    
    -- Add list_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'list_count' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN list_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.whitepapers.list_count IS 'Number of lists in the document';
    END IF;
    
    -- Add code_block_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'code_block_count' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN code_block_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.whitepapers.code_block_count IS 'Number of code blocks in the document';
    END IF;
    
    -- Add table_of_contents column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'table_of_contents' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN table_of_contents JSONB;
        COMMENT ON COLUMN public.whitepapers.table_of_contents IS 'Automatically generated table of contents';
    END IF;
    
    -- Add metadata column if it doesn't exist (for additional edge function data)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'metadata' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN metadata JSONB;
        COMMENT ON COLUMN public.whitepapers.metadata IS 'Additional metadata from document processing';
    END IF;
    
    -- Add processing_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'processing_status' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN processing_status TEXT DEFAULT 'pending';
        COMMENT ON COLUMN public.whitepapers.processing_status IS 'Status of document processing (pending, processing, completed, failed)';
    END IF;
    
    -- Add processed_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'processed_at' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE;
        COMMENT ON COLUMN public.whitepapers.processed_at IS 'Timestamp when document was processed by edge function';
    END IF;
    
    -- Add error_message column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'error_message' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN error_message TEXT;
        COMMENT ON COLUMN public.whitepapers.error_message IS 'Error message if processing failed';
    END IF;
END $$;

-- Create indexes for enhanced fields to improve query performance
CREATE INDEX IF NOT EXISTS idx_blogs_word_count ON public.blogs(word_count);
CREATE INDEX IF NOT EXISTS idx_blogs_processing_status ON public.blogs(processing_status);
CREATE INDEX IF NOT EXISTS idx_blogs_processed_at ON public.blogs(processed_at);
CREATE INDEX IF NOT EXISTS idx_blogs_document_structure ON public.blogs USING GIN (document_structure);
CREATE INDEX IF NOT EXISTS idx_blogs_metadata ON public.blogs USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_whitepapers_word_count ON public.whitepapers(word_count);
CREATE INDEX IF NOT EXISTS idx_whitepapers_processing_status ON public.whitepapers(processing_status);
CREATE INDEX IF NOT EXISTS idx_whitepapers_processed_at ON public.whitepapers(processed_at);
CREATE INDEX IF NOT EXISTS idx_whitepapers_document_structure ON public.whitepapers USING GIN (document_structure);
CREATE INDEX IF NOT EXISTS idx_whitepapers_metadata ON public.whitepapers USING GIN (metadata);

-- Create a view to easily query documents that need processing
CREATE OR REPLACE VIEW public.unprocessed_documents AS
SELECT 
    'blog' as document_type,
    id,
    slug,
    title,
    created_at,
    processing_status,
    error_message
FROM public.blogs
WHERE processing_status IN ('pending', 'failed')
UNION ALL
SELECT 
    'whitepaper' as document_type,
    id,
    slug,
    title,
    created_at,
    processing_status,
    error_message
FROM public.whitepapers
WHERE processing_status IN ('pending', 'failed')
ORDER BY created_at DESC;

-- Grant permissions on the view
GRANT SELECT ON public.unprocessed_documents TO authenticated;

-- Create a function to update processing status
CREATE OR REPLACE FUNCTION public.update_document_processing_status(
    p_table_name TEXT,
    p_document_id UUID,
    p_status TEXT,
    p_error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    IF p_table_name = 'blogs' THEN
        UPDATE public.blogs 
        SET 
            processing_status = p_status,
            processed_at = CASE WHEN p_status IN ('completed', 'failed') THEN NOW() ELSE processed_at END,
            error_message = p_error_message,
            updated_at = NOW()
        WHERE id = p_document_id;
    ELSIF p_table_name = 'whitepapers' THEN
        UPDATE public.whitepapers 
        SET 
            processing_status = p_status,
            processed_at = CASE WHEN p_status IN ('completed', 'failed') THEN NOW() ELSE processed_at END,
            error_message = p_error_message,
            updated_at = NOW()
        WHERE id = p_document_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.update_document_processing_status TO authenticated, service_role;

-- Add a trigger to set processing_status to 'pending' for new documents
CREATE OR REPLACE FUNCTION public.set_processing_status_pending()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.processing_status IS NULL THEN
        NEW.processing_status = 'pending';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables
DROP TRIGGER IF EXISTS set_blogs_processing_status ON public.blogs;
CREATE TRIGGER set_blogs_processing_status
    BEFORE INSERT ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.set_processing_status_pending();

DROP TRIGGER IF EXISTS set_whitepapers_processing_status ON public.whitepapers;
CREATE TRIGGER set_whitepapers_processing_status
    BEFORE INSERT ON public.whitepapers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_processing_status_pending();

-- Create a function to get document statistics
CREATE OR REPLACE FUNCTION public.get_document_statistics(p_table_name TEXT)
RETURNS TABLE (
    total_documents BIGINT,
    published_documents BIGINT,
    pending_processing BIGINT,
    failed_processing BIGINT,
    total_word_count BIGINT,
    avg_word_count NUMERIC,
    total_images BIGINT,
    total_tables BIGINT,
    total_code_blocks BIGINT
) AS $$
BEGIN
    IF p_table_name = 'blogs' THEN
        RETURN QUERY
        SELECT 
            COUNT(*)::BIGINT as total_documents,
            COUNT(*) FILTER (WHERE published = true)::BIGINT as published_documents,
            COUNT(*) FILTER (WHERE processing_status = 'pending')::BIGINT as pending_processing,
            COUNT(*) FILTER (WHERE processing_status = 'failed')::BIGINT as failed_processing,
            COALESCE(SUM(word_count), 0)::BIGINT as total_word_count,
            ROUND(AVG(word_count), 2) as avg_word_count,
            COALESCE(SUM(image_count), 0)::BIGINT as total_images,
            COALESCE(SUM(table_count), 0)::BIGINT as total_tables,
            COALESCE(SUM(code_block_count), 0)::BIGINT as total_code_blocks
        FROM public.blogs;
    ELSIF p_table_name = 'whitepapers' THEN
        RETURN QUERY
        SELECT 
            COUNT(*)::BIGINT as total_documents,
            COUNT(*) FILTER (WHERE published = true)::BIGINT as published_documents,
            COUNT(*) FILTER (WHERE processing_status = 'pending')::BIGINT as pending_processing,
            COUNT(*) FILTER (WHERE processing_status = 'failed')::BIGINT as failed_processing,
            COALESCE(SUM(word_count), 0)::BIGINT as total_word_count,
            ROUND(AVG(word_count), 2) as avg_word_count,
            COALESCE(SUM(image_count), 0)::BIGINT as total_images,
            COALESCE(SUM(table_count), 0)::BIGINT as total_tables,
            COALESCE(SUM(code_block_count), 0)::BIGINT as total_code_blocks
        FROM public.whitepapers;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the statistics function
GRANT EXECUTE ON FUNCTION public.get_document_statistics TO authenticated, anon;

-- Add comments to help developers understand the schema
COMMENT ON TABLE public.blogs IS 'Blog posts with enhanced document processing fields';
COMMENT ON TABLE public.whitepapers IS 'Whitepapers with enhanced document processing fields';
COMMENT ON VIEW public.unprocessed_documents IS 'View showing all documents that need processing or have failed processing';
COMMENT ON FUNCTION public.update_document_processing_status IS 'Update the processing status of a document';
COMMENT ON FUNCTION public.get_document_statistics IS 'Get statistics about documents in a table';


-- Add enhanced fields from edge function to blogs and whitepapers tables
-- Run this after the main supabase-storage-fix.sql

-- Add enhanced fields to blogs table
DO $$
BEGIN
    -- Add document_structure column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'document_structure' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN document_structure JSONB;
        COMMENT ON COLUMN public.blogs.document_structure IS 'Structured representation of document headings and sections';
    END IF;
    
    -- Add read_time column if it doesn't exist (standardized from readTime)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'read_time' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN read_time TEXT;
        COMMENT ON COLUMN public.blogs.read_time IS 'Estimated reading time for the document';
    END IF;
    
    -- Add image_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'image_count' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN image_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.blogs.image_count IS 'Number of images in the document';
    END IF;
    
    -- Add table_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'table_count' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN table_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.blogs.table_count IS 'Number of tables in the document';
    END IF;
    
    -- Add list_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'list_count' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN list_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.blogs.list_count IS 'Number of lists in the document';
    END IF;
    
    -- Add code_block_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'code_block_count' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN code_block_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.blogs.code_block_count IS 'Number of code blocks in the document';
    END IF;
    
    -- Add table_of_contents column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'table_of_contents' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN table_of_contents JSONB;
        COMMENT ON COLUMN public.blogs.table_of_contents IS 'Automatically generated table of contents';
    END IF;
    
    -- Add metadata column if it doesn't exist (for additional edge function data)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'metadata' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN metadata JSONB;
        COMMENT ON COLUMN public.blogs.metadata IS 'Additional metadata from document processing';
    END IF;
    
    -- Add processing_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'processing_status' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN processing_status TEXT DEFAULT 'pending';
        COMMENT ON COLUMN public.blogs.processing_status IS 'Status of document processing (pending, processing, completed, failed)';
    END IF;
    
    -- Add processed_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'processed_at' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE;
        COMMENT ON COLUMN public.blogs.processed_at IS 'Timestamp when document was processed by edge function';
    END IF;
    
    -- Add error_message column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'error_message' AND table_schema = 'public') THEN
        ALTER TABLE public.blogs ADD COLUMN error_message TEXT;
        COMMENT ON COLUMN public.blogs.error_message IS 'Error message if processing failed';
    END IF;
END $$;

-- Add the same enhanced fields to whitepapers table
DO $$
BEGIN
    -- Add document_structure column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'document_structure' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN document_structure JSONB;
        COMMENT ON COLUMN public.whitepapers.document_structure IS 'Structured representation of document headings and sections';
    END IF;
    
    -- Add word_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'word_count' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN word_count INTEGER;
        COMMENT ON COLUMN public.whitepapers.word_count IS 'Total word count of the document';
    END IF;
    
    -- Ensure read_time column exists (handle both readTime and readtime variations)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name IN ('read_time', 'readtime', 'readTime') AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN read_time TEXT;
        COMMENT ON COLUMN public.whitepapers.read_time IS 'Estimated reading time for the document';
    END IF;
    
    -- Add image_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'image_count' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN image_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.whitepapers.image_count IS 'Number of images in the document';
    END IF;
    
    -- Add table_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'table_count' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN table_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.whitepapers.table_count IS 'Number of tables in the document';
    END IF;
    
    -- Add list_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'list_count' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN list_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.whitepapers.list_count IS 'Number of lists in the document';
    END IF;
    
    -- Add code_block_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'code_block_count' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN code_block_count INTEGER DEFAULT 0;
        COMMENT ON COLUMN public.whitepapers.code_block_count IS 'Number of code blocks in the document';
    END IF;
    
    -- Add table_of_contents column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'table_of_contents' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN table_of_contents JSONB;
        COMMENT ON COLUMN public.whitepapers.table_of_contents IS 'Automatically generated table of contents';
    END IF;
    
    -- Add metadata column if it doesn't exist (for additional edge function data)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'metadata' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN metadata JSONB;
        COMMENT ON COLUMN public.whitepapers.metadata IS 'Additional metadata from document processing';
    END IF;
    
    -- Add processing_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'processing_status' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN processing_status TEXT DEFAULT 'pending';
        COMMENT ON COLUMN public.whitepapers.processing_status IS 'Status of document processing (pending, processing, completed, failed)';
    END IF;
    
    -- Add processed_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'processed_at' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE;
        COMMENT ON COLUMN public.whitepapers.processed_at IS 'Timestamp when document was processed by edge function';
    END IF;
    
    -- Add error_message column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'whitepapers' AND column_name = 'error_message' AND table_schema = 'public') THEN
        ALTER TABLE public.whitepapers ADD COLUMN error_message TEXT;
        COMMENT ON COLUMN public.whitepapers.error_message IS 'Error message if processing failed';
    END IF;
END $$;

-- Create indexes for enhanced fields to improve query performance
CREATE INDEX IF NOT EXISTS idx_blogs_word_count ON public.blogs(word_count);
CREATE INDEX IF NOT EXISTS idx_blogs_processing_status ON public.blogs(processing_status);
CREATE INDEX IF NOT EXISTS idx_blogs_processed_at ON public.blogs(processed_at);
CREATE INDEX IF NOT EXISTS idx_blogs_document_structure ON public.blogs USING GIN (document_structure);
CREATE INDEX IF NOT EXISTS idx_blogs_metadata ON public.blogs USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_whitepapers_word_count ON public.whitepapers(word_count);
CREATE INDEX IF NOT EXISTS idx_whitepapers_processing_status ON public.whitepapers(processing_status);
CREATE INDEX IF NOT EXISTS idx_whitepapers_processed_at ON public.whitepapers(processed_at);
CREATE INDEX IF NOT EXISTS idx_whitepapers_document_structure ON public.whitepapers USING GIN (document_structure);
CREATE INDEX IF NOT EXISTS idx_whitepapers_metadata ON public.whitepapers USING GIN (metadata);

-- Create a view to easily query documents that need processing
CREATE OR REPLACE VIEW public.unprocessed_documents AS
SELECT 
    'blog' as document_type,
    id,
    slug,
    title,
    created_at,
    processing_status,
    error_message
FROM public.blogs
WHERE processing_status IN ('pending', 'failed')
UNION ALL
SELECT 
    'whitepaper' as document_type,
    id,
    slug,
    title,
    created_at,
    processing_status,
    error_message
FROM public.whitepapers
WHERE processing_status IN ('pending', 'failed')
ORDER BY created_at DESC;

-- Grant permissions on the view
GRANT SELECT ON public.unprocessed_documents TO authenticated;

-- Create a function to update processing status
CREATE OR REPLACE FUNCTION public.update_document_processing_status(
    p_table_name TEXT,
    p_document_id UUID,
    p_status TEXT,
    p_error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    IF p_table_name = 'blogs' THEN
        UPDATE public.blogs 
        SET 
            processing_status = p_status,
            processed_at = CASE WHEN p_status IN ('completed', 'failed') THEN NOW() ELSE processed_at END,
            error_message = p_error_message,
            updated_at = NOW()
        WHERE id = p_document_id;
    ELSIF p_table_name = 'whitepapers' THEN
        UPDATE public.whitepapers 
        SET 
            processing_status = p_status,
            processed_at = CASE WHEN p_status IN ('completed', 'failed') THEN NOW() ELSE processed_at END,
            error_message = p_error_message,
            updated_at = NOW()
        WHERE id = p_document_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.update_document_processing_status TO authenticated, service_role;

-- Add a trigger to set processing_status to 'pending' for new documents
CREATE OR REPLACE FUNCTION public.set_processing_status_pending()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.processing_status IS NULL THEN
        NEW.processing_status = 'pending';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables
DROP TRIGGER IF EXISTS set_blogs_processing_status ON public.blogs;
CREATE TRIGGER set_blogs_processing_status
    BEFORE INSERT ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.set_processing_status_pending();

DROP TRIGGER IF EXISTS set_whitepapers_processing_status ON public.whitepapers;
CREATE TRIGGER set_whitepapers_processing_status
    BEFORE INSERT ON public.whitepapers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_processing_status_pending();

-- Note: The get_document_statistics function should be created AFTER all columns exist
-- We'll create it at the very end of this script

-- Add comments to help developers understand the schema
COMMENT ON TABLE public.blogs IS 'Blog posts with enhanced document processing fields';
COMMENT ON TABLE public.whitepapers IS 'Whitepapers with enhanced document processing fields';
COMMENT ON VIEW public.unprocessed_documents IS 'View showing all documents that need processing or have failed processing';
COMMENT ON FUNCTION public.update_document_processing_status IS 'Update the processing status of a document';

-- Fix the get_document_statistics function syntax error
-- Replace the incorrect function definition with the correct one

DROP FUNCTION IF EXISTS public.get_document_statistics(TEXT);

-- Create the statistics function with correct syntax
CREATE OR REPLACE FUNCTION public.get_document_statistics(p_table_name TEXT)
RETURNS TABLE (
    total_documents BIGINT,
    published_documents BIGINT,
    pending_processing BIGINT,
    failed_processing BIGINT,
    total_word_count BIGINT,
    avg_word_count NUMERIC,
    total_images BIGINT,
    total_tables BIGINT,
    total_code_blocks BIGINT
) AS $$
BEGIN
    IF p_table_name = 'blogs' THEN
        RETURN QUERY
        SELECT 
            COUNT(*)::BIGINT as total_documents,
            COUNT(*) FILTER (WHERE published = true)::BIGINT as published_documents,
            COUNT(*) FILTER (WHERE processing_status = 'pending')::BIGINT as pending_processing,
            COUNT(*) FILTER (WHERE processing_status = 'failed')::BIGINT as failed_processing,
            COALESCE(SUM(word_count), 0)::BIGINT as total_word_count,
            ROUND(AVG(word_count), 2) as avg_word_count,
            COALESCE(SUM(image_count), 0)::BIGINT as total_images,
            COALESCE(SUM(table_count), 0)::BIGINT as total_tables,
            COALESCE(SUM(code_block_count), 0)::BIGINT as total_code_blocks
        FROM public.blogs;
    ELSIF p_table_name = 'whitepapers' THEN
        RETURN QUERY
        SELECT 
            COUNT(*)::BIGINT as total_documents,
            COUNT(*) FILTER (WHERE published = true)::BIGINT as published_documents,
            COUNT(*) FILTER (WHERE processing_status = 'pending')::BIGINT as pending_processing,
            COUNT(*) FILTER (WHERE processing_status = 'failed')::BIGINT as failed_processing,
            COALESCE(SUM(word_count), 0)::BIGINT as total_word_count,
            ROUND(AVG(word_count), 2) as avg_word_count,
            COALESCE(SUM(image_count), 0)::BIGINT as total_images,
            COALESCE(SUM(table_count), 0)::BIGINT as total_tables,
            COALESCE(SUM(code_block_count), 0)::BIGINT as total_code_blocks
        FROM public.whitepapers;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the statistics function
GRANT EXECUTE ON FUNCTION public.get_document_statistics TO authenticated, anon;

-- Add comment for the statistics function
COMMENT ON FUNCTION public.get_document_statistics IS 'Get statistics about documents in a table';

-- Test the function to make sure it works
SELECT * FROM public.get_document_statistics('blogs');
SELECT * FROM public.get_document_statistics('whitepapers');