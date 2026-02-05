"use client";

import { FriendsView } from "@/app/components/friends-view";
import { MOCK_FRIENDS } from "@/data/mock-friends";

export default function FriendsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Mes Amis</h1>
            <FriendsView friends={MOCK_FRIENDS} />
        </div>
    );
}
