import {
  FaInstagram,
  FaTiktok,
  FaThreads,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-8 py-10">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">

          {/* BRAND */}
          <div>
            <h2 className="text-lg font-bold tracking-[3px] text-white">
              PANDAWA
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Kreasi Nusantara
            </p>

            <p className="text-sm text-slate-500 mt-4 max-w-xs leading-relaxed">
              Your Moments, All in One Place.
            </p>
          </div>


          {/* SOCIAL MEDIA */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Follow Us
            </h3>

            <div className="flex items-center gap-3">

              {/* Instagram */}
              <a
                href="https://www.instagram.com/pandawa.nuscrev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-white/10
                           flex items-center justify-center
                           text-slate-400
                           hover:text-white hover:border-white/30
                           hover:bg-white/5
                           transition-all duration-300"
              >
                <FaInstagram size={17} />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@pandawa.nuscrev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-full border border-white/10
                           flex items-center justify-center
                           text-slate-400
                           hover:text-white hover:border-white/30
                           hover:bg-white/5
                           transition-all duration-300"
              >
                <FaTiktok size={16} />
              </a>

              {/* Threads */}
              <a
                href="https://www.threads.net/@pandawa.nuscrev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads"
                className="w-10 h-10 rounded-full border border-white/10
                           flex items-center justify-center
                           text-slate-400
                           hover:text-white hover:border-white/30
                           hover:bg-white/5
                           transition-all duration-300"
              >
                <FaThreads size={17} />
              </a>

            </div>
          </div>


          {/* CONTACT */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              Get in Touch
            </h3>

            <div className="flex flex-col gap-3">

              {/* Email */}
              <a
                href="mailto:contact@pandawacreative.com"
                className="flex items-center gap-3 text-sm text-slate-400
                           hover:text-white transition"
              >
                <FaEnvelope size={14} />
                <span>contact@pandawacreative.com</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/62XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-slate-400
                           hover:text-white transition"
              >
                <FaWhatsapp size={16} />
                <span>WhatsApp</span>
              </a>

            </div>
          </div>

        </div>


        {/* COPYRIGHT */}
        <div className="border-t border-white/10 mt-10 pt-6">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Pandawa Kreasi Nusantara.
            All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}