import { useState } from 'react';
import { MessageSquarePlus, X, Send } from 'lucide-react';
import { useFeedbackContext } from '../../stores/feedbackContext';

/**
 * Lightweight beta-feedback mechanism — opens a pre-filled mailto:
 * with exercise/question context. No backend needed.
 *
 * Designed to be unobtrusive: small floating button in bottom-right
 * corner (below bottom nav). Opens a small modal with category chips
 * to set the subject line.
 */
export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>('General feedback');
  const context = useFeedbackContext(s => s.context);

  const categories = [
    'Question unclear',
    'Answer marked wrong (but I think it\'s right)',
    'Audio not playing or wrong',
    'Typo or translation issue',
    'Technical issue / something broken',
    'Suggestion',
    'Other',
  ];

  const buildMailto = () => {
    const subject = encodeURIComponent(`[VCE Chinese Listening] ${category}`);
    const contextLines = context
      ? Object.entries(context).map(([k, v]) => `${k}: ${v}`).join('\n')
      : '';
    const body = encodeURIComponent(
      `Category: ${category}\n\nWhat happened:\n[Please describe]\n\n${contextLines ? `Context:\n${contextLines}\n` : ''}`,
    );
    return `mailto:theroneagle+vcetestchinese@proton.me?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-3 z-40 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Report a problem or send feedback"
        title="Report a problem"
      >
        <MessageSquarePlus size={20} />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-3"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-4 sm:p-5 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="feedback-title"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 id="feedback-title" className="font-semibold text-base flex items-center gap-2">
                <MessageSquarePlus size={18} className="text-blue-600" />
                Send Feedback
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
                aria-label="Close feedback dialog"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              Found a problem or have a suggestion? Pick a category and your email app will open.
            </p>

            <fieldset className="mb-3">
              <legend className="text-xs text-gray-500 mb-1.5">Category</legend>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    aria-pressed={category === cat}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      category === cat
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </fieldset>

            {context && Object.keys(context).length > 0 && (
              <div className="mb-3 p-2 bg-gray-50 rounded text-gray-600 text-xs">
                <p className="font-medium mb-1">Context included:</p>
                <ul className="space-y-0.5">
                  {(Object.entries(context) as [string, string][]).map(([k, v]) => (
                    <li key={k}>
                      <span className="font-mono">{k}</span>: {v}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href={buildMailto()}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Send size={16} />
              Open email to send
            </a>

            <p className="text-xs text-gray-400 mt-2 text-center">
              No tracking — opens your email app with a pre-filled draft.
            </p>
          </div>
        </div>
      )}
    </>
  );
}