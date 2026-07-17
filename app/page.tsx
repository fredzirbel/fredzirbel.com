import Preloader from '@/components/fx/Preloader';
import Bento from '@/components/sections/Bento';
import Contact from '@/components/sections/Contact';
import ExperiencePin from '@/components/sections/ExperiencePin';
import Hero from '@/components/sections/Hero';
import Manifesto from '@/components/sections/Manifesto';
import Work from '@/components/sections/Work';
import Writing from '@/components/sections/Writing';
import { getPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getPosts();

  return (
    <>
      <Preloader />
      <Hero />
      <Manifesto />
      <Work />
      <ExperiencePin />
      <Bento />
      <Writing posts={posts} />
      <Contact />
    </>
  );
}
