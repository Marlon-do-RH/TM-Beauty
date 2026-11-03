// Thalita's FAQ for the service landing pages. Answers are her wording, verbatim.
// `only` limits a question to one landing page ('nano' or 'botox'); without it the
// question shows on both.

export const FAQ_GROUPS = [
  {
    title: 'Choosing your treatment',
    items: [
      {
        q: 'What is the difference between nanoplasty and hair botox?',
        a: 'The nanoplasty treatment I offer focuses on straightening the hair and reducing volume. Hair botox focuses on improving softness, controlling frizz and reducing volume, with shorter-lasting results. The recommendation depends on your desired result and the condition of your hair.',
      },
      {
        q: 'Which treatment is best for my hair?',
        a: 'First, I assess your hair history and what you would like to achieve: straightening, volume reduction or frizz control. This helps me recommend the most suitable treatment.',
      },
      {
        only: 'nano',
        q: 'Does nanoplasty straighten the hair completely?',
        a: 'Yes, but the result depends on your hair’s texture, resistance and chemical history. Some hair may need two or more sessions to achieve the desired straightness. During the consultation, I explain what results you can expect before we begin.',
      },
      {
        only: 'nano',
        q: 'Will my curls come back after nanoplasty?',
        a: 'With the straightening treatment I offer, the curls do not return in the treated sections. New hair grows with its natural texture.',
      },
      {
        only: 'botox',
        q: 'Does hair botox also straighten the hair? Will I lose my curls?',
        a: 'Hair botox can reduce volume and loosen curls. It should not be presented as a guarantee that your curls will be preserved, as the effect depends on the technique and your hair.',
      },
      {
        q: 'How long does each treatment last?',
        a: 'Nanoplasty lasts around six months, and hair botox lasts up to three months.',
      },
      {
        q: 'Does the treatment help reduce frizz and volume?',
        a: 'Yes, this is one of the aims of these treatments. The level of reduction depends on the treatment chosen and your home care routine.',
      },
      {
        q: 'Will my hair look too flat, or will it still have movement?',
        a: 'The result is intended to look natural. Before the treatment, we discuss your desired level of straightening and volume reduction to align expectations.',
      },
    ],
  },
  {
    title: 'Your hair type and history',
    items: [
      {
        q: 'Does it work on tightly coiled or very voluminous hair?',
        a: 'Yes, but these hair types require an individual assessment. Texture, density and chemical history affect treatment suitability, appointment length and achievable results.',
      },
      {
        q: 'Can I have the treatment on blonde, bleached or highlighted hair?',
        a: 'Yes, provided an appropriate interval is allowed between the two procedures. Fragile hair may need care beforehand.',
      },
      {
        q: 'Can I have the treatment if my hair has already been chemically straightened?',
        a: 'Yes, but certain chemical relaxers require a strand test before proceeding.',
      },
      {
        q: 'Can it damage my hair or cause breakage?',
        a: 'A thorough assessment beforehand and following the recommended home care help minimise the risk of damage and breakage.',
      },
      {
        q: 'Can the treatment change or fade my hair colour?',
        a: 'Some changes in tone may occur, particularly on coloured or bleached hair. This is assessed before the treatment.',
      },
      {
        q: 'Can I have the treatment while pregnant or breastfeeding?',
        a: 'Yes, but you need to consult your healthcare professional before booking.',
      },
    ],
  },
  {
    title: 'Your appointment',
    items: [
      {
        q: 'How does the treatment work?',
        a: 'The appointment includes an assessment, hair preparation, product application, rinsing, blow-drying and straightening, following the treatment protocol.',
      },
      {
        q: 'How long does the appointment take?',
        a: 'For nanoplasty, allow approximately 3½ to 5½ hours. Tightly coiled or very dense hair may require 5 to 8 hours. Hair botox takes approximately 3 to 3½ hours.',
      },
      {
        q: 'How much does it cost? Are there any additional charges?',
        a: 'The price depends on the service and your hair’s length, density and texture. Any additional charges are explained before we begin, so you can review and approve the full price.',
      },
      {
        q: 'Do I need to wash my hair before the appointment?',
        a: 'Please shampoo your hair twice before your appointment, without applying conditioner, a hair mask or styling products afterwards.',
      },
    ],
  },
  {
    title: 'Aftercare',
    items: [
      {
        q: 'Will I still need to use a hairdryer or straightener?',
        a: 'The aim is to simplify your routine and reduce styling time. The product is heat-activated, so a quick blow-dry is recommended for a smooth finish.',
      },
      {
        q: 'What will my hair look like after washing it at home?',
        a: 'Your hair will be transformed and easier to manage. You will receive guidance on caring for and styling it at home.',
      },
      {
        q: 'When can I wash my hair or tie it up?',
        a: 'You can wash your hair and tie it up whenever you like after the treatment.',
      },
      {
        q: 'Should I colour my hair before or after the treatment?',
        a: 'It is better to colour your hair afterwards, as the treatment may alter the colour.',
      },
      {
        q: 'Which shampoo and conditioner should I use?',
        a: 'I recommend products suited to your scalp, hair condition and treatment. Your home care routine should include appropriate cleansing, conditioning and heat protection whenever you use heat.',
      },
      {
        q: 'Does my shampoo need to be sulphate-free?',
        a: 'This recommendation depends on the product used. Being sulphate-free alone does not guarantee that a shampoo is the most suitable choice. You will receive a specific recommendation after your treatment.',
      },
      {
        q: 'Can I swim in a pool or the ocean?',
        a: 'Yes, but protect your hair from frequent exposure to chlorine and salt, and rinse it with fresh water after swimming.',
      },
      {
        q: 'How can I maintain the results?',
        a: 'Use the recommended products, keep your hair conditioned, apply heat protectant when using heat, and avoid overlapping chemical treatments without a professional assessment.',
      },
      {
        q: 'When will I need a root touch-up? Do the lengths need to be treated again?',
        a: 'Touch-ups are planned according to your regrowth and the difference in texture. My root touch-up service covers up to 6 cm of regrowth. The lengths are assessed before any reapplication to avoid unnecessary chemical processing.',
      },
    ],
  },
]

export function faqFor(service) {
  return FAQ_GROUPS.map(g => ({
    ...g,
    items: g.items.filter(it => !it.only || it.only === service),
  }))
}
