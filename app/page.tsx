import React from 'react'
import { HomeTemplate } from '@/components/templates/HomeTemplate'
import { auth } from '@/lib/auth'

export default async function HomePage() {
  const session = await auth()

  return <HomeTemplate user={session?.user} />
}
