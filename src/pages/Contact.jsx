import { ArrowUpRight, Mail, Phone } from 'lucide-react'
import Seo from '../components/common/Seo'
import PageHero from '../components/common/PageHero'
import Reveal from '../components/common/Reveal'
import GradientText from '../components/common/GradientText'
import PaintArtwork from '../components/common/PaintArtwork'
import ApertureMark from '../components/common/ApertureMark'
import WhatsAppIcon from '../components/common/WhatsAppIcon'
import ContactForm from '../components/contact/ContactForm'
import { art } from '../data/artwork'
import { siteConfig, whatsappHref } from '../data/siteConfig'

function ContactRow({ href, icon: Icon, label, value, accent, external }) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group flex min-h-[4.5rem] items-center gap-5 border-b border-soft/10 py-4 transition-colors"
      >
        <span className={`grid size-12 shrink-0 place-items-center rounded-full border border-soft/15 transition-colors duration-500 group-hover:border-transparent group-hover:text-obsidian ${accent}`}>
          <Icon className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="eyebrow block text-[0.62rem] text-muted">{label}</span>
          <span className="mt-1 block text-lg font-semibold text-soft [overflow-wrap:anywhere]">{value}</span>
        </span>
        <ArrowUpRight
          className="size-5 shrink-0 text-muted transition-transform duration-500 ease-cinema group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-soft"
          aria-hidden="true"
        />
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    </li>
  )
}

export default function Contact() {
  const { producer, contact } = siteConfig

  return (
    <>
      <Seo path="/contact" />
      <PageHero
        compact
        eyebrow="Let's connect"
        lines={[
          'Got an idea?',
          'Let’s make',
          <>
            it <GradientText variant="aurora" animate>cinematic.</GradientText>
          </>,
        ]}
        sub="From your first idea to your next big production, the conversation starts here."
        image={art.contactArt}
        glow="rgb(255 22 143 / 0.16)"
        entrance="bloom"
        artClassName="right-[-30vw] top-12 w-[80vw] opacity-50 md:right-[-8vw] md:w-[46vw] md:opacity-70 lg:right-[2vw] lg:top-10 lg:w-[32vw] lg:opacity-100"
      />

      <section aria-label="Contact details and form" className="relative pb-[var(--section-y)]">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-5">
            <Reveal className="relative overflow-hidden rounded-[2rem] border border-soft/10 bg-charcoal">
              <div className="relative aspect-[16/11] overflow-hidden">
                <PaintArtwork image={art.contactArt} sizes="(min-width: 1024px) 38vw, 92vw" className="absolute inset-0 h-full w-full scale-150 object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                <div aria-hidden="true" className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2">
                  <ApertureMark idPrefix="contact-ap" className="h-full w-full" ringClassName="animate-spin-slow" ringText="LET'S MAKE IT CINEMATIC • LET'S CONNECT • " />
                </div>
              </div>
              <div className="px-6 pb-4 pt-2 md:px-8">
                <p className="font-display text-2xl font-bold uppercase tracking-tight">{producer.name}</p>
                <p className="eyebrow mt-1 text-[0.65rem] text-magenta">{producer.role}</p>
                <ul className="mt-4">
                  <ContactRow href={contact.phoneHref} icon={Phone} label="Call" value={contact.phoneDisplay} accent="text-cyan group-hover:bg-cyan" />
                  <ContactRow href={`mailto:${contact.email}`} icon={Mail} label="Email" value={contact.email} accent="text-magenta group-hover:bg-magenta" />
                  <ContactRow
                    href={whatsappHref()}
                    icon={WhatsAppIcon}
                    label="WhatsApp"
                    value={contact.phoneDisplay}
                    accent="text-yellow group-hover:bg-yellow"
                    external
                  />
                  {siteConfig.social.map((s) => (
                    <ContactRow key={s.url} href={s.url} icon={ArrowUpRight} label={s.label} value={s.handle ?? s.label} accent="text-violet group-hover:bg-violet" external />
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="min-w-0 lg:col-span-7 lg:pl-6">
            <Reveal>
              <h2 className="display-lg">
                Tell us about <span className="serif-accent lowercase text-gradient [--grad:var(--grad-aurora)]">your story.</span>
              </h2>
              <p className="mt-5 max-w-lg text-muted">
                Share a few details and we&rsquo;ll get back to you. Prefer to talk? Call or WhatsApp {producer.name} directly.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-12">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
