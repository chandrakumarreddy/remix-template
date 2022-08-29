import { Button } from '@mantine/core'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'

import successIcon from '~/assets/images/icons/success.png'
import LoginBgPng from '~/assets/images/login/login-bg.png'
import LoginBgWebP from '~/assets/images/login/login-bg.webp'
import InputComponent from '~/components/input-component'
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
  const response = await fetchHandler(request, `${URLS.V1}/users/password/`, {
    method: 'put',
    body: JSON.stringify({
      email: formData.get('email'),
    }),
  })
  return json(response, {
    status: response.status_code,
  })
}

export default function SignIn() {
  return <LoginRegister leftSection={LeftSection} rightSection={RightSection} />
}

const LeftSection = () => {
  return <ResetPasswordForm />
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
  const [email, setEmail] = useState('')
  const fetcher = useFetcher()
  const isError = fetcher.data?.error?.message
  if (fetcher.data?.success) {
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
      <h3>Forgot password</h3>
      <fetcher.Form
        className="left-section__wrapper-form"
        method="post"
        action="/forgot-password/"
      >
        <InputComponent
          type="email"
          name="email"
          placeholder="Enter Email Id"
          id="email-id"
          label="Email"
          value={email}
          onChange={(value: string) => setEmail(value)}
          error={isError}
        />
        <div className="left-section__wrapper-form-footer">
          <Button
            className="create-account-btn body bold"
            // disabled={!email}
            type="submit"
          >
            Submit
          </Button>
        </div>
      </fetcher.Form>
    </>
  )
}
