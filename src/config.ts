export type ExperienceEntry = {
  company: string
  domain: string
  role: string
  start: string
  end: string | 'Present'
  city: string
  /** nearest airport, IATA */
  airport: string
  /** one line on what he did there */
  summary: string
}

export type EducationEntry = {
  school: string
  domain: string
  degree: string
  start: string
  end: string
  city: string
}

export type Project = {
  title: string
  description: string
  href: string
  year?: string
  pinned: boolean
}

export type Post = { title: string; venue: string; domain: string; year: string; href: string }

export const config = {
  name: 'Arham Ahmed',
  headline: 'Senior Software Engineer at LinkedIn. Previously Microsoft.',
  location: 'Sunnyvale, CA',
  // for the local time and weather beside the location
  timezone: 'America/Los_Angeles',
  coords: [37.37, -122.04] as [number, number],
  // TODO confirm the exact wording of his graduation quote with Arham
  quote: 'I’m going to finish what Einstein started.',
  updated: 'October 2026',
  links: {
    github: 'https://github.com/arhamahmed',
    linkedin: 'https://www.linkedin.com/in/arhamahmed',
    email: 'mailto:a.arhamit@gmail.com',
    resume: '/Arham_Ahmed_Resume.pdf',
  },
  // newest first; `city` places the stop on the route map
  experience: [
    { company: 'LinkedIn', domain: 'linkedin.com', role: 'Senior Software Engineer', start: '2025', end: 'Present', city: 'Sunnyvale', airport: 'SJC', summary: 'What did I do here?' },
    { company: 'Microsoft', domain: 'microsoft.com', role: 'Software Engineer II', start: '2019', end: '2025', city: 'Redmond', airport: 'SEA', summary: 'What did I do here?' },
    { company: 'Amazon', domain: 'amazon.com', role: 'Software Engineering Intern', start: '2018', end: '2018', city: 'Seattle', airport: 'SEA', summary: 'What did I do here?' }, // TODO confirm office with Arham
    { company: 'Microsoft', domain: 'microsoft.com', role: 'Software Engineering Intern', start: '2018', end: '2018', city: 'Redmond', airport: 'SEA', summary: 'What did I do here?' },
    { company: 'Google', domain: 'google.com', role: 'Software Engineering Intern', start: '2017', end: '2017', city: 'Kirkland', airport: 'SEA', summary: 'What did I do here?' },
    { company: 'Shopify', domain: 'shopify.com', role: 'Production Engineering Intern', start: '2016', end: '2016', city: 'Ottawa', airport: 'YOW', summary: 'What did I do here?' },
    { company: 'Innovasium Digital', domain: 'innovasium.com', role: 'Software Engineering Intern', start: '2016', end: '2016', city: 'Markham', airport: 'YYZ', summary: 'What did I do here?' },
    { company: 'Symcor', domain: 'symcor.com', role: 'Software Engineering Intern', start: '2015', end: '2015', city: 'Mississauga', airport: 'YYZ', summary: 'What did I do here?' },
  ] satisfies ExperienceEntry[],
  projects: [
    { title: 'google-cloud-gemserver', description: 'Private Ruby gem server on Google Cloud, built at Google', href: 'https://github.com/GoogleCloudPlatform/google-cloud-gemserver', year: '2017', pinned: true },
    { title: 'ray-tracer', description: 'A ray tracer written in Rust', href: 'https://github.com/arhamahmed/ray-tracer', pinned: true },
    { title: 'hackWestern', description: 'Japanese sign language interpreter built with Leap Motion', href: 'https://github.com/arhamahmed/hackWestern', year: '2015', pinned: true },
    { title: 'medical-ner', description: 'Named-entity recognition on medical text', href: 'https://github.com/arhamahmed/medical-ner', pinned: false },
    { title: 'infoCrypt', description: 'Android app that encrypts data to a key-locked file', href: 'https://github.com/arhamahmed/Android-encryption-app-infoCrypt', pinned: false },
    { title: 'Texessible', description: 'SMS client for Texessible', href: 'https://github.com/arhamahmed/Texessible-SMS-client-', pinned: false },
  ] satisfies Project[],
  writing: [
    { title: 'Rolling your own private Ruby gem server on Google Cloud Platform', venue: 'Google Cloud Blog', domain: 'cloud.google.com', year: '2017', href: 'https://cloud.google.com/blog/products/gcp/rolling-your-own-private-ruby-gem-server-on-google-cloud-platform' },
    { title: 'Building a Dynamic Mobile CI System', venue: 'Shopify Engineering', domain: 'shopify.engineering', year: '2016', href: 'https://shopify.engineering/building-a-dynamic-mobile-ci-system' },
  ] satisfies Post[],
  // newest first
  education: [
    { school: 'University of Illinois Urbana-Champaign', domain: 'illinois.edu', degree: 'Master of Computer Science', start: '2021', end: '2023', city: 'Urbana-Champaign' },
    { school: 'University of Waterloo', domain: 'uwaterloo.ca', degree: 'BASc, Computer Engineering', start: '2014', end: '2019', city: 'Waterloo' },
  ] satisfies EducationEntry[],
}
