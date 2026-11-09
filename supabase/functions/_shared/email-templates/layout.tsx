/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

export const BRAND = 'Editorial Nova Emprende'

interface LayoutProps {
  preview: string
  title: string
  children: React.ReactNode
}

export const EmailLayout = ({ preview, title, children }: LayoutProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={band}>
          <Text style={brand}>{BRAND}</Text>
        </Section>
        <Section style={card}>
          <Heading style={h1}>{title}</Heading>
          {children}
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          {BRAND} · Nova Emprende. Has recibido este mensaje por una acción
          relacionada con tu cuenta.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const CtaButton = ({ href, label }: { href: string; label: string }) => (
  <Button style={button} href={href}>
    {label}
  </Button>
)

export const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif', margin: 0 }
export const container = { maxWidth: '560px', margin: '0 auto', padding: '24px 16px' }
const band = { backgroundColor: '#3e484a', borderRadius: '8px 8px 0 0', padding: '14px 24px' }
const brand = { color: '#e8b99c', fontSize: '15px', fontWeight: 'bold' as const, letterSpacing: '0.5px', margin: 0 }
const card = { border: '1px solid #e6dfda', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '24px' }
export const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#3e484a', margin: '0 0 18px', fontFamily: 'Georgia, serif' }
export const text = { fontSize: '15px', color: '#3e484a', lineHeight: '1.6', margin: '0 0 20px' }
export const muted = { fontSize: '13px', color: '#6b7375', lineHeight: '1.5', margin: '24px 0 0' }
export const link = { color: '#3e484a', textDecoration: 'underline' }
export const code = { fontFamily: 'Courier, monospace', fontSize: '26px', fontWeight: 'bold' as const, letterSpacing: '4px', color: '#3e484a', backgroundColor: '#f7ede6', borderRadius: '6px', padding: '12px 16px', textAlign: 'center' as const, margin: '0 0 20px' }
const button = { backgroundColor: '#e8b99c', color: '#3e484a', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '6px', padding: '12px 22px', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#e6dfda', margin: '24px 0 12px' }
const footer = { fontSize: '12px', color: '#8a9193', lineHeight: '1.5', margin: 0 }
