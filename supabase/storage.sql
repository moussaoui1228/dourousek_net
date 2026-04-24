-- Students can upload their own files
CREATE POLICY "Students can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'session-files' AND
  auth.role() = 'authenticated'
);

-- Users can only view their own files
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'session-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);