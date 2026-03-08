'use client'

import React, { useEffect, useState } from 'react'
import { getActivityFeedAction } from '@/actions/social.actions'
import { Clock, MessageSquare, Star, PlusCircle, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns' // I might need to check if this is installed

export const ActivityFeed = ({ title = "Live Activities" }: { title?: string }) => {
    const [activities, setActivities] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchActivities = async () => {
            const result = await getActivityFeedAction(10)
            if (result.success) {
                setActivities(result.data || [])
            }
            setIsLoading(false)
        }
        fetchActivities()
    }, [])

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted/50 rounded-2xl" />
                ))}
            </div>
        )
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card/30">
                <UserIcon className="mx-auto size-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-ui">No recent activity. Start by adding an anime!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h3 className="font-kawaii text-2xl text-[var(--foreground)] mb-6 flex items-center gap-2">
                <Clock className="size-6 text-primary" />
                {title}
            </h3>

            <div className="grid gap-4">
                {activities.map((activity, index) => (
                    <div
                        key={activity.id}
                        className={`group relative flex gap-4 p-4 rounded-2xl border border-border bg-card/50 backdrop-blur-md transition-all hover:scale-[1.01] hover:shadow-xl hover:bg-card/80 animate-slide-up stagger-${(index % 5) + 1}`}
                    >
                        {/* User Avatar */}
                        <div className="relative size-12 shrink-0 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20">
                            {activity.user.avatar ? (
                                <Image
                                    src={activity.user.avatar}
                                    alt={activity.user.username}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="size-full flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white font-bold">
                                    {activity.user.username[0].toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer">
                                    @{activity.user.username}
                                </span>
                                <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">
                                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                </span>
                            </div>

                            <p className="text-sm text-foreground/80 leading-snug">
                                <ActivityIcon type={activity.type} />
                                <span className="ml-2">{activity.content}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const ActivityIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'LIST_UPDATE':
            return <PlusCircle className="inline size-4 text-emerald-400" />
        case 'RATING_POST':
            return <Star className="inline size-4 text-amber-400 fill-amber-400" />
        case 'REVIEW_POST':
            return <MessageSquare className="inline size-4 text-sky-400" />
        default:
            return <Clock className="inline size-4 text-primary" />
    }
}
