-- Create course_materials table
CREATE TABLE IF NOT EXISTS course_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lesson_content table
CREATE TABLE IF NOT EXISTS lesson_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL, -- 'video', 'audio', 'document', 'image', etc.
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for course_materials
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

-- Policy for admins and instructors to manage course materials
CREATE POLICY admin_instructor_manage_course_materials ON course_materials
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'instructor')
    )
  );

-- Policy for students to view course materials
CREATE POLICY student_view_course_materials ON course_materials
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = course_materials.course_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- Add RLS policies for lesson_content
ALTER TABLE lesson_content ENABLE ROW LEVEL SECURITY;

-- Policy for admins and instructors to manage lesson content
CREATE POLICY admin_instructor_manage_lesson_content ON lesson_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.role = 'instructor')
    )
  );

-- Policy for students to view lesson content
CREATE POLICY student_view_lesson_content ON lesson_content
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      JOIN enrollments ON lessons.course_id = enrollments.course_id
      WHERE lesson_content.lesson_id = lessons.id
      AND enrollments.user_id = auth.uid()
    )
  );

