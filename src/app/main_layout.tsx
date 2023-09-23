import './globals.css'
import "@fontsource/noto-sans-kr"
import type { Metadata } from 'next'
import styles from './main_layout.module.scss'
import classNames from 'classnames'
import MainNavbar from './main_navbar/main_navbar'
import responsiveness from './responsiveness.module.scss'
import Footer from './footer/footer'

export const metadata: Metadata = {
  title: '알고모여',
  description: '원스톱 알고리즘 스터디 플랫폼',
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.root}>
        <MainNavbar></MainNavbar>
        <main className={classNames(responsiveness.container, styles.container)}>
        {children}
        </main>
        <Footer></Footer>
    </div>
  )
}
