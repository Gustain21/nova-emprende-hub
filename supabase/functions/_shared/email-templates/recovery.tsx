/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Text } from 'npm:@react-email/components@0.0.22'
import { CtaButton, EmailLayout, muted, text } from './layout.tsx'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <EmailLayout preview={`Restablece tu contraseña de ${siteName}`} title="Restablece tu contraseña">
    <Text style={text}>
      Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en {siteName}.
      Pulsa el botón para elegir una nueva:
    </Text>
    <CtaButton href={confirmationUrl} label="Elegir nueva contraseña" />
    <Text style={muted}>
      Si no lo has solicitado, ignora este mensaje: tu contraseña actual no cambiará.
    </Text>
  </EmailLayout>
)

export default RecoveryEmail
