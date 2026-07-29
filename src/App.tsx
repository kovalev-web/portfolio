import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Work from './components/Work';
// About — parked, not deleted. Restore the import and the <About /> below
// when the section is wanted again.
// import About from './components/About';
import Experience from './components/Experience';
// Skills & services — parked, not deleted. Restore the import and the
// <Skills /> below when the section is wanted again.
// import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CaseStudy from './components/CaseStudy';
import Cv from './components/Cv';
import NotFound from './components/NotFound';
import { ThemeProvider } from './hooks/useTheme';
import { useReveal } from './hooks/useReveal';
import { useRoute } from './hooks/useRoute';
import { caseBySlug } from './data/cases';

function Home() {
  return (
    <main>
      <Hero />
      <Work />
      {/* <About /> */}
      <Experience />
      {/* <Skills /> */}
      <Contact />
    </main>
  );
}

export default function App() {
  const path = useRoute();

  // Keyed on the route: each page mounts its own `.reveal` nodes, and the
  // observer has to be rebuilt around them or they never fade in.
  useReveal(path);

  // A client-side navigation inherits the old scroll position, which drops you
  // halfway down a case study you have not started reading.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [path]);

  const slug = path.match(/^\/projects\/([^/]+)\/?$/)?.[1];
  const study = slug ? caseBySlug(slug) : undefined;

  return (
    <ThemeProvider>
      <Header />
      {path === '/' ? (
        <Home />
      ) : path === '/cv' ? (
        <Cv />
      ) : study ? (
        <CaseStudy study={study} />
      ) : (
        <NotFound />
      )}
      <Footer />
    </ThemeProvider>
  );
}
