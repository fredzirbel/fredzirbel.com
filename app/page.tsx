import Bento from '@/components/sections/Bento';
import Contact from '@/components/sections/Contact';
import ExperiencePin from '@/components/sections/ExperiencePin';
import Hero from '@/components/sections/Hero';
import ImpactHighlights from '@/components/sections/ImpactHighlights';
import Work from '@/components/sections/Work';
import Writing from '@/components/sections/Writing';
import { getPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getPosts();

  return (
    <>
      <Hero />
      <ImpactHighlights />
      <ExperiencePin />
      <Work />
      {posts.length > 0 && <Writing posts={posts} />}
      <Bento sectionNumber={posts.length > 0 ? '05' : '04'} />
      <Contact hasPosts={posts.length > 0} />
    </>
  );
}
