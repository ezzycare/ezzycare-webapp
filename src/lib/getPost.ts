import { allPosts } from '@/data/blog';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

export function getPost(id: number) {
  const postMeta = allPosts.find((p) => p.id === id);

  if (!postMeta) {
    throw new Error(`Post with id ${id} not found`);
  }

  const filePath = path.join(
    process.cwd(),
    'src/data/postsContent',
    // `${id}.md`
    `1.md`
  );

  const fileContent = fs.readFileSync(filePath, 'utf8');

  const { data, content } = matter(fileContent);

  return {
    ...(postMeta ?? {}),
    frontmatter: data,
    content,
  };
}
