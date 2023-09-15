import './globals.css'
import "@fontsource/noto-sans-kr"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '알고모여',
  description: '원스톱 알고리즘 스터디 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
