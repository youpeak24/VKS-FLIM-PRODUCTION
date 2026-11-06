import { Link } from 'react-router-dom'
import Seo from '../components/common/Seo'
import LegalLayout, { Review } from '../components/common/LegalLayout'
import { siteConfig } from '../data/siteConfig'

const { contact, name } = siteConfig

const sections = [
  {
    id: 'website-use',
    title: 'Website Use',
    content: (
      <>
        <p>
          These Terms &amp; Conditions apply to your use of this website, operated by {name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
          &ldquo;our&rdquo;). By using the website you agree to these terms. If you do not agree, please do not use the website.
        </p>
        <p>
          These terms cover the website only. Any production or creative work we carry out is governed by a separate written
          agreement with the client concerned.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: (
      <p>
        Unless stated otherwise, the content of this website &mdash; including the {name} name and logo, text, artwork, graphics and
        design &mdash; belongs to {name} or is used with permission, and is protected by copyright and other intellectual property
        laws.
      </p>
    ),
  },
  {
    id: 'film-and-media',
    title: 'Film and Media Content',
    content: (
      <p>
        Film stills, posters, trailers and other production material shown on this website may belong to {name}, our clients or
        other rights holders. They are shown for portfolio and promotional purposes only. Their appearance here does not grant you
        any right to copy, download, broadcast or reuse them.
      </p>
    ),
  },
  {
    id: 'third-party-video',
    title: 'Third-Party Video Platforms',
    content: (
      <p>
        Some videos are hosted on YouTube and play through an embedded player. Your use of that player is also subject to
        YouTube&rsquo;s terms of service and Google&rsquo;s privacy policy. We are not responsible for the availability or content of
        third-party platforms. See our <Link to="/privacy-policy">Privacy Policy</Link> for how embedded videos are loaded.
      </p>
    ),
  },
  {
    id: 'permitted-use',
    title: 'Permitted Use',
    content: (
      <>
        <p>You may view this website and share links to it for personal, non-commercial purposes. You must not:</p>
        <ul>
          <li>copy, reproduce or republish its content without our written permission;</li>
          <li>use the website in any way that is unlawful, harmful or disrupts its operation;</li>
          <li>attempt to gain unauthorised access to the website or the systems that host it;</li>
          <li>use automated tools to scrape or collect content from the website.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'external-links',
    title: 'External Links',
    content: (
      <p>
        This website contains links to external services such as WhatsApp and YouTube. These links are provided for convenience; we
        do not control those services and are not responsible for their content, policies or practices.
      </p>
    ),
  },
  {
    id: 'content-accuracy',
    title: 'Content Accuracy',
    content: (
      <p>
        We aim to keep the information on this website accurate and up to date, but it is provided for general information only.
        Descriptions of services and projects may change and do not form an offer or a contract.
      </p>
    ),
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer',
    content: (
      <p>
        The website is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the extent permitted by law, we make no
        warranties that it will be uninterrupted, error-free or free of viruses or other harmful components.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Liability Limitations',
    content: (
      <p>
        To the extent permitted by law, {name} is not liable for any indirect or consequential loss arising from your use of, or
        inability to use, this website or any content on it. Nothing in these terms excludes liability that cannot be excluded by
        law. <Review>have this clause checked by a legal adviser</Review>
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    content: (
      <>
        <p>
          We may update these terms from time to time. The current version will always be available on this page, with its
          &ldquo;last updated&rdquo; date. Continued use of the website after changes means you accept the updated terms.
        </p>
        <p>
          <Review>confirm governing law and jurisdiction (for example, the laws of India and the courts of a named city)</Review>
        </p>
      </>
    ),
  },
  {
    id: 'contact-information',
    title: 'Contact Information',
    content: (
      <p>
        Questions about these terms can be sent to <a href={`mailto:${contact.email}`}>{contact.email}</a> or by phone on{' '}
        <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.
      </p>
    ),
  },
]

export default function TermsConditions() {
  return (
    <>
      <Seo path="/terms-and-conditions" />
      <LegalLayout eyebrow="Legal" title="Terms & Conditions" sections={sections} />
    </>
  )
}
