"use client";

import { useState } from "react";

const langs = [
  { key: "english", label: "🇺🇸 English" },
  { key: "hindi", label: "🇮🇳 Hindi" },
  { key: "french", label: "🇫🇷 French" },
  { key: "german", label: "🇩🇪 German" },
  { key: "spanish", label: "🇪🇸 Spanish" },
  { key: "chinese", label: "🇨🇳 Chinese" },
  { key: "japanese", label: "🇯🇵 Japanese" },
  { key: "arabic", label: "🇸🇦 Arabic" },
  { key: "russian", label: "🇷🇺 Russian" },
  { key: "portuguese", label: "🇧🇷 Portuguese" },
];

const phrases = [
  {
    category: "Prices & Bargaining",
    items: [
      {
        ne: "यो कति हो?",
        romanized: "Yo kati ho?",
        translations: {
          english: "How much is this?",
          hindi: "यह कितना है?",
          french: "Combien coûte ceci ?",
          german: "Wie viel kostet das?",
          spanish: "¿Cuánto cuesta esto?",
          chinese: "这个多少钱？",
          japanese: "これはいくらですか？",
          arabic: "كم سعر هذا؟",
          russian: "Сколько это стоит?",
          portuguese: "Quanto custa isso?",
        },
      },

      {
        ne: "यो धेरै महँगो छ",
        romanized: "Yo dherai mahango chha",
        translations: {
          english: "That is too expensive",
          hindi: "यह बहुत महंगा है",
          french: "C'est trop cher",
          german: "Das ist zu teuer",
          spanish: "Eso es demasiado caro",
          chinese: "太贵了",
          japanese: "高すぎます",
          arabic: "هذا غالي جدًا",
          russian: "Это слишком дорого",
          portuguese: "Isso é muito caro",
        },
      },

      {
        ne: "कम गर्नुस् न?",
        romanized: "Kam garnus na?",
        translations: {
          english: "Can you give a discount?",
          hindi: "थोड़ा कम करोगे?",
          french: "Pouvez-vous faire une réduction ?",
          german: "Können Sie Rabatt geben?",
          spanish: "¿Puedes dar un descuento?",
          chinese: "可以便宜一点吗？",
          japanese: "割引できますか？",
          arabic: "هل يمكنك إعطائي خصم؟",
          russian: "Можете сделать скидку?",
          portuguese: "Pode dar um desconto?",
        },
      },

      {
        ne: "पक्की मूल्य कति हो?",
        romanized: "Pakki mulya kati ho?",
        translations: {
          english: "What is the fixed price?",
          hindi: "तय कीमत क्या है?",
          french: "Quel est le prix fixe ?",
          german: "Was ist der Festpreis?",
          spanish: "¿Cuál es el precio fijo?",
          chinese: "固定价格是多少？",
          japanese: "定価はいくらですか？",
          arabic: "ما هو السعر الثابت؟",
          russian: "Какая фиксированная цена?",
          portuguese: "Qual é o preço fixo?",
        },
      },
    ],
  },

  {
    category: "Getting Around",
    items: [
      {
        ne: "मलाई थमेल लैजानुस्",
        romanized: "Malai Thamel laijanus",
        translations: {
          english: "Take me to Thamel",
          hindi: "मुझे थमेल ले चलो",
          french: "Emmenez-moi à Thamel",
          german: "Bringen Sie mich nach Thamel",
          spanish: "Llévame a Thamel",
          chinese: "带我去泰美尔",
          japanese: "タメルまで連れて行ってください",
          arabic: "خذني إلى ثामيل",
          russian: "Отвезите меня в Тамель",
          portuguese: "Leve-me para Thamel",
        },
      },

      {
        ne: "यहाँ रोक्नुस्",
        romanized: "Yaha roknus",
        translations: {
          english: "Stop here please",
          hindi: "यहाँ रोको",
          french: "Arrêtez ici s'il vous plaît",
          german: "Bitte hier anhalten",
          spanish: "Pare aquí por favor",
          chinese: "请在这里停下",
          japanese: "ここで止めてください",
          arabic: "توقف هنا من فضلك",
          russian: "Остановите здесь, пожалуйста",
          portuguese: "Pare aqui por favor",
        },
      },

      {
        ne: "कति टाढा छ?",
        romanized: "Kati tadha chha?",
        translations: {
          english: "How far is it?",
          hindi: "कितनी दूर है?",
          french: "À quelle distance est-ce ?",
          german: "Wie weit ist es?",
          spanish: "¿Qué tan lejos está?",
          chinese: "有多远？",
          japanese: "どのくらい遠いですか？",
          arabic: "كم يبعد؟",
          russian: "Как далеко это?",
          portuguese: "Quão longe é?",
        },
      },

      {
        ne: "यो सहि बस हो?",
        romanized: "Yo sahi bus ho?",
        translations: {
          english: "Is this the right bus?",
          hindi: "क्या यह सही बस है?",
          french: "Est-ce le bon bus ?",
          german: "Ist das der richtige Bus?",
          spanish: "¿Es este el autobús correcto?",
          chinese: "这是正确的公交车吗？",
          japanese: "これは正しいバスですか？",
          arabic: "هل هذه الحافلة الصحيحة؟",
          russian: "Это правильный автобус?",
          portuguese: "Este é o ônibus certo?",
        },
      },
    ],
  },

  {
    category: "Safety & Emergency",
    items: [
      {
        ne: "मलाई मद्दत चाहिन्छ",
        romanized: "Malai maddat chahinchha",
        translations: {
          english: "I need help",
          hindi: "मुझे मदद चाहिए",
          french: "J'ai besoin d'aide",
          german: "Ich brauche Hilfe",
          spanish: "Necesito ayuda",
          chinese: "我需要帮助",
          japanese: "助けが必要です",
          arabic: "أحتاج إلى مساعدة",
          russian: "Мне нужна помощь",
          portuguese: "Eu preciso de ajuda",
        },
      },

      {
        ne: "प्रहरी बोलाउनुस्",
        romanized: "Prahari bolaaunu",
        translations: {
          english: "Call the police",
          hindi: "पुलिस बुलाओ",
          french: "Appelez la police",
          german: "Rufen Sie die Polizei",
          spanish: "Llama a la policía",
          chinese: "报警",
          japanese: "警察を呼んでください",
          arabic: "اتصل بالشرطة",
          russian: "Вызовите полицию",
          portuguese: "Chame a polícia",
        },
      },

      {
        ne: "म हराएँ",
        romanized: "Ma haraaey",
        translations: {
          english: "I am lost",
          hindi: "मैं खो गया हूँ",
          french: "Je suis perdu",
          german: "Ich habe mich verlaufen",
          spanish: "Estoy perdido",
          chinese: "我迷路了",
          japanese: "道に迷いました",
          arabic: "أنا ضائع",
          russian: "Я потерялся",
          portuguese: "Estou perdido",
        },
      },

      {
        ne: "अस्पताल कहाँ छ?",
        romanized: "Aspataal kahaa chha?",
        translations: {
          english: "Where is the hospital?",
          hindi: "अस्पताल कहाँ है?",
          french: "Où est l'hôpital ?",
          german: "Wo ist das Krankenhaus?",
          spanish: "¿Dónde está el hospital?",
          chinese: "医院在哪里？",
          japanese: "病院はどこですか？",
          arabic: "أين المستشفى؟",
          russian: "Где находится больница?",
          portuguese: "Onde fica o hospital?",
        },
      },
    ],
  },
];

export default function Translation() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeLang, setActiveLang] = useState("english");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);

    setTimeout(() => {
      setCopied(null);
    }, 1500);
  };

  return (
    <section
      id="translate"
      className="py-24 px-6 border-t border-white/5"
    >
      <div className="max-w-[1120px] mx-auto">

        {/* Header */}
        <div className="text-center mb-14 reveal">
          <div
            className="section-tag mb-5"
          >
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--gold)] inline-block" />
            Language Bridge · 10 Languages
          </div>

          <h2 className="font-display text-[42px] md:text-[52px] font-bold leading-tight mb-5">
            Speak to anyone.
            <br />
            <span
              className="grad-gold"
            >
              In any language.
            </span>
          </h2>

          <p className="text-[16px] text-[var(--text-muted)] max-w-[520px] mx-auto">
            Choose your language and instantly translate it into Nepali
            for smooth local communication.
          </p>
        </div>

        {/* Category + Language */}
        <div className="reveal flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">

          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {phrases.map((p, i) => (
              <button
                key={p.category}
                onClick={() => setActiveCategory(i)}
                className={`city-tab border rounded-full px-4 py-2 text-[13px] font-medium ${
                   i === activeCategory
                   ? "border-[rgba(212,160,23,0.45)] bg-[var(--gold-muted)] text-[var(--gold)]"
                   : "border-white/10 text-[var(--text-muted)]"
                }`}
              >
                {p.category}
              </button>
            ))}
          </div>

          {/* Dropdown */}
          <div className="relative">
            <select
              value={activeLang}
              onChange={(e) => setActiveLang(e.target.value)}
              className="
                bg-[var(--bg-card)]
                border
                border-white/10
                text-[13px]
                text-[var(--text)]
                rounded-xl
                px-4
                py-2.5
                outline-none
                focus:border-[rgba(212,160,23,0.45)]
                transition-all
                duration-200
                min-w-[200px]
              "
            >
              {langs.map((lang) => (
                <option
                  key={lang.key}
                  value={lang.key}
                  className="bg-[#0B1120]"
                >
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Phrase Cards */}
        <div className="reveal grid md:grid-cols-2 gap-3">
          {phrases[activeCategory].items.map((item, i) => {
            const translated =
              item.translations[
                activeLang as keyof typeof item.translations
              ];

            return (
              <div
                key={i}
                className="card-hover bg-[var(--bg-card)] border border-white/6 rounded-2xl p-5 group cursor-pointer"
                onClick={() => copy(item.ne)}
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="flex-1">

                    {/* Selected Language */}
                    <div className="text-[13px] text-[var(--text-muted)] mb-2">
                      {translated}
                    </div>

                    {/* Nepali */}
                    <div className="text-[18px] font-semibold text-[var(--text)] mb-1.5">
                      {item.ne}
                    </div>

                    {/* Romanized */}
                    <div className="text-[11px] text-[var(--text-muted)] italic">
                      {item.romanized}
                    </div>
                  </div>

                  <button className="flex-shrink-0 w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:border-[rgba(168,85,247,0.4)]">
                    {copied === item.ne ? "✓" : "📋"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <p className="reveal text-center text-[12px] text-[var(--text-muted)] mt-5">
          Click any phrase to copy · Show your phone screen to locals ·
          Camera translation coming soon
        </p>
      </div>
    </section>
  );
}