import { Button } from '@mantine/core'
import { useActionData, useFetcher, useSearchParams } from '@remix-run/react'
import { useState } from 'react'

import successIcon from '~/assets/images/icons/success.png'
import LoginBgPng from '~/assets/images/login/login-bg.png'
import LoginBgWebP from '~/assets/images/login/login-bg.webp'
import { PasswordComponent } from '~/components/input-component'
import URLS from '~/config/urls'
import type { ActionFunction, LinksFunction } from '~/remix.server'
import { json } from '~/remix.server'
import LoginRegister from '~/route-container/login-register/login-register'
import styles from '~/styles/login-register.css'
import fetchHandler from '~/utils/server/fetchHandler.server'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    {
      rel: 'preload',
      href: LoginBgWebP,
    },
  ]
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const password1 = formData.get('password1')
  const password2 = formData.get('password2')
  if (password1 !== password2) {
    throw json({
      error: "passwords doesn't match",
    })
  }
  return await fetchHandler(request, `${URLS.V1}/users/password/`, {
    method: 'POST',
    body: JSON.stringify({
      token: formData.get('token'),
      password: password1,
    }),
  })
}

export default function SignIn() {
  return <LoginRegister leftSection={LeftSection} rightSection={RightSection} />
}

const LeftSection = () => {
  const actionData = useActionData()
  if (actionData?.success) {
    return (
      <section className="left-section__wrapper-reset-success">
        <div className="grid-item">
          <img src={successIcon} alt="success" width="24" height="24" />
          <h3>Reset password link sent to email</h3>
        </div>
        <p className="body sucess-description">
          Please click on the link sent to your registered email id to reset
          your password
        </p>
      </section>
    )
  }
  return (
    <>
      <h3>Reset password</h3>
      <ResetPasswordForm />
    </>
  )
}

const RightSection = () => {
  return (
    <>
      <picture>
        <source srcSet={LoginBgWebP} type="image/webp" />
        <img
          src={LoginBgPng}
          alt="Login background"
          className="right-section__bg-image"
        />
      </picture>
      <div className="right-section__content">
        <p>Identify</p>
        <p>Prioritize</p>
        <p>Connect</p>
        <p className="color-warning">Sell</p>
      </div>
    </>
  )
}

const ResetPasswordForm = () => {
  const fetcher = useFetcher()
  const [params] = useSearchParams()
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  return (
    <fetcher.Form
      className="left-section__wrapper-form"
      method="post"
      action="/reset-password/"
    >
      <input type="hidden" name="token" value={params.get('token') || ''} />
      <PasswordComponent
        id="password1"
        name="password1"
        label="Enter new password"
        placeholder="Enter new password"
        value={password1}
        onChange={(value: string) => setPassword1(value)}
      />
      <PasswordComponent
        id="password2"
        name="password2"
        label="Confirm password"
        placeholder="Confirm password"
        value={password2}
        onChange={(value: string) => setPassword2(value)}
      />
      <div className="left-section__wrapper-form-footer">
        <Button
          className="create-account-btn body bold"
          type="submit"
          disabled={!params.get('token')}
        >
          Reset password
        </Button>
      </div>
    </fetcher.Form>
  )
}
