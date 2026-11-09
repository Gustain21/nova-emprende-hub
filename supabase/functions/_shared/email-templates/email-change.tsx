/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Link, Text } from 'npm:@react-email/components@0.0.22'
import { CtaButton, EmailLayout, link, muted, text } from './layout.tsx'

interface EmailChangeEmailProps {
  siteName: string
  // oldEmail is the user's current address (HookData.OldEmail). For the
  // NEW-recipient half of a secure email_change fanout, `email` equals the
  // recipient (NEW), so the "from" line must render oldEmail to read
  // "from OLD to NEW" instead of "from NEW to NEW".
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({ siteName, oldEmail, email, newEmail, confirmationUrl }: EmailChangeEmailProps) => {
  const from = oldEmail || email
  return (
    <EmailLayout preview={`Confirma el cambio de correo en ${siteName}`} title="Confirma tu nuevo correo">
      <Text style={text}>
        Has solicitado cambiar el correo de tu cuenta en {siteName} de{' '}
        <Link href={`mailto:${from}`} style={link}>{from}</Link> a{' '}
        <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
      </Text>
      <CtaButton href={confirmationUrl} label="Confirmar cambio" />
      <Text style={muted}>
        Si no has solicitado este cambio, no pulses el botón y protege tu cuenta cuanto antes.
      </Text>
    </EmailLayout>
  )
}

export default EmailChangeEmail
