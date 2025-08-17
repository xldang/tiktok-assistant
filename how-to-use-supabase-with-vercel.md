### vercel官方指导：如何在next.js项目中连接使用supabase 数据库
---
#### 1、Create a Supabase database table
When your project is up and running, click Open in Supabase button, go to the Table Editor, create a new table and insert some data.

Alternatively, you can run the following snippet in your project's SQL Editor. This will create a countries table with some sample data.

```
-- Create the table
create table notes (
  id bigint primary key generated always as identity,
  title text not null
);

-- Insert some sample data into the table
insert into notes (title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!');

alter table notes enable row level security;
```
Make the data in your table publicly readable by adding an RLS policy:
```
create policy "public can read countries"
on public.notes
for select to anon
using (true);
```
---
#### 2、Create your Next.js app
---
#### 3、Connect to a project

Start by connecting to your existing project and then run "vercel link" in the vercel CLI to link to the project locally.

---
#### 4、Pull your latest environment variables

Run "vercel env pull .env.development.local" to make the latest environment variables available to your project locally.

---
#### 5、Query Supabase data from Next.js

Create a new file at "app/notes/page.tsx" and populate with the following.

```
import { createClient } from '@/utils/supabase/server';

export default async function Notes() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("notes").select();

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
```
---
#### 6、Start the app

Run the development server with npm run dev.

---