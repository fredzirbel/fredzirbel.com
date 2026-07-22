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
      <Work />
      <ExperiencePin />
      <Writing posts={posts} />
      <Bento />
      <Contact />
    </>
  );
}
