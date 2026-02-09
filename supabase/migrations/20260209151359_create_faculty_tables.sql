/*
  # Create Faculty Schedule and Links Tables

  1. New Tables
    - `schedule`
      - `id` (uuid, primary key)
      - `day_of_week` (text) - День тижня (Понеділок, Вівторок, etc.)
      - `time_slot` (text) - Час заняття (напр. "09:00-10:30")
      - `subject` (text) - Назва предмету
      - `teacher` (text) - Ім'я викладача
      - `room` (text) - Номер аудиторії
      - `group_name` (text) - Назва групи
      - `lesson_type` (text) - Тип заняття (Лекція, Семінар, Практика)
      - `created_at` (timestamp)
    
    - `useful_links`
      - `id` (uuid, primary key)
      - `title` (text) - Назва посилання
      - `url` (text) - URL посилання
      - `category` (text) - Категорія (Бібліотека, Електронні ресурси, Документи, etc.)
      - `description` (text) - Опис посилання
      - `icon` (text) - Назва іконки
      - `order_index` (integer) - Порядок відображення
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (освітня інформація доступна всім)
*/

CREATE TABLE IF NOT EXISTS schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL,
  time_slot text NOT NULL,
  subject text NOT NULL,
  teacher text NOT NULL,
  room text NOT NULL,
  group_name text NOT NULL,
  lesson_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS useful_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  category text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'link',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE useful_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schedule"
  ON schedule FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view useful links"
  ON useful_links FOR SELECT
  TO public
  USING (true);