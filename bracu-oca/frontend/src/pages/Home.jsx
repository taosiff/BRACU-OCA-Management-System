import { Helmet } from "react-helmet";
import { BiTime } from "react-icons/bi";
import { BsBuilding, BsCalendarEvent, BsPeople } from "react-icons/bs";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { MdApproval } from "react-icons/md";
import { Link } from "react-router-dom";

const features = [
  {
    icon: BsCalendarEvent,
    title: "Event Planning",
    description:
      "Plan and manage events effortlessly with integrated tools for scheduling, registration, and updates.",
  },
  {
    icon: MdApproval,
    title: "Efficient Approvals",
    description:
      "Simplify the approval process for club activities and get quick feedback from university authorities.",
  },
  {
    icon: BsBuilding,
    title: "Room Booking",
    description:
      "Seamlessly reserve rooms for events with real-time availability and instant confirmations.",
  },
  {
    icon: BiTime,
    title: "Instant Notifications",
    description:
      "Stay updated with real-time alerts about approvals, event changes, and important announcements.",
  },
  {
    icon: BsPeople,
    title: "Member Management",
    description:
      "Keep track of members, roles, and responsibilities with a streamlined management interface.",
  },
  {
    icon: BsCalendarEvent,
    title: "Unified Calendar",
    description:
      "Access a centralized calendar for all club activities and events to stay organized.",
  },
];

const socialMedia = [
  { name: "Facebook", icon: FaFacebookF, link: "https://facebook.com" },
  { name: "Twitter", icon: FaTwitter, link: "https://twitter.com" },
  { name: "Instagram", icon: FaInstagram, link: "https://instagram.com" },
  { name: "LinkedIn", icon: FaLinkedinIn, link: "https://linkedin.com" },
];

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#FEFFFA] p-6 rounded-2xl border border-[#3A3F47]/10 shadow-sm hover:shadow-lg hover:border-[#0E4D6B]/30 transition-all">
    <div className="h-12 w-12 rounded-xl bg-[#0E4D6B]/10 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-[#0E4D6B]" />
    </div>
    <h3 className="text-lg font-bold text-[#3A3F47] mb-2">{title}</h3>
    <p className="text-[#3A3F47]/75 text-sm leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home | BRACUOca</title>
        <link rel="canonical" href="/" />
      </Helmet>

      <div className="min-h-screen bg-[#FEFFFA] text-[#3A3F47] font-poppins">
        {/* Hero + Integrated Header (Freezing Blue -> Cool Gray) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0E4D6B] via-[#1A4357] to-[#3A3F47]">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#0E4D6B]/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#3A3F47]/60 blur-3xl pointer-events-none" />

          {/* Navbar */}
          <nav className="relative z-10 border-b border-[#FEFFFA]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/logos/oca.svg"
                    alt="BRACUOca"
                    className="h-9 w-9 rounded-lg shadow-sm"
                  />
                  <span className="text-xl font-bold text-[#FEFFFA] tracking-tight">
                    BRACUOca
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#FEFFFA]/80">
                  <a href="#features" className="hover:text-[#FEFFFA] transition-colors">
                    Features
                  </a>
                  <Link to="/login" className="hover:text-[#FEFFFA] transition-colors">
                    Clubs Portal
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="bg-[#FEFFFA] text-[#3A3F47] px-5 py-2 rounded-full hover:bg-[#FEFFFA]/90 transition-all font-semibold text-sm shadow-sm"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center py-28">
              <div className="text-[#FEFFFA] max-w-3xl">
                <div className="inline-block px-4 py-1.5 bg-[#FEFFFA]/10 border border-[#FEFFFA]/15 rounded-full mb-6 backdrop-blur-sm">
                  <span className="text-[#FEFFFA] text-xs font-semibold tracking-wider uppercase">
                    BRAC University • Office of Co-curricular Activities
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
                  Streamline Every{" "}
                  <span className="text-[#8FD3F4]">Club Operation</span>
                </h1>
                <p className="text-[#FEFFFA]/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                  One unified platform for BRAC University clubs and OCA—manage event proposals, room bookings, budgets, announcements, and approvals seamlessly.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/login"
                    className="bg-[#FEFFFA] text-[#3A3F47] px-8 py-3.5 rounded-full hover:bg-[#FEFFFA]/90 transition-all font-semibold text-base shadow-lg"
                  >
                    Get Started
                  </Link>
                  <a
                    href="#features"
                    className="bg-transparent border border-[#FEFFFA]/35 text-[#FEFFFA] px-8 py-3.5 rounded-full hover:bg-[#FEFFFA]/10 transition-all font-medium text-base"
                  >
                    Explore Features
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 bg-[#F4F6F8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0E4D6B]">
                Platform Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3A3F47] mt-2">
                Built for Clubs &amp; OCA Administration
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, idx) => (
                <FeatureCard key={idx} {...f} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#3A3F47] text-[#FEFFFA] py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-xl font-bold tracking-tight">BRACUOca</span>
              <p className="text-sm text-[#FEFFFA]/65 mt-1">
                © {new Date().getFullYear()} BRAC University Office of Co-curricular Activities.
              </p>
            </div>
            <div className="flex gap-4">
              {socialMedia.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.name}
                    className="w-9 h-9 rounded-full bg-[#FEFFFA]/10 hover:bg-[#0E4D6B] flex items-center justify-center transition-colors"
                  >
                    <Icon className="h-4 w-4 text-[#FEFFFA]" />
                  </a>
                );
              })}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
