import { useRef, useState } from "react";
import { X } from "lucide-react";
import { contactService } from "../../services/contactService";
import { bootstrapChat } from "../../services/chatService"; 



export const ContactFormOverlay = ({
  onClose,
  onSuccess,
  onSubmitStart
}: {
  onClose: () => void;
  onSuccess: () => void;
  onSubmitStart?: () => void;
}) => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const { userId } = bootstrapChat();    

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendingRef.current) return;       // double-click guard
    sendingRef.current = true;
    setSending(true);

    try {
      // Close overlay first
      onClose();
      
      // Start the email sending animation
      if (onSubmitStart) {
        onSubmitStart();
      }
      
      await contactService.submit({ ...form, user_id: userId });           // POST → /contact  & /notify_teams
      onSuccess();                                 // push "thanks" message
    } catch (err) {
      console.error(err);
      setSending(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white/90 rounded-3xl p-8 border border-blue-100 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:rotate-90 transition">
          <X className="w-5 h-5 text-blue-600" />
        </button>

        <h3 className="text-2xl font-bold text-indigo-700 mb-6">Let's Connect! 😊</h3>

        <div className="space-y-4">
          {["name", "email", "company"].map((field) => (
            <input
              key={field}
              name={field}
              type={field === "email" ? "email" : "text"}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              required={field !== "company"}
              value={(form as any)[field]}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400"
            />
          ))}

          <textarea
            name="message"
            placeholder="Goals / pain-points (optional)"
            rows={3}
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r
                       from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700
                       transition-transform transform hover:-translate-y-0.5 shadow-lg
                       flex items-center justify-center"
          >
            {sending ? (
              <span className="relative flex">
                <span className="w-5 h-5 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <span className="ml-3">Sending…</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
