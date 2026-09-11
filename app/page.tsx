import Bento from '@/components/sections/Bento';
import Contact from '@/components/sections/Contact';
import ExperiencePin from '@/components/sections/ExperiencePin';
import Hero from '@/components/sections/Hero';
import Work from '@/components/sections/Work';
import Writing from '@/components/sections/Writing';
import { getPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getPosts();

  return (
    <>
      <Hero />
      <ExperiencePin />
      <Work />
      {posts.length > 0 && <Writing posts={posts} />}
      <Bento sectionNumber={posts.length > 0 ? '04' : '03'} />
      <Contact hasPosts={posts.length > 0} />
    </>
  );
}
