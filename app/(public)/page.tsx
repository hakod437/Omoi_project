import React from 'react'
import { HomeTemplate } from '@/components/templates/HomeTemplate'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  console.log('[🏠 HOME] 🚀 Début du rendu de la page home')
  
  const session = await auth()
  console.log('[🏠 HOME] 🔐 Session récupérée:', session ? '✅' : '❌')
  console.log('[🏠 HOME] 👤 Utilisateur connecté:', session?.user?.id, session?.user?.name)

  if (session?.user) {
    console.log('[🏠 HOME] 🔄 Utilisateur connecté, redirection vers /dashboard')
    redirect('/dashboard')
  }

  console.log('[🏠 HOME] 📄 Affichage du template Home pour utilisateur non connecté')
  return <HomeTemplate user={session?.user} />
}
