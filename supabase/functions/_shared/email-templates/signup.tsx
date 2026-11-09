/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Link, Text } from 'npm:@react-email/components@0.0.22'
import { CtaButton, EmailLayout, link, muted, text } from './layout.tsx'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({ siteName, recipient, confirmationUrl }: SignupEmailProps) => (
  <EmailLayout preview={`Confirma tu correo en ${siteName}`} title="Confirma tu correo electrónico">
    <Text style={text}>Gracias por registrarte en {siteName}.</Text>
    <Text style={text}>
      Para activar tu cuenta, confirma que esta dirección (
      <Link href={`mailto:${recipient}`} style={link}>{recipient}</Link>) te pertenece:
    </Text>
    <CtaButton href={confirmationUrl} label="Confirmar correo" />
    <Text style={muted}>Si no has creado esta cuenta, puedes ignorar este mensaje.</Text>
  </EmailLayout>
)

export default SignupEmail
