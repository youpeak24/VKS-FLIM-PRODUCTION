import Seo from '../components/common/Seo'
import Hero from '../components/home/Hero'
import Introduction from '../components/home/Introduction'
import FeaturedWorks from '../components/home/FeaturedWorks'
import ColorStatement from '../components/home/ColorStatement'
import ServicesPreview from '../components/home/ServicesPreview'
import Showreel from '../components/home/Showreel'
import WhyChooseUs from '../components/home/WhyChooseUs'
import CreativeSignature from '../components/home/CreativeSignature'
import ContactCTA from '../components/home/ContactCTA'

export default function Home() {
  return (
    <>
      <Seo path="/" />
      <Hero />
      <Introduction />
      <FeaturedWorks />
      <ColorStatement />
      <ServicesPreview />
      <Showreel />
      <WhyChooseUs />
      <CreativeSignature />
      <ContactCTA />
    </>
  )
}
