import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] dark:bg-[#0a0f1c] transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 md:p-12"
      >
        <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-700 pb-6">
          Terms of Service & Privacy Policy
        </h1>

        <div className="space-y-8 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">

          {/* Privacy Policy Section */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Privacy Policy</h2>
            <p className="mb-4">
              At Lythos Education, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal data.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Data Collection:</strong> We collect information necessary for academic registration, including student names, contact details, academic history, and IP addresses for security purposes.</li>
              <li><strong>AI Chatbot Data Processing:</strong> If you interact with our AI Chatbot ("Lythos AI"), please be aware that your chat queries and conversational data are processed by a third-party service provider, <strong>Groq Inc.</strong> By using the chatbot, you consent to your chat inputs being securely transmitted to and processed by Groq's API to generate responses. Please do not share highly sensitive personal information (such as passwords, credit card numbers, or full national identification numbers) within the chat interface.</li>
              <li><strong>Data Usage:</strong> Your data is used exclusively for scheduling lessons, assessing academic needs, providing chatbot assistance, and preventing automated bot registrations.</li>
              <li><strong>Data Protection:</strong> We employ industry-standard encryption and Firebase Cloud security rules to ensure your data is accessible only by authorized administrators.</li>
              <li><strong>Third-Party Sharing:</strong> Excluding the specific AI chatbot processing mentioned above, we will never sell, rent, or trade your personal information to any third parties for marketing or advertising purposes.</li>
            </ul>
          </section>

          {/* Terms of Service Section */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. Terms of Service</h2>
            <p className="mb-4">
              By registering for classes with Lythos Education, you agree to the following terms and conditions:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Trial Classes:</strong> Free trial classes are limited to one per student, require genuine registration details, and are strictly subject to availability and the tutor's discretion.</li>
              <li><strong>Payments & Refunds:</strong> All tuition fees must be paid promptly according to the agreed-upon invoicing schedule. Once a lesson has been conducted, the fee for that lesson is strictly non-refundable.</li>
              <li><strong>Cancellations:</strong> If you need to cancel or reschedule a lesson, please provide at least 24 hours' notice. Late cancellations may incur a penalty or forfeit the lesson fee, out of respect for the tutor's time.</li>
              <li><strong>Code of Conduct:</strong> Students are expected to maintain a respectful, attentive, and productive learning environment. Disruptive behavior, harassment, or failure to adhere to academic integrity may result in immediate termination of services without refund.</li>
              <li><strong>Security Measures:</strong> We actively monitor registration activity. Any attempts to bypass our security systems, scrape our website, or submit fraudulent requests will result in an immediate, permanent IP ban.</li>
              <li><strong>Limitation of Liability:</strong> Lythos Education and its tutors shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use of our services, website, or AI chatbot. We do not guarantee specific academic grades or examination results, as student performance depends on individual effort and external factors.</li>
              <li><strong>Indemnification:</strong> By using our services, you agree to indemnify and hold harmless Lythos Education and its affiliates from any claims, damages, or expenses arising from your violation of these Terms of Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. Updates to these Terms</h2>
            <p>
              We reserve the right to modify these policies at any time. Changes will be updated on this page. Your continued use of our services constitutes acceptance of the updated terms.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-700 text-center text-xs text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
