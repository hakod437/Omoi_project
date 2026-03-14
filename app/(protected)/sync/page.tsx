import React from 'react'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AlertTriangle, ShieldCheck, TimerReset, ArrowRight, Activity } from 'lucide-react'

const states = [
	{
		key: 'partial',
		title: 'Partial Data',
		description: 'Some upstream requests failed, but cached data is still shown.',
		icon: <Activity size={16} className="text-amber-300" />,
		tone: 'text-amber-200 border-amber-300/20 bg-amber-300/5',
	},
	{
		key: 'rate_limited',
		title: 'Rate Limited',
		description: 'Backoff is active. Retry is scheduled from Retry-After header.',
		icon: <TimerReset size={16} className="text-orange-300" />,
		tone: 'text-orange-200 border-orange-300/20 bg-orange-300/5',
	},
	{
		key: 'auth_required',
		title: 'Auth Required',
		description: 'Token is missing or expired. User should authenticate again.',
		icon: <ShieldCheck size={16} className="text-sky-300" />,
		tone: 'text-sky-200 border-sky-300/20 bg-sky-300/5',
	},
	{
		key: 'error',
		title: 'Unhandled Error',
		description: 'Non-recoverable failure surfaced to the user with safe messaging.',
		icon: <AlertTriangle size={16} className="text-red-300" />,
		tone: 'text-red-200 border-red-300/20 bg-red-300/5',
	},
]

export default async function SyncPage() {
	const session = await auth()

	if (!session?.user?.id) {
		redirect('/login')
	}

	return (
		<div className="mx-auto max-w-6xl space-y-8 py-10">
			<header className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
				<p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">Flow F - Error Handling</p>
				<h1 className="mt-2 text-4xl font-kawaii text-white">Sync and Recovery Center</h1>
				<p className="mt-2 max-w-2xl text-sm text-white/60">
					This page maps user-facing states to backend conditions so product and engineering can validate recovery paths.
				</p>
			</header>

			<section className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{states.map((state) => (
					<article key={state.key} className={`rounded-3xl border p-5 backdrop-blur-xl ${state.tone}`}>
						<div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider">
							{state.icon}
							{state.title}
						</div>
						<p className="text-sm leading-relaxed">{state.description}</p>
					</article>
				))}
			</section>

			<section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
				<h2 className="text-2xl font-kawaii text-white">Quick Actions</h2>
				<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
					<Link href="/explorer" className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/80 transition hover:border-[var(--primary)]/30 hover:text-[var(--primary)]">
						Retry on explorer
					</Link>
					<Link href="/me" className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/80 transition hover:border-[var(--primary)]/30 hover:text-[var(--primary)]">
						Check auth session
					</Link>
					<Link href="/me/list" className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/80 transition hover:border-[var(--primary)]/30 hover:text-[var(--primary)]">
						Verify list mutation
					</Link>
				</div>

				<Link href="/compare" className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--primary)] hover:underline">
					Open taste compare <ArrowRight size={14} />
				</Link>
			</section>
		</div>
	)
}
