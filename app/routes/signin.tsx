import { Button } from '@mantine/core'
import { Link, useFetcher } from '@remix-run/react'
import { useState } from 'react'

import LoginBgPng from '~/assets/images/login/login-bg.png'
import LoginBgWebP from '~/assets/images/login/login-bg.webp'
import InputComponent, { PasswordComponent } from '~/components/input-component'
import URLS from '~/config/urls'
import type { ActionFunction, LinksFunction } from '~/remix.server'
import { json, redirect } from '~/remix.server'
import LoginRegister from '~/route-container/login-register/login-register'
import { commitCookieSession, getSession } from '~/session.server'
import styles from '~/styles/login-register.css'
import { isEmailValid } from '~/utils/regex'
import decodeToken from '~/utils/server/decodeToken.server'
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
  const session = await getSession(request)
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
  const errors = {} as { email?: string; password?: string }
  if (!email || !isEmailValid(email as string)) {
    errors['email'] = 'Invalid email id'
  }
  if (!password) {
    errors['password'] = 'Password cannot be Empty'
  }
  if (Object.keys(errors).length) {
    return json({ errors }, { status: 400 })
  }
  const response = await fetchHandler(request, `${URLS.V1}/token`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })
  if (response.success) {
    session.set('access_token', response.data.token)
    session.set('tenant_id', response.data.tenant_id)
    if (!response.data.onboarded) {
      session.set('onboarded', true)
    }
    const data = decodeToken(response.data.token)
    if (data?.role === 'salesperson') {
      const _url = !response.data.onboarded ? '/s/onboarding/' : '/s/news/'
      return redirect(_url, {
        headers: {
          'Set-Cookie': await commitCookieSession(session),
        },
      })
    }
    return redirect('/a/dashboard/', {
      headers: {
        'Set-Cookie': await commitCookieSession(session),
      },
    })
  }
  return json(
    { error: 'Invalid credentials' },
    { status: response.status_code }
  )
}

export default function SignIn() {
  return <LoginRegister leftSection={LeftSection} rightSection={RightSection} />
}

const LeftSection = () => {
  return (
    <>
      <h3>Log in</h3>
      <CreateAccountForm />
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

const CreateAccountForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const fetcher = useFetcher()
  return (
    <fetcher.Form
      className="left-section__wrapper-form"
      method="post"
      action="/signin/"
    >
      <InputComponent
        type="email"
        name="email"
        placeholder="Enter Email Id"
        id="email-id"
        label="Email"
        value={email}
        onChange={(value: string) => setEmail(value)}
        error={fetcher?.data?.errors?.email}
      />
      <PasswordComponent
        id="password"
        name="password"
        label="Password"
        placeholder="Enter Password"
        value={password}
        onChange={(value: string) => setPassword(value)}
        error={fetcher?.data?.errors?.password}
      />
      <div className="left-section__wrapper-form-footer">
        <Button className="create-account-btn body bold" type="submit">
          Log in
        </Button>
        <div className="left-section__wrapper-form-footer-content">
          <Link
            to="/forgot-password/"
            className="body-small forgot-password fw-600"
          >
            Forgot password
          </Link>
        </div>
      </div>
    </fetcher.Form>
  )
}
