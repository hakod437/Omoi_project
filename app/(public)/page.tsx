import React from 'react'
import { HomeTemplate } from '@/components/templates/HomeTemplate'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await auth()

  if (session?.user) {
    redirect('/dashboard')
  }

  return <HomeTemplate user={session?.user} />
}
