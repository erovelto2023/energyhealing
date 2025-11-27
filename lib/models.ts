import mongoose, { Schema, model, models } from 'mongoose'

// Card Pull Schema
const CardPullSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    cardId: {
        type: Number,
        required: true
    },
    pulledAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    mood: {
        type: String,
        enum: ['joyful', 'calm', 'anxious', 'sad', 'angry', 'peaceful', 'energized', 'tired'],
        required: false
    },
    notes: {
        type: String,
        maxlength: 500,
        required: false
    }
})

// Energy Log Schema (aggregated daily view)
const EnergyLogSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
        index: true
    },
    cardPullId: {
        type: Schema.Types.ObjectId,
        ref: 'CardPull',
        required: true
    },
    reflection: {
        type: String,
        maxlength: 1000,
        required: false
    }
})

// Ensure unique card pull per user per day
EnergyLogSchema.index({ userId: 1, date: 1 }, { unique: true })

// Streak Schema
const StreakSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastPullDate: {
        type: String, // Format: YYYY-MM-DD
        required: false
    },
    achievements: [{
        type: {
            type: String,
            enum: ['streak_3', 'streak_7', 'streak_14', 'streak_30', 'streak_60', 'streak_90', 'streak_365']
        },
        unlockedAt: {
            type: Date,
            default: Date.now
        }
    }]
})

// User Preferences Schema
const UserPreferencesSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    soundEnabled: {
        type: Boolean,
        default: true
    },
    notificationsEnabled: {
        type: Boolean,
        default: false
    },
    theme: {
        type: String,
        enum: ['starry', 'forest', 'waves', 'clouds'],
        default: 'starry'
    },
    favoriteCards: [{
        type: Number
    }]
})

// AI Interaction Schema
const AIInteractionSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['affirmation', 'chakra', 'journal', 'card-interpretation', 'general', 'card'],
        required: true,
        index: true
    },
    prompt: {
        type: String,
        required: true,
        maxlength: 2000
    },
    response: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    metadata: {
        type: Schema.Types.Mixed,
        required: false
    }
})

// Journal Entry Schema
const JournalEntrySchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        maxlength: 200,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        enum: ['joyful', 'calm', 'anxious', 'sad', 'angry', 'peaceful', 'energized', 'tired', 'overwhelmed', 'hopeful', 'grateful', 'uncertain'],
        required: false
    },
    emotions: [{
        type: String
    }],
    physicalFeelings: [{
        type: String
    }],
    energyLevel: {
        type: Number,
        min: 1,
        max: 10,
        required: false
    },
    chakraStatus: {
        type: Map,
        of: Number,
        required: false
    },
    tags: [{
        type: String,
        maxlength: 50
    }],
    isPrivate: {
        type: Boolean,
        default: false
    },
    aiInsights: {
        emotionalSummary: String,
        energyInterpretation: String,
        patterns: [String],
        affirmations: [String],
        recommendations: [String],
        microAction: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

// Mood Log Schema
const MoodLogSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    mood: {
        type: String,
        enum: ['joyful', 'calm', 'anxious', 'sad', 'angry', 'peaceful', 'energized', 'tired', 'overwhelmed', 'hopeful', 'grateful', 'uncertain'],
        required: true
    },
    emotions: [{
        type: String
    }],
    physicalFeelings: [{
        type: String
    }],
    energyLevel: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    chakraStatus: {
        type: Map,
        of: Number,
        required: false
    },
    notes: {
        type: String,
        maxlength: 500,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Ensure one mood log per user per day
MoodLogSchema.index({ userId: 1, date: 1 }, { unique: true })

// Journal Prompt Schema
const JournalPromptSchema = new Schema({
    category: {
        type: String,
        required: true,
        enum: ['anxiety', 'trauma', 'grief', 'self-worth', 'relationships', 'shadow-work', 'inner-child', 'purpose', 'energy', 'chakra', 'forgiveness', 'stress', 'gratitude'],
        index: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    prompt: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['quick', 'deep', 'guided'],
        required: true,
        default: 'quick'
    },
    steps: [{
        type: String
    }],
    tags: [{
        type: String
    }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

// Favorite Affirmation Schema
const FavoriteAffirmationSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    affirmation: {
        type: String,
        required: true,
        maxlength: 500
    },
    aiGenerated: {
        type: Boolean,
        default: false
    },
    source: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Export models
export const CardPull = models.CardPull || model('CardPull', CardPullSchema)
export const EnergyLog = models.EnergyLog || model('EnergyLog', EnergyLogSchema)
export const Streak = models.Streak || model('Streak', StreakSchema)
export const UserPreferences = models.UserPreferences || model('UserPreferences', UserPreferencesSchema)
export const AIInteraction = models.AIInteraction || model('AIInteraction', AIInteractionSchema)
export const JournalEntry = models.JournalEntry || model('JournalEntry', JournalEntrySchema)
export const MoodLog = models.MoodLog || model('MoodLog', MoodLogSchema)
export const JournalPrompt = models.JournalPrompt || model('JournalPrompt', JournalPromptSchema)
export const FavoriteAffirmation = models.FavoriteAffirmation || model('FavoriteAffirmation', FavoriteAffirmationSchema)
