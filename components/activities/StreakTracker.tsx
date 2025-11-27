'use client'

import { motion } from 'framer-motion'

interface StreakTrackerProps {
    currentStreak: number
    longestStreak: number
    achievements?: Array<{ type: string; unlockedAt: Date }>
}

const achievementInfo: Record<string, { icon: string; title: string; description: string }> = {
    streak_3: { icon: '🌱', title: 'Seedling', description: '3-day streak' },
    streak_7: { icon: '🌿', title: 'Growing', description: '7-day streak' },
    streak_14: { icon: '🌳', title: 'Rooted', description: '14-day streak' },
    streak_30: { icon: '🌟', title: 'Shining', description: '30-day streak' },
    streak_60: { icon: '✨', title: 'Radiant', description: '60-day streak' },
    streak_90: { icon: '🔮', title: 'Mystic', description: '90-day streak' },
    streak_365: { icon: '👑', title: 'Enlightened', description: '365-day streak' }
}

export default function StreakTracker({ currentStreak, longestStreak, achievements = [] }: StreakTrackerProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Current Streak */}
                <div className="text-center mb-6">
                    <motion.div
                        className="text-6xl font-bold mb-2"
                        style={{ color: 'var(--primary-purple-light)' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    >
                        {currentStreak}
                    </motion.div>
                    <div className="text-lg text-secondary">Day Streak 🔥</div>
                </div>

                {/* Longest Streak */}
                <div className="text-center mb-6 pb-6 border-b border-gray-700">
                    <div className="text-sm text-muted">Personal Best</div>
                    <div className="text-2xl font-semibold" style={{ color: 'var(--secondary-teal)' }}>
                        {longestStreak} days
                    </div>
                </div>

                {/* Achievements */}
                {achievements && achievements.length > 0 && (
                    <div>
                        <h4 className="text-sm uppercase tracking-wide mb-4 opacity-70">Achievements</h4>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(achievementInfo).map(([key, info]) => {
                                const unlocked = achievements.some(a => a.type === key)
                                return (
                                    <motion.div
                                        key={key}
                                        className="text-center p-3 rounded-lg transition-all duration-300"
                                        style={{
                                            background: unlocked ? 'hsla(270, 60%, 65%, 0.2)' : 'hsla(0, 0%, 50%, 0.1)',
                                            opacity: unlocked ? 1 : 0.4,
                                        }}
                                        whileHover={{ scale: unlocked ? 1.05 : 1 }}
                                        title={info.description}
                                    >
                                        <div className="text-3xl mb-1">{info.icon}</div>
                                        <div className="text-xs font-medium">{info.title}</div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Motivational message */}
                <motion.div
                    className="mt-6 text-center text-sm text-muted italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {currentStreak === 0 && "Start your journey today! 🌟"}
                    {currentStreak === 1 && "Great start! Keep going! 💫"}
                    {currentStreak >= 2 && currentStreak < 7 && "You're building momentum! ✨"}
                    {currentStreak >= 7 && currentStreak < 30 && "Amazing dedication! 🌈"}
                    {currentStreak >= 30 && "You're a true energy warrior! 🔥"}
                </motion.div>
            </motion.div>
        </div>
    )
}
