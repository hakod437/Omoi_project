import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware de protection des routes.
 * 
 * Logique :
 * - Routes publiques (/, /login, /register, /api/auth/*) : accessibles sans connexion
 * - Routes protégées (tout le reste) : redirige vers /login si non connecté
 * - Si connecté et sur /login ou /register : redirige vers /dashboard
 * 
 * Note : On vérifie la présence du cookie de session NextAuth plutôt que
 * d'appeler auth() directement, car Prisma n'est pas compatible avec le Edge Runtime.
 */

// Routes accessibles sans connexion
const publicRoutes = ['/', '/login', '/register']

// Routes qui doivent rediriger vers /dashboard si l'utilisateur est déjà connecté
const authRoutes = ['/', '/login', '/register']

function isPublicRoute(pathname: string): boolean {
    return publicRoutes.some(route => pathname === route)
}

function isAuthRoute(pathname: string): boolean {
    return authRoutes.some(route => pathname === route)
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    console.log('[🛡️ MIDDLEWARE] 📍 Requête entrante:', pathname)
    console.log('[🛡️ MIDDLEWARE] 🍪 Cookies disponibles:', request.cookies.getAll().map(c => c.name))

    // Ne jamais bloquer les endpoints API NextAuth
    if (pathname.startsWith('/api/auth')) {
        console.log('[🛡️ MIDDLEWARE] ✅ Route API Auth.js autorisée')
        return NextResponse.next()
    }

    // Vérifier la session via le cookie NextAuth
    // NextAuth v5 utilise "authjs.session-token" en dev et "__Secure-authjs.session-token" en prod
    const sessionToken =
        request.cookies.get('authjs.session-token')?.value ||
        request.cookies.get('__Secure-authjs.session-token')?.value

    const isAuthenticated = !!sessionToken
    console.log('[🛡️ MIDDLEWARE] 🔐 Session token trouvé:', !!sessionToken)
    console.log('[🛡️ MIDDLEWARE] 👤 Utilisateur authentifié:', isAuthenticated)

    // Utilisateur NON connecté sur une route protégée → redirection vers /login
    if (!isAuthenticated && !isPublicRoute(pathname)) {
        console.log('[🛡️ MIDDLEWARE] 🚫 Utilisateur non authentifié sur route protégée → redirection vers /login')
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Utilisateur connecté sur une route d'auth (login/register) → redirection vers /dashboard
    if (isAuthenticated && isAuthRoute(pathname)) {
        console.log('[🛡️ MIDDLEWARE] 🔄 Utilisateur authentifié sur route d\'auth → redirection vers /dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    console.log('[🛡️ MIDDLEWARE] ✅ Requête autorisée, continuation...')
    return NextResponse.next()
}

// Matcher : exclure les fichiers statiques, images, favicon, etc.
export const config = {
    matcher: [
        /*
         * Match toutes les routes sauf :
         * - _next/static (fichiers statiques)
         * - _next/image (optimisation d'images)
         * - favicon.ico, sitemap.xml, robots.txt
         * - Fichiers avec extensions (images, fonts, etc.)
         */
        '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)',
    ],
}
