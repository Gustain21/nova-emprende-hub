/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Text } from 'npm:@react-email/components@0.0.22'
import { code, EmailLayout, muted, text } from './layout.tsx'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <EmailLayout preview="Tu código de verificación" title="Confirma tu identidad">
    <Text style={text}>Introduce este código para confirmar que eres tú:</Text>
    <Text style={code}>{token}</Text>
    <Text style={muted}>
      El código caduca en poco tiempo. Si no lo has solicitado, puedes ignorar este mensaje.
    </Text>
  </EmailLayout>
)

export default ReauthenticationEmail
