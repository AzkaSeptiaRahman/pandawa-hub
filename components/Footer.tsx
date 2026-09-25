import {
  FaInstagram,
  FaTiktok,
  FaThreads,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa6";

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/pandawa.nuscrev",
    icon: <FaInstagram size={17} />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@pandawa.nuscrev",
    icon: <FaTiktok size={16} />,
  },
  {
    label: "Threads",
    href: "https://www.threads.net/@pandawa.nuscrev",
    icon: <FaThreads size={17} />,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line-soft bg-app">
      <div className="mx-auto max-w-6xl px-6 pt-12 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* BRAND */}
          <div>
            <h2 className="text-lg font-bold tracking-[3px] text-hi">
              PANDAWA
            </h2>

            <p className="mt-1 text-sm text-low">Kreasi Nusantara</p>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mid">
              Your Moments, All in One Place.
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-4 text-sm text-hi">Get in Touch</h3>

            <div className="flex flex-col gap-3">
              <a
                href="mailto:contact@pandawacreative.com"
                className="flex items-center gap-3 text-sm text-mid transition hover:text-hi"
              >
                <FaEnvelope size={14} />
                <span>contact@pandawacreative.com</span>
              </a>

              <a
                href="https://wa.me/62XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-mid transition hover:text-hi"
              >
                <FaWhatsapp size={16} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* SOCIAL MEDIA */}
          <div>
            <h3 className="mb-4 text-sm text-hi">Follow Us</h3>

            <div className="flex items-center gap-3">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line-soft text-mid transition hover:border-brand/40 hover:bg-brand-soft hover:text-hi"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-10 border-t border-line-soft py-5">
          <p className="text-xs text-low text-center">
            © {new Date().getFullYear()} Pandawa Kreasi Nusantara. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
