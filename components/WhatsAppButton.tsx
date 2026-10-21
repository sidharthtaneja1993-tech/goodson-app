import { whatsappLink } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(
        "Hi Goodson, I'd like to know more about care for my parents."
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Goodson on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-transform duration-200 hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M4 5h16v11H9l-4 4v-4H4z" />
        <path d="M8 9h8M8 12h5" />
      </svg>
      <span>WhatsApp us</span>
    </a>
  );
}
