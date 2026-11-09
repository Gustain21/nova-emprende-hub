/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Text } from 'npm:@react-email/components@0.0.22'
import { CtaButton, EmailLayout, muted, text } from './layout.tsx'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ siteName, confirmationUrl }: MagicLinkEmailProps) => (
  <EmailLayout preview={`Tu enlace de acceso a ${siteName}`} title="Tu enlace de acceso">
    <Text style={text}>Pulsa el botón para iniciar sesión en {siteName}. El enlace caduca en poco tiempo.</Text>
    <CtaButton href={confirmationUrl} label="Iniciar sesión" />
    <Text style={muted}>Si no has solicitado este enlace, puedes ignorar este mensaje.</Text>
  </EmailLayout>
)

export default MagicLinkEmail
