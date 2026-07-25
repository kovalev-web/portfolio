import Header from './components/Header';
import Hero from './components/Hero';
import Work from './components/Work';
import About from './components/About';
import Experience from './components/Experience';
// Skills & services — parked, not deleted. Restore the import and the
// <Skills /> below when the section is wanted again.
// import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useReveal } from './hooks/useReveal';

export default function App() {
  useReveal();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Work />
        <About />
        <Experience />
        {/* <Skills /> */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
