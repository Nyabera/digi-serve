"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  Circle,
  Clock,
  FileCheck,
  FileText,
  GraduationCap,
  Headphones,
  Menu,
  Receipt,
  Search,
  Send,
  Upload,
  User,
  Users,
  X,
  type LucideIcon,
  BookOpenCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "./savannah-homepage.module.css";

type SearchItem = {
  category: string;
  title: string;
  description: string;
  href: string;
};

type ActionItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type ServiceItem = {
  number: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: "cobalt" | "orange" | "lime" | "neutral";
};

type ProcessItem = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: "cobalt" | "orange" | "lime" | "neutral";
};

const searchItems: SearchItem[] = [
  {
    category: "Academic Records",
    title: "Academic transcript request",
    description: "Request an official academic record.",
    href: "/demo/services/transcript-request",
  },
  {
    category: "Academic Records",
    title: "Missing marks review",
    description: "Ask Student Records to review a missing result.",
    href: "/demo/services/missing-marks-review",
  },
  {
    category: "Clearance and Graduation",
    title: "Student clearance",
    description: "Clear Finance, Library, your department and Registrar.",
    href: "/demo/services/student-clearance",
  },
  {
    category: "Certificates and Documents",
    title: "Certificate replacement",
    description: "Replace a lost or damaged college certificate.",
    href: "/demo/services/certificate-replacement-request",
  },
  {
    category: "Industrial Attachment",
    title: "Industrial attachment letter",
    description: "Request an introduction, placement or completion letter.",
    href: "/demo/services/industrial-attachment-letter-letter",
  },
  {
    category: "Fees and Payments",
    title: "Fee status and payment confirmation",
    description: "Check a payment reference or Finance hold.",
    href: "/demo/track/REQ-DEMO-001",
  },
  {
    category: "Student Support",
    title: "Upload requested documents",
    description: "Return a correction or missing document.",
    href: "/demo/apply/transcript-request",
  },
];

const quickActions: ActionItem[] = [
  {
    label: "Request a transcript",
    href: "/demo/services/transcript-request",
    icon: FileText,
  },
  {
    label: "Start student clearance",
    href: "/demo/services/student-clearance",
    icon: FileCheck,
  },
  {
    label: "Upload requested documents",
    href: "/demo/apply/transcript-request",
    icon: Upload,
  },
  {
    label: "Check fee status",
    href: "/demo/track/REQ-DEMO-001",
    icon: Receipt,
  },
  {
    label: "Get an attachment letter",
    href: "/demo/services/industrial-attachment-letter-letter",
    icon: Briefcase,
  },
];

const services: ServiceItem[] = [
  {
    number: "01",
    title: "Request an academic transcript",
    description:
      "Get an official record of your results for further study, employment or professional registration.",
    href: "/demo/services/transcript-request",
    icon: FileText,
    accent: "cobalt",
  },
  {
    number: "02",
    title: "Complete student clearance",
    description:
      "Clear Finance, Library, your academic department and the Registrar through one tracked request.",
    href: "/demo/services/student-clearance",
    icon: FileCheck,
    accent: "orange",
  },
  {
    number: "03",
    title: "Replace a lost certificate",
    description:
      "Apply for a replacement certificate and upload the required identification and supporting documents.",
    href: "/demo/services/certificate-replacement-request",
    icon: GraduationCap,
    accent: "lime",
  },
  {
    number: "04",
    title: "Get an industrial attachment letter",
    description:
      "Request an introduction, placement or completion letter for your industrial attachment.",
    href: "/demo/services/industrial-attachment-letter-letter",
    icon: Briefcase,
    accent: "neutral",
  },
{
    number: "05",
    title: "Apply for a new course",
    description:
      "Choose a course, submit your qualifications and track your application through review and admission.",
    href: "/demo/services/course-application",
    icon: GraduationCap,
    accent: "neutral",
  },
{
    number: "06",
    title: "Register for classes",
    description:
      "Select your units for the upcoming term and submit them for academic and finance clearance.",
    href: "/demo/services/class-registration",
    icon: BookOpenCheck,
    accent: "neutral",
  },
];

const process: ProcessItem[] = [
  {
    number: "01",
    title: "Choose a service",
    description:
      "Check the requirements, expected timeline and any fee before you begin.",
    icon: Search,
    accent: "cobalt",
  },
  {
    number: "02",
    title: "Submit your request",
    description:
      "Add your details and upload the documents requested by the college.",
    icon: Upload,
    accent: "orange",
  },
  {
    number: "03",
    title: "College review",
    description:
      "The relevant offices review the request and ask for corrections if needed.",
    icon: Users,
    accent: "lime",
  },
  {
    number: "04",
    title: "Receive the outcome",
    description:
      "Track every update and download or collect the final document when ready.",
    icon: Bell,
    accent: "neutral",
  },
];

const faqs = [
  {
    question: "How do I track a college request?",
    answer:
      "Use the request reference shown after submission. The tracking page shows the current student-safe status, completed stages and any action required from you.",
  },
  {
    question: "Which documents do I need for a transcript request?",
    answer:
      "The seeded transcript demonstration requires an identity document and may request a student identifier, payment-reference evidence or name-change evidence where applicable.",
  },
  {
    question: "Do I need to clear outstanding fees first?",
    answer:
      "You may submit the request, but a confirmed Finance hold can pause issuance until the college tells you what action is required.",
  },
  {
    question: "Can I correct or add documents after submission?",
    answer:
      "Yes. When an officer requests a correction, the tracking page explains what must change and provides a controlled resubmission path.",
  },
  {
    question: "How long does certificate replacement take?",
    answer:
      "The service-information page should show the current target, requirements and collection method before you begin. Demo timings are illustrative until approved by the college.",
  },
  {
    question: "Will I collect the document or receive it online?",
    answer:
      "The final outcome will state whether controlled download or physical collection is available for that request.",
  },
];

const requestTimeline = [
  {
    label: "Request submitted",
    value: "24 Jul, 9:12 am",
    state: "complete",
  },
  {
    label: "Records review",
    value: "24 Jul, 11:40 am",
    state: "complete",
  },
  {
    label: "Finance verification",
    value: "In progress",
    state: "current",
  },
  {
    label: "Registrar approval",
    value: "Pending",
    state: "pending",
  },
  {
    label: "Transcript issued",
    value: "Pending",
    state: "pending",
  },
] as const;

const metrics = [
  {
    value: "4,820",
    label: "Student requests completed",
    icon: FileCheck,
    accent: "cobalt",
  },
  {
    value: "87%",
    label: "Completed within target time",
    icon: Clock,
    accent: "lime",
  },
  {
    value: "2.6 days",
    label: "Average transcript turnaround",
    icon: Receipt,
    accent: "orange",
  },
  {
    value: "3",
    label: "Core offices in the transcript route",
    icon: Building2,
    accent: "neutral",
  },
] as const;

function TimelineMarker({
  state,
}: {
  state: (typeof requestTimeline)[number]["state"];
}) {
  if (state === "complete") {
    return (
      <span className={`${styles.timelineMarker} ${styles.completeMarker}`}>
        <Check aria-hidden="true" />
        <span className={styles.srOnly}>Complete</span>
      </span>
    );
  }

  if (state === "current") {
    return (
      <span className={`${styles.timelineMarker} ${styles.currentMarker}`}>
        <Circle aria-hidden="true" />
        <span className={styles.srOnly}>Current stage</span>
      </span>
    );
  }

  return (
    <span className={`${styles.timelineMarker} ${styles.pendingMarker}`}>
      <Circle aria-hidden="true" />
      <span className={styles.srOnly}>Pending</span>
    </span>
  );
}

export function SavannahHomepage() {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const matchingItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return searchItems.slice(0, 5);
    }

    return searchItems.filter((item) =>
      [item.category, item.title, item.description]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className={styles.page} data-savannah-homepage="true">
      <section className={`${styles.darkRegion} demo-surface-dark`}>
        <header className={styles.header}>
          <div className={styles.container}>
            <div className={styles.headerInner}>
              <Link className={styles.brand} href="/demo" aria-label="Savannah Technical College home">
                <span className={styles.monogram} aria-hidden="true">
                  STC
                </span>
                <span className={styles.brandName}>Savannah Technical College</span>
                <span className={styles.brandDivider} aria-hidden="true" />
                <span className={styles.brandDescriptor}>
                  Student Services
                  <br />
                  Online Portal
                </span>
              </Link>

              <nav className={styles.desktopNav} aria-label="Student services">
                <a href="#services">Services</a>
                <Link href="/demo/track">My requests</Link>

                <a href="#support">Student support</a>
                <a href="#story">About the college</a>
              </nav>

              <div className={styles.headerActions}>
                <Link className={styles.signInButton} href="/demo/sign-up">
                  <User aria-hidden="true" />
                  <span>Student sign in</span>
                </Link>

                <button
                  className={styles.menuButton}
                  type="button"
                  aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="savannah-mobile-navigation"
                  onClick={() => setMobileMenuOpen((current) => !current)}
                >
                  {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                </button>
              </div>
            </div>

            {mobileMenuOpen ? (
              <nav
                id="savannah-mobile-navigation"
                className={styles.mobileNav}
                aria-label="Mobile student services"
              >
                <a href="#services" onClick={() => setMobileMenuOpen(false)}>
                  Services
                </a>
                <Link href="/demo/track">My requests</Link>
                <a href="#support" onClick={() => setMobileMenuOpen(false)}>
                  Student support
                </a>
                <a href="#story" onClick={() => setMobileMenuOpen(false)}>
                  About the college
                </a>
              </nav>
            ) : null}
          </div>
        </header>

        <main>
          <div className={styles.container}>
            <div className={styles.heroTop}>
              <div className={styles.heroCopy}>
                <p className={styles.darkEyebrow}>Savannah Technical College</p>
                <h1>
                  College services.
                  <br />
                  One clear place.
                </h1>
                <p className={styles.heroLead}>
                  Request transcripts, complete clearance, replace certificates and track
                  every step—from submission to final outcome.
                </p>
                <div className={styles.heroActions}>
                  <a className={styles.primaryButton} href="#services">
                    Browse student services
                    <ArrowRight aria-hidden="true" />
                  </a>
                  <Link className={styles.secondaryButton} href="/demo/track">
                    Track a request
                  </Link>
                </div>
              </div>

              <div className={styles.searchArea}>
                <label className={styles.srOnly} htmlFor="savannah-service-search">
                  Search Savannah Technical College student services
                </label>
                <div
                  className={`${styles.searchControl} ${
                    searchOpen ? styles.searchControlOpen : ""
                  }`}
                >
                  <Search aria-hidden="true" />
                  <input
                  role="combobox"
                    ref={searchRef}
                    id="savannah-service-search"
                    type="search"
                    value={query}
                    placeholder="Search transcripts, clearance, attachment letters, fees…"
                    autoComplete="off"
                    aria-expanded={searchOpen}
                    aria-controls="savannah-search-results"
                    onFocus={() => setSearchOpen(true)}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setSearchOpen(true);
                    }}
                  />
                  <kbd aria-hidden="true">⌘ K</kbd>
                </div>

                {searchOpen ? (
                  <div
                    id="savannah-search-results"
                    className={styles.searchResults}
                    role="region"
                    aria-label="Service search results"
                  >
                    {matchingItems.length > 0 ? (
                      matchingItems.map((item) => (
                        <Link
                          key={`${item.category}-${item.title}`}
                          className={styles.searchResult}
                          href={item.href}
                        >
                          <span>
                            <small>{item.category}</small>
                            <strong>{item.title}</strong>
                            <span>{item.description}</span>
                          </span>
                          <ArrowUpRight aria-hidden="true" />
                        </Link>
                      ))
                    ) : (
                      <div className={styles.emptySearch} role="status">
                        No matching service. Try “transcript”, “clearance” or “fees”.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div className={styles.heroMosaic}>
              <div className={styles.actionColumn}>
                <section className={styles.darkCard} aria-labelledby="quick-actions-title">
                  <h2 id="quick-actions-title">Quick actions</h2>
                  <div className={styles.quickActionList}>
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Link key={action.label} className={styles.quickAction} href={action.href}>
                          <Icon aria-hidden="true" />
                          <span>{action.label}</span>
                          <ChevronRight aria-hidden="true" />
                        </Link>
                      );
                    })}
                  </div>
                </section>

                <section className={styles.turnaroundCard} aria-label="Seeded demonstration performance">
                  <span className={styles.demoLabel}>Seeded demo data</span>
                  <p>Average transcript turnaround</p>
                  <strong>
                    2.6 <span>days</span>
                  </strong>
                  <small>▲ 18% faster than last month</small>
                </section>
              </div>

              <figure className={styles.heroPhoto}>
                <Image
                  src="/demo/homepage/savannah-campus-placeholder.jpeg"
                  alt="Campus building used as a Savannah Technical College demonstration placeholder"
                  fill
                  priority
                  sizes="(max-width: 767px) 100vw, (max-width: 1199px) 62vw, 48vw"
                />
                <figcaption className={styles.photoPlaceholder}>
                  Campus image placeholder
                </figcaption>
                <a id="support" className={styles.supportOverlay} href="mailto:studentservices@example.test">
                  <span className={styles.supportIcon}>
                    <Headphones aria-hidden="true" />
                  </span>
                  <span>
                    <strong>Need student support?</strong>
                    <small>Talk to the Student Services team</small>
                  </span>
                  <span className={styles.overlayArrow}>
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </a>
              </figure>

              <div className={styles.trackingColumn}>
                <section className={styles.darkCard} aria-labelledby="track-card-title">
                  <div className={styles.cardHeadingRow}>
                    <h2 id="track-card-title">Track a request</h2>
                    <Link href="/demo/track">
                      View request
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </div>
                  <p className={styles.requestLabel}>Request ID</p>
                  <p className={styles.requestId}>SAV-TR-2026-00421</p>
                  <p className={styles.requestService}>Academic transcript request</p>
                  <div className={styles.stageSummary}>
                    <div>
                      <span className={`${styles.stageDot} ${styles.activeStageDot}`} />
                      <p>
                        <small>Current status</small>
                        <strong>Finance verification</strong>
                      </p>
                    </div>
                    <div>
                      <span className={styles.stageDot} />
                      <p>
                        <small>Next step</small>
                        <strong>Registrar approval</strong>
                      </p>
                    </div>
                  </div>
                </section>

                <section className={styles.darkCard} aria-labelledby="live-status-title">
                  <div className={styles.cardHeadingRow}>
                    <h2 id="live-status-title">Live request status</h2>
                    <Link href="/demo/track">See full timeline</Link>
                  </div>
                  <ol className={styles.timeline}>
                    {requestTimeline.map((item) => (
                      <li key={item.label}>
                        <TimelineMarker state={item.state} />
                        <span className={styles.timelineCopy}>
                          <strong>{item.label}</strong>
                          <small>{item.value}</small>
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          </div>
        </main>
      </section>

      <section id="services" className={`${styles.lightSection} ${styles.servicesSection}`}>
        <div className={`${styles.container} ${styles.editorialGrid}`}>
          <div className={styles.editorialRail}>
            <p className={styles.lightEyebrow}>Popular student services</p>
            <h2>What do you need from the college?</h2>
            <a href="#services">
              View all services
              <ArrowRight aria-hidden="true" />
            </a>
          </div>

          <div className={styles.serviceList}>
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.number} className={styles.serviceRow} href={service.href}>
                  <span className={`${styles.serviceNumber} ${styles[service.accent]}`}>
                    {service.number}
                  </span>
                  <span className={`${styles.serviceIcon} ${styles[service.accent]}`}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span className={styles.serviceCopy}>
                    <strong>{service.title}</strong>
                    <span>{service.description}</span>
                  </span>
                  <ArrowRight className={styles.serviceArrow} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${styles.lightSection} ${styles.processSection}`}>
        <div className={`${styles.container} ${styles.editorialGrid}`}>
          <div className={styles.editorialRail}>
            <p className={styles.lightEyebrow}>How it works</p>
            <h2>How your request moves</h2>
            <p className={styles.italicLine}>Clear. Trackable. Built for students.</p>
            <Link href="/demo/services/transcript-request">
              See the full request process
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <ol className={styles.processGrid}>
            {process.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.number} className={styles.processStep}>
                  <span className={`${styles.processNumber} ${styles[step.accent]}`}>
                    {step.number}
                  </span>
                  <span className={`${styles.processIcon} ${styles[step.accent]}`}>
                    <Icon aria-hidden="true" />
                  </span>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="story" className={styles.storySection}>
        <div className={styles.storyImage}>
          <Image
            src="/demo/homepage/savannah-students-placeholder.jpg"
            alt="Four students standing together on a landscaped campus, used as a demonstration placeholder"
            fill
            sizes="(max-width: 899px) 100vw, 50vw"
          />
          <span>Approved Savannah student image to replace this placeholder</span>
        </div>

        <div className={styles.storyCopy}>
          <p className={styles.lightEyebrow}>Student experience</p>
          <h2>From request to ready—without repeated trips to campus.</h2>
          <p>
            Amina requested her transcript online, uploaded her identification and followed
            each review stage from her phone. When the document was ready, she received a
            clear collection update instead of making repeated visits to Student Records.
          </p>
          <div className={styles.storyAttribution}>
            <span>
              <strong>Amina N.</strong>
              <small>Diploma in Electrical Engineering</small>
            </span>
            <blockquote>
              “I knew which office had my request and what would happen next.”
            </blockquote>
          </div>
          <p className={styles.demoDisclaimer}>
            Illustrative demo persona and placeholder photograph. Replace with an approved,
            consented Savannah Technical College story before public launch.
          </p>
        </div>
      </section>

      <section className={styles.metricsSection} aria-labelledby="metrics-title">
        <div className={styles.container}>
          <div className={styles.metricsHeading}>
            <p id="metrics-title">Student services, made visible.</p>
            <span>Illustrative demo snapshot</span>
          </div>
          <div className={styles.metricsGrid}>
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className={styles.metric}>
                  <span className={`${styles.metricIcon} ${styles[metric.accent]}`}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{metric.value}</strong>
                    <small>{metric.label}</small>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${styles.lightSection} ${styles.faqSection}`}>
        <div className={`${styles.container} ${styles.editorialGrid}`}>
          <div className={styles.editorialRail}>
            <p className={styles.lightEyebrow}>Student service FAQ</p>
            <h2>Before you submit</h2>
            <a href="#faq-list">
              View all help articles
              <ArrowRight aria-hidden="true" />
            </a>
          </div>

          <div id="faq-list" className={styles.faqList}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              const answerId = `savannah-faq-answer-${index}`;
              return (
                <div key={faq.question} className={styles.faqItem}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <span>{faq.question}</span>
                      <span className={styles.faqSymbol} aria-hidden="true">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                  </h3>
                  <div id={answerId} className={styles.faqAnswer} hidden={!isOpen}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={`${styles.container} ${styles.finalCtaInner}`}>
          <span className={styles.sendMark}>
            <Send aria-hidden="true" />
          </span>
          <div>
            <h2>Get your college request moving.</h2>
            <p>Find the right service, check the requirements and track every update.</p>
          </div>
          <div className={styles.ctaActions}>
            <a className={styles.limeButton} href="#services">
              Browse student services
              <ArrowRight aria-hidden="true" />
            </a>
            <Link className={styles.cobaltOutlineButton} href="/demo/track">
              Track a request
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerGrid}`}>
          <div>
            <Link className={styles.footerBrand} href="/demo">
              <span className={styles.monogram}>STC</span>
              <span>
                <strong>Savannah Technical College</strong>
                <small>Student Services Online Portal</small>
              </span>
            </Link>
            <p>
              Fictional seeded institution and non-sensitive demonstration data for the
              FAIDIA Demo Engine.
            </p>
          </div>

          <div>
            <h2>Student services</h2>
            <Link href="/demo/services/transcript-request">Transcript request</Link>
            <Link href="/demo/track">Track a request</Link>
            <Link href="/demo/sign-up">Student sign in</Link>
          </div>

          <div>
            <h2>College support</h2>
            <a href="mailto:studentservices@example.test">Student Services</a>
            <a href="#faq-list">Help and accessibility</a>
            <a href="#story">About the demonstration</a>
          </div>

          <div>
            <h2>Presentation</h2>
            <a href="/demo/demo-journey">Open demonstration journey</a>
            <Link href="/demo/officer">Staff workspace</Link>
            <Link href="/demo/reports">Operational reports</Link>
          </div>
        </div>
        <nav aria-label="Footer navigation">


          <Link href="/demo/verify-certificate">Verify Certificate</Link>
        </nav>
      </footer>
    </div>
  );
}
