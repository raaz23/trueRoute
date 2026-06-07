"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle, MessageCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is TrueRoute really 100% free for tourists?",
    answer: "Yes. Our core mission is to protect travelers. All price data, AI guidance, and safety features will remain free forever for tourists. We plan to sustain the platform through premium features for local businesses and tourism board partnerships."
  },
  {
    question: "How do you verify that the 'Fair Prices' are accurate?",
    answer: "Our data comes from three layers: 1) Official government/transport rates, 2) Verified local contributors who live in Nepal, and 3) Crowdsourced 'actual paid' data from recent travelers which is manually audited by our admins."
  },
  {
    question: "Can I use the app without an internet connection?",
    answer: "In Phase 2, we are implementing offline caching. This means you can download the price lists and maps for a city while on hotel WiFi, and access them even when you have no signal in the mountains or remote streets."
  },
  {
    question: "What should I do if a vendor refuses to honor the fair price?",
    answer: "TrueRoute provides the 'Honest Price' as a benchmark. If a vendor refuses, the app provides a list of alternative verified providers nearby or simple Nepali phrases to help you negotiate firmly but politely."
  },
  {
    question: "How can I contribute a price I just paid?",
    answer: "Once you log in (Phase 2), there is a simple '+' button. You can snap a photo of your receipt or type in the service and price. Once an admin verifies it, you earn a 'Local Contributor' badge!"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[var(--bg)] relative overflow-hidden px-6 border-t border-white/5" style={{ background: "rgba(212,160,23,0.04)" }}>
        
      {/* Background Decorative Element using your float-a animation */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float-a" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-tag mb-6 inline-flex items-center gap-2 px-4 py-1 rounded-full border border-gold/20 bg-gold/5 text-gold text-xs font-bold uppercase tracking-widest">
            <HelpCircle className="w-3 h-3" />
            Common Questions
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You <span className="grad-gold">Need to Know</span>
          </h2>
          <p className="text-gray-400 font-body text-lg">
            Transparent answers about our data, our mission, and your safety.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`border rounded-2xl transition-all duration-300 ${
                openIndex === index 
                ? "border-gold/30 bg-card shadow-[0_10px_30px_rgba(0,0,0,0.3)]" 
                : "border-white/5 bg-transparent hover:border-white/10"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`font-display text-xl font-semibold transition-colors ${
                  openIndex === index ? "text-gold" : "text-white"
                }`}>
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-gold" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 border-t border-white/5">
                  <p className="font-body text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Support CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-card to-[#060A14] border border-white/5 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 mb-4">
            <MessageCircle className="text-gold w-6 h-6" />
          </div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-gray-400 font-body mb-6">
            We’re here to help you travel safely. Join our community on Discord or reach out directly.
          </p>
          <button className="bg-gold text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform animate-shimmer bg-[length:200%_100%]">
            Contact Support
          </button>
        </div>

      </div>
    </section>
  );
}