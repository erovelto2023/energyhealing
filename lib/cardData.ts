export type ChakraType =
    | 'Root'
    | 'Sacral'
    | 'Solar Plexus'
    | 'Heart'
    | 'Throat'
    | 'Third Eye'
    | 'Crown'

export type ElementType = 'Earth' | 'Water' | 'Fire' | 'Air' | 'Spirit'

export type IntentionType = 'Calm' | 'Release' | 'Align' | 'Empower' | 'Love' | 'Create'

export interface EnergyCard {
    id: number
    chakra: ChakraType
    mantra: string
    message: string
    microAction: string
    color: string
    element: ElementType
    intention: IntentionType
}

export const energyCards: EnergyCard[] = [
    // ROOT CHAKRA - Grounding (Red)
    {
        id: 1,
        chakra: 'Root',
        mantra: 'I am grounded, safe, and secure',
        message: 'Your foundation is strong. Today, reconnect with the earth beneath you. Feel the stability that has always been there, supporting every step you take. You are rooted in strength.',
        microAction: 'Stand barefoot for 30 seconds and feel the ground beneath you',
        color: '#C41E3A',
        element: 'Earth',
        intention: 'Calm'
    },
    {
        id: 2,
        chakra: 'Root',
        mantra: 'My body is my sacred home',
        message: 'Honor the vessel that carries you through life. Your body knows what it needs. Listen to its whispers before they become shouts. Nourishment, rest, and movement are your birthright.',
        microAction: 'Place both hands on your belly and take 3 deep breaths',
        color: '#C41E3A',
        element: 'Earth',
        intention: 'Align'
    },
    {
        id: 3,
        chakra: 'Root',
        mantra: 'I release fear and embrace trust',
        message: 'Fear is a messenger, not a master. Today, acknowledge what scares you, then gently set it down. Trust that you have everything you need to navigate what comes next.',
        microAction: 'Write down one fear and tear the paper into tiny pieces',
        color: '#C41E3A',
        element: 'Earth',
        intention: 'Release'
    },
    {
        id: 4,
        chakra: 'Root',
        mantra: 'I belong here on this earth',
        message: 'You are not an accident. Your presence matters. The world is richer because you are in it. Today, claim your space unapologetically.',
        microAction: 'Say out loud: "I belong here" three times',
        color: '#C41E3A',
        element: 'Earth',
        intention: 'Empower'
    },
    {
        id: 5,
        chakra: 'Root',
        mantra: 'Stability flows through me naturally',
        message: 'Even in chaos, there is a center of calm within you. Like a tree in a storm, your roots go deep. Bend, but do not break. You are more resilient than you know.',
        microAction: 'Stand in tree pose for 10 seconds on each leg',
        color: '#C41E3A',
        element: 'Earth',
        intention: 'Calm'
    },
    {
        id: 6,
        chakra: 'Root',
        mantra: 'I am supported by the universe',
        message: 'You do not have to carry everything alone. Support surrounds you—in people, in nature, in the unseen forces that hold you. Allow yourself to receive.',
        microAction: 'Sit in a chair and feel it fully supporting your weight',
        color: '#C41E3A',
        element: 'Earth',
        intention: 'Calm'
    },
    {
        id: 7,
        chakra: 'Root',
        mantra: 'My foundation is unshakeable',
        message: 'What you have built within yourself cannot be taken away. Your inner strength, your values, your truth—these are your bedrock. Stand firm in who you are.',
        microAction: 'Stomp your feet on the ground 5 times with intention',
        color: '#C41E3A',
        element: 'Earth',
        intention: 'Empower'
    },

    // SACRAL CHAKRA - Emotional Flow (Orange)
    {
        id: 8,
        chakra: 'Sacral',
        mantra: 'I flow with life\'s natural rhythm',
        message: 'Resistance creates suffering. Today, practice allowing. Let your emotions move through you like water—fluid, cleansing, ever-changing. You do not have to hold on so tightly.',
        microAction: 'Sway your hips gently side to side for 15 seconds',
        color: '#FF6F00',
        element: 'Water',
        intention: 'Release'
    },
    {
        id: 9,
        chakra: 'Sacral',
        mantra: 'My emotions are valid and welcome',
        message: 'There are no "bad" feelings. Each emotion carries wisdom. Today, honor what you feel without judgment. Your sensitivity is a strength, not a weakness.',
        microAction: 'Name one emotion you feel right now out loud',
        color: '#FF6F00',
        element: 'Water',
        intention: 'Align'
    },
    {
        id: 10,
        chakra: 'Sacral',
        mantra: 'I create joy in my life',
        message: 'Pleasure is not frivolous—it is essential. What brings you delight? What makes you smile? Today, choose one small thing that sparks joy and give yourself permission to enjoy it fully.',
        microAction: 'Think of something that makes you smile and hold that thought for 10 seconds',
        color: '#FF6F00',
        element: 'Water',
        intention: 'Create'
    },
    {
        id: 11,
        chakra: 'Sacral',
        mantra: 'I honor my creative spirit',
        message: 'Creativity is not just art—it is how you solve problems, express yourself, and bring new ideas to life. Your unique perspective is needed. Trust your creative impulses.',
        microAction: 'Doodle or sketch something for 30 seconds',
        color: '#FF6F00',
        element: 'Water',
        intention: 'Create'
    },
    {
        id: 12,
        chakra: 'Sacral',
        mantra: 'I embrace change with grace',
        message: 'Change is the only constant. Fighting it exhausts you. Today, practice flexibility. Like water, adapt to the shape of your circumstances while maintaining your essence.',
        microAction: 'Drink a full glass of water mindfully',
        color: '#FF6F00',
        element: 'Water',
        intention: 'Align'
    },
    {
        id: 13,
        chakra: 'Sacral',
        mantra: 'My sensuality is sacred',
        message: 'You are a sensory being. The way you experience the world through touch, taste, sound, sight, and smell is a gift. Today, savor something—truly feel it.',
        microAction: 'Touch something soft and focus on the texture for 10 seconds',
        color: '#FF6F00',
        element: 'Water',
        intention: 'Calm'
    },
    {
        id: 14,
        chakra: 'Sacral',
        mantra: 'I release what no longer serves me',
        message: 'Holding on to the past keeps you from the present. Today, identify one thing—a belief, a habit, a relationship—that you are ready to release. Let it go with love.',
        microAction: 'Visualize releasing something and blow it away with one breath',
        color: '#FF6F00',
        element: 'Water',
        intention: 'Release'
    },

    // SOLAR PLEXUS - Confidence/Power (Yellow)
    {
        id: 15,
        chakra: 'Solar Plexus',
        mantra: 'I am confident in my abilities',
        message: 'You have overcome so much already. Every challenge you have faced has made you stronger. Today, remember your power. You are capable of more than you think.',
        microAction: 'Stand tall, shoulders back, and take 3 powerful breaths',
        color: '#FFD700',
        element: 'Fire',
        intention: 'Empower'
    },
    {
        id: 16,
        chakra: 'Solar Plexus',
        mantra: 'I trust my inner wisdom',
        message: 'Your intuition is always speaking. Today, listen to that quiet voice within. It knows the way forward, even when your mind is uncertain. Trust yourself.',
        microAction: 'Close your eyes and ask yourself one question, then listen',
        color: '#FFD700',
        element: 'Fire',
        intention: 'Align'
    },
    {
        id: 17,
        chakra: 'Solar Plexus',
        mantra: 'I set healthy boundaries with love',
        message: 'Saying no is an act of self-respect. Your energy is precious. Today, protect it. You can be kind and still have limits. Your boundaries honor both you and others.',
        microAction: 'Practice saying "No, thank you" out loud three times',
        color: '#FFD700',
        element: 'Fire',
        intention: 'Empower'
    },
    {
        id: 18,
        chakra: 'Solar Plexus',
        mantra: 'I am worthy of success',
        message: 'You do not have to earn your worthiness—you were born with it. Success is not about being perfect; it is about showing up. Today, celebrate one small win.',
        microAction: 'Write down one thing you accomplished today, no matter how small',
        color: '#FFD700',
        element: 'Fire',
        intention: 'Empower'
    },
    {
        id: 19,
        chakra: 'Solar Plexus',
        mantra: 'I take action with courage',
        message: 'Courage is not the absence of fear—it is moving forward despite it. Today, take one brave step toward something you want. You do not need to have it all figured out.',
        microAction: 'Do one thing that scares you slightly today',
        color: '#FFD700',
        element: 'Fire',
        intention: 'Empower'
    },
    {
        id: 20,
        chakra: 'Solar Plexus',
        mantra: 'My willpower is strong',
        message: 'Discipline is a form of self-love. When you commit to yourself, you build trust within. Today, honor one commitment you have made to yourself, no matter how small.',
        microAction: 'Complete one task you have been putting off',
        color: '#FFD700',
        element: 'Fire',
        intention: 'Empower'
    },
    {
        id: 21,
        chakra: 'Solar Plexus',
        mantra: 'I shine my light brightly',
        message: 'Dimming yourself does not serve anyone. The world needs your unique gifts. Today, let yourself be seen. Your light inspires others to shine too.',
        microAction: 'Share something you are proud of with someone',
        color: '#FFD700',
        element: 'Fire',
        intention: 'Create'
    },

    // HEART CHAKRA - Love/Compassion (Green)
    {
        id: 22,
        chakra: 'Heart',
        mantra: 'I give and receive love freely',
        message: 'Love is infinite. The more you give, the more you have. Today, open your heart. Let love flow in and out without conditions or expectations.',
        microAction: 'Place your hand on your heart and say "I love you"',
        color: '#00A86B',
        element: 'Air',
        intention: 'Love'
    },
    {
        id: 23,
        chakra: 'Heart',
        mantra: 'I forgive myself and others',
        message: 'Holding grudges is like drinking poison and expecting the other person to suffer. Today, choose forgiveness—not for them, but for you. Set yourself free.',
        microAction: 'Think of someone you need to forgive and send them mental peace',
        color: '#00A86B',
        element: 'Air',
        intention: 'Release'
    },
    {
        id: 24,
        chakra: 'Heart',
        mantra: 'Compassion flows through me',
        message: 'Everyone is fighting a battle you know nothing about. Today, lead with kindness. Offer compassion to others, and most importantly, to yourself.',
        microAction: 'Do one small act of kindness for yourself or someone else',
        color: '#00A86B',
        element: 'Air',
        intention: 'Love'
    },
    {
        id: 25,
        chakra: 'Heart',
        mantra: 'I am worthy of deep love',
        message: 'You do not have to be perfect to be loved. You are enough, exactly as you are. Today, receive love—from others, from the universe, from yourself.',
        microAction: 'Look in the mirror and say "I am worthy of love"',
        color: '#00A86B',
        element: 'Air',
        intention: 'Love'
    },
    {
        id: 26,
        chakra: 'Heart',
        mantra: 'My heart is open and healed',
        message: 'Past hurts do not define you. Your heart has an incredible capacity to heal and love again. Today, trust that you are safe to open up, even if just a little.',
        microAction: 'Take 3 deep breaths into your chest area',
        color: '#00A86B',
        element: 'Air',
        intention: 'Align'
    },
    {
        id: 27,
        chakra: 'Heart',
        mantra: 'I attract loving relationships',
        message: 'The love you give yourself sets the standard for how others treat you. Today, notice how you speak to yourself. Would you talk to a friend that way? Be gentle.',
        microAction: 'Compliment yourself genuinely for something',
        color: '#00A86B',
        element: 'Air',
        intention: 'Love'
    },
    {
        id: 28,
        chakra: 'Heart',
        mantra: 'Gratitude fills my heart',
        message: 'Gratitude shifts everything. Even in difficult times, there are small blessings. Today, find three things to be grateful for. Let appreciation open your heart.',
        microAction: 'List three things you are grateful for right now',
        color: '#00A86B',
        element: 'Air',
        intention: 'Calm'
    },

    // THROAT CHAKRA - Communication/Expression (Blue)
    {
        id: 29,
        chakra: 'Throat',
        mantra: 'I speak my truth with clarity',
        message: 'Your voice matters. What you have to say is important. Today, practice speaking honestly and kindly. Your truth does not need to be loud to be powerful.',
        microAction: 'Say one true thing about how you feel right now',
        color: '#4169E1',
        element: 'Air',
        intention: 'Empower'
    },
    {
        id: 30,
        chakra: 'Throat',
        mantra: 'I listen with an open heart',
        message: 'Communication is not just about speaking—it is about truly hearing. Today, practice deep listening. Give someone your full attention without planning your response.',
        microAction: 'Listen to someone without interrupting for 1 minute',
        color: '#4169E1',
        element: 'Air',
        intention: 'Align'
    },
    {
        id: 31,
        chakra: 'Throat',
        mantra: 'My words create my reality',
        message: 'The language you use shapes your experience. Today, notice your self-talk. Are you speaking life or limitation? Choose words that uplift and empower.',
        microAction: 'Replace one negative thought with a positive affirmation',
        color: '#4169E1',
        element: 'Air',
        intention: 'Create'
    },
    {
        id: 32,
        chakra: 'Throat',
        mantra: 'I express myself authentically',
        message: 'Pretending to be someone you are not is exhausting. Today, let your true self show. The right people will love you for who you really are.',
        microAction: 'Share one authentic thought or feeling with someone',
        color: '#4169E1',
        element: 'Air',
        intention: 'Empower'
    },
    {
        id: 33,
        chakra: 'Throat',
        mantra: 'I release the need to please everyone',
        message: 'You cannot control how others receive your words. Speak your truth with kindness, then release attachment to the outcome. Not everyone will understand, and that is okay.',
        microAction: 'Say something you have been holding back (to yourself or someone)',
        color: '#4169E1',
        element: 'Air',
        intention: 'Release'
    },
    {
        id: 34,
        chakra: 'Throat',
        mantra: 'Creativity flows through my voice',
        message: 'Your unique expression is a gift to the world. Whether through words, art, music, or presence—share it. The world needs what only you can offer.',
        microAction: 'Hum or sing for 15 seconds',
        color: '#4169E1',
        element: 'Air',
        intention: 'Create'
    },
    {
        id: 35,
        chakra: 'Throat',
        mantra: 'I communicate with confidence',
        message: 'You do not need permission to speak. Your thoughts and ideas have value. Today, share something you have been keeping to yourself. Trust that you will be heard.',
        microAction: 'Speak one idea or opinion you have been hesitant to share',
        color: '#4169E1',
        element: 'Air',
        intention: 'Empower'
    },

    // THIRD EYE - Intuition/Insight (Indigo)
    {
        id: 36,
        chakra: 'Third Eye',
        mantra: 'I trust my intuition completely',
        message: 'Your inner knowing is never wrong. Today, tune in to that quiet voice within. It speaks in whispers, feelings, and subtle nudges. Listen closely.',
        microAction: 'Close your eyes and ask "What do I need to know right now?"',
        color: '#4B0082',
        element: 'Spirit',
        intention: 'Align'
    },
    {
        id: 37,
        chakra: 'Third Eye',
        mantra: 'I see clearly beyond illusion',
        message: 'Not everything is as it seems. Today, look beyond surface appearances. Trust your ability to perceive the deeper truth in situations and people.',
        microAction: 'Sit quietly and observe your thoughts for 1 minute without judgment',
        color: '#4B0082',
        element: 'Spirit',
        intention: 'Align'
    },
    {
        id: 38,
        chakra: 'Third Eye',
        mantra: 'My imagination is powerful',
        message: 'What you can envision, you can create. Today, dream boldly. Your imagination is not frivolous—it is the blueprint for your future. See it first in your mind.',
        microAction: 'Visualize your ideal day for 30 seconds',
        color: '#4B0082',
        element: 'Spirit',
        intention: 'Create'
    },
    {
        id: 39,
        chakra: 'Third Eye',
        mantra: 'I am open to divine guidance',
        message: 'You are never alone. The universe is constantly sending you signs, synchronicities, and guidance. Today, pay attention. The answers you seek are already on their way.',
        microAction: 'Notice one synchronicity or sign today',
        color: '#4B0082',
        element: 'Spirit',
        intention: 'Align'
    },
    {
        id: 40,
        chakra: 'Third Eye',
        mantra: 'Clarity comes to me easily',
        message: 'Confusion is temporary. When you quiet your mind, clarity emerges naturally. Today, create space for stillness. The answers will come when you stop searching so hard.',
        microAction: 'Stare at one point for 20 seconds without thinking',
        color: '#4B0082',
        element: 'Spirit',
        intention: 'Calm'
    },
    {
        id: 41,
        chakra: 'Third Eye',
        mantra: 'I trust the timing of my life',
        message: 'Everything is unfolding exactly as it should. Today, release the need to force outcomes. Trust that what is meant for you will not pass you by.',
        microAction: 'Take a deep breath and say "I trust the process"',
        color: '#4B0082',
        element: 'Spirit',
        intention: 'Calm'
    },
    {
        id: 42,
        chakra: 'Third Eye',
        mantra: 'My dreams hold wisdom',
        message: 'Your subconscious speaks to you while you sleep. Today, pay attention to your dreams. They carry messages, insights, and healing. Keep a journal nearby.',
        microAction: 'Write down one dream or thought from last night',
        color: '#4B0082',
        element: 'Spirit',
        intention: 'Align'
    },

    // CROWN CHAKRA - Higher Self/Alignment (Violet)
    {
        id: 43,
        chakra: 'Crown',
        mantra: 'I am connected to all that is',
        message: 'You are not separate from the universe—you are a part of it. Today, feel the invisible threads that connect you to everything and everyone. You are never truly alone.',
        microAction: 'Look at the sky and feel your connection to something greater',
        color: '#8B00FF',
        element: 'Spirit',
        intention: 'Align'
    },
    {
        id: 44,
        chakra: 'Crown',
        mantra: 'I am divinely guided and protected',
        message: 'There is a higher intelligence at work in your life. Today, surrender control. Trust that you are being guided toward your highest good, even when the path is unclear.',
        microAction: 'Say a prayer or set an intention for guidance',
        color: '#8B00FF',
        element: 'Spirit',
        intention: 'Calm'
    },
    {
        id: 45,
        chakra: 'Crown',
        mantra: 'I am one with the universe',
        message: 'Separation is an illusion. Today, recognize the divine in yourself and others. We are all made of the same stardust, connected by the same source.',
        microAction: 'Sit in silence for 1 minute and feel your oneness with all',
        color: '#8B00FF',
        element: 'Spirit',
        intention: 'Align'
    },
    {
        id: 46,
        chakra: 'Crown',
        mantra: 'My purpose unfolds naturally',
        message: 'You do not have to force your purpose—it will reveal itself when you are ready. Today, trust that you are exactly where you need to be. Every experience is preparing you.',
        microAction: 'Ask yourself: "What brings me joy?" and listen',
        color: '#8B00FF',
        element: 'Spirit',
        intention: 'Align'
    },
    {
        id: 47,
        chakra: 'Crown',
        mantra: 'I surrender to the flow of life',
        message: 'Control is an illusion. The more you try to grip life tightly, the more it slips away. Today, practice letting go. Trust the current to carry you where you need to go.',
        microAction: 'Release your shoulders and take 3 surrendering breaths',
        color: '#8B00FF',
        element: 'Spirit',
        intention: 'Release'
    },
    {
        id: 48,
        chakra: 'Crown',
        mantra: 'I am infinite consciousness',
        message: 'You are not just your body or your thoughts. You are awareness itself—vast, limitless, eternal. Today, remember your true nature. You are so much more than you think.',
        microAction: 'Close your eyes and repeat "I am" 5 times',
        color: '#8B00FF',
        element: 'Spirit',
        intention: 'Align'
    },
    {
        id: 49,
        chakra: 'Crown',
        mantra: 'Peace is my natural state',
        message: 'Beneath all the noise, there is stillness. Beneath all the chaos, there is peace. Today, return to your center. That quiet place within you is always accessible.',
        microAction: 'Find a quiet spot and breathe deeply for 30 seconds',
        color: '#8B00FF',
        element: 'Spirit',
        intention: 'Calm'
    }
]

export const getRandomCard = (): EnergyCard => {
    const randomIndex = Math.floor(Math.random() * energyCards.length)
    return energyCards[randomIndex]
}

export const getCardById = (id: number): EnergyCard | undefined => {
    return energyCards.find(card => card.id === id)
}

export const getCardsByChakra = (chakra: ChakraType): EnergyCard[] => {
    return energyCards.filter(card => card.chakra === chakra)
}
