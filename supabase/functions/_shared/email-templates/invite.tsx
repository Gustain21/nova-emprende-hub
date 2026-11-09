/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Text } from 'npm:@react-email/components@0.0.22'
import { CtaButton, EmailLayout, muted, text } from './layout.tsx'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteName, confirmationUrl }: InviteEmailProps) => (
  <EmailLayout preview={`Te han invitado a ${siteName}`} title="Te han invitado">
    <Text style={text}>
      Has recibido una invitación para crear tu cuenta en {siteName}. Pulsa el botón para
      aceptarla:
    </Text>
    <CtaButton href={confirmationUrl} label="Aceptar invitación" />
    <Text style={muted}>Si no esperabas esta invitación, puedes ignorar este mensaje.</Text>
  </EmailLayout>
)

export default InviteEmail
