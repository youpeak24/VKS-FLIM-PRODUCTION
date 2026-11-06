import { Link } from 'react-router-dom'
import Seo from '../components/common/Seo'
import LegalLayout, { Review } from '../components/common/LegalLayout'
import { siteConfig } from '../data/siteConfig'

const { contact, name } = siteConfig

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: (
      <>
        <p>
          This Privacy Policy explains how {name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) handles information when you
          visit this website or contact us through it.
        </p>
        <p>
          This website is a simple information website. It does not offer user accounts, online payments or a members&rsquo; area.
          <Review>confirm the legal entity name and registered address of the business</Review>
        </p>
      </>
    ),
  },
  {
    id: 'information-collected',
    title: 'Information Collected',
    content: (
      <>
        <p>We only receive personal information that you choose to share with us, for example when you:</p>
        <ul>
          <li>send us an email, including one prepared by the contact form;</li>
          <li>call us or message us on WhatsApp;</li>
          <li>otherwise get in touch about a project.</li>
        </ul>
        <p>
          This may include your name, email address, phone number, the type of project you are interested in and anything you write
          in your message.
        </p>
        <p>
          Like most websites, the server that hosts this site may automatically record basic technical information &mdash; such as
          your IP address, browser type, the page requested and the date and time &mdash; in standard server logs.
          <Review>confirm the hosting provider and its log retention period</Review>
        </p>
      </>
    ),
  },
  {
    id: 'how-information-is-used',
    title: 'How Information Is Used',
    content: (
      <>
        <p>We use the information you share with us to:</p>
        <ul>
          <li>reply to your enquiry and discuss your project;</li>
          <li>arrange meetings, calls or proposals you have asked for;</li>
          <li>keep a record of our correspondence with you.</li>
        </ul>
        <p>We do not sell your personal information, and we do not use it for unrelated marketing without your permission.</p>
      </>
    ),
  },
  {
    id: 'contact-form',
    title: 'Contact Form and Email Communications',
    content: (
      <>
        <p>
          When you press &ldquo;Send message&rdquo;, the details you entered are sent securely to our website server, which emails
          them to us so we can reply. We do not keep a copy of your message on the website; it is held in our email inbox and
          handled according to our email provider&rsquo;s privacy practices as well as this policy.
        </p>
        <p>
          <Review>name the email provider used to receive enquiries and link to its privacy policy</Review>
        </p>
      </>
    ),
  },
  {
    id: 'third-party-services',
    title: 'Third-Party Services',
    content: (
      <>
        <p>Some links and features on this website connect you to services operated by other companies:</p>
        <ul>
          <li>
            <strong>WhatsApp</strong> &mdash; the WhatsApp button opens a chat with us on WhatsApp (operated by WhatsApp LLC / Meta).
            Messages you send there are subject to WhatsApp&rsquo;s own privacy policy.
          </li>
          <li>
            <strong>YouTube</strong> &mdash; see Embedded YouTube Content below.
          </li>
          <li>
            <strong>Email and telephone</strong> &mdash; email and phone links open the apps on your own device.
          </li>
        </ul>
        <p>
          The fonts used on this website are hosted on our own server, so loading them does not send your information to a font
          provider.
        </p>
      </>
    ),
  },
  {
    id: 'youtube',
    title: 'Embedded YouTube Content',
    content: (
      <>
        <p>
          Videos on this website are hosted on YouTube (Google). To protect your privacy, no YouTube content is loaded until you
          choose to play a video. We use YouTube&rsquo;s privacy-enhanced mode (youtube-nocookie.com).
        </p>
        <p>
          Once you play a video, YouTube may collect information about your device and viewing, and may store cookies or similar
          data on your device, according to Google&rsquo;s privacy policy.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and Analytics',
    content: (
      <>
        <p>
          This website does not itself set cookies and does not currently use analytics, advertising or tracking tools. The only
          cookies that may be stored are those placed by YouTube if you choose to play a video.
        </p>
        <p>
          <Review>update this section before adding any analytics or tracking tools</Review>
        </p>
      </>
    ),
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: (
      <p>
        We take reasonable steps to protect the information you share with us. This website is intended to be served over a secure
        HTTPS connection. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute
        security. <Review>confirm HTTPS is enabled on the production hosting</Review>
      </p>
    ),
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: (
      <p>
        We keep correspondence only for as long as it is needed to respond to you, to manage any resulting work, or to meet legal
        and accounting obligations. <Review>state a specific retention period</Review>
      </p>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: (
      <>
        <p>
          You may ask us to tell you what personal information we hold about you, to correct it, or to delete it where we are not
          required to keep it. You can also withdraw any consent you have given.
        </p>
        <p>
          To make a request, email us at <a href={`mailto:${contact.email}`}>{contact.email}</a>.
          <Review>confirm applicable law (for example India&rsquo;s Digital Personal Data Protection Act, 2023) and any grievance officer details required</Review>
        </p>
      </>
    ),
  },
  {
    id: 'policy-changes',
    title: 'Policy Changes',
    content: (
      <p>
        We may update this Privacy Policy from time to time. The latest version will always be published on this page with its
        &ldquo;last updated&rdquo; date.
      </p>
    ),
  },
  {
    id: 'contact-information',
    title: 'Contact Information',
    content: (
      <>
        <p>If you have any questions about this Privacy Policy or how your information is handled, please contact:</p>
        <p>
          <strong>{siteConfig.legalName}</strong>
          <br />
          {siteConfig.producer.name}, {siteConfig.producer.role}
          <br />
          Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <br />
          Phone: <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
        </p>
        <p>
          See also our <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>.
        </p>
      </>
    ),
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <Seo path="/privacy-policy" />
      <LegalLayout eyebrow="Legal" title="Privacy Policy" sections={sections} />
    </>
  )
}
