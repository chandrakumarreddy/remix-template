import { Button } from '@mantine/core'
import { Form, Link } from '@remix-run/react'
import { useState } from 'react'

import RegisterBgJpeg from '~/assets/images/login/register-bg.jpeg'
import RegisterBgWebP from '~/assets/images/login/register-bg.webp'
import InputComponent, { PasswordComponent } from '~/components/input-component'
import type { LinksFunction } from '~/remix.server'
import { redirect } from '~/remix.server'
import LoginRegister from '~/route-container/login-register/login-register'
import styles from '~/styles/login-register.css'
import { isEmailValid } from '~/utils/regex'

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    {
      rel: 'preload',
      href: RegisterBgWebP,
    },
  ]
}

export const action = () => {
  return redirect('/a/dashboard/')
}

export default function Register() {
  return <LoginRegister leftSection={LeftSection} rightSection={RightSection} />
}

const LeftSection = () => {
  return (
    <>
      <h3>Create your account</h3>
      <CreateAccountForm />
      <p className="body signin-link">
        Already have an account?{' '}
        <Link to="/signin" className="bold">
          Sign in
        </Link>
      </p>
    </>
  )
}

const RightSection = () => {
  return (
    <>
      <picture>
        <source srcSet={RegisterBgWebP} type="image/webp" />
        <img
          src={RegisterBgJpeg}
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
  const [resetPassword, setResetPassword] = useState('')
  const isValid = !!(
    isEmailValid(email) &&
    password &&
    resetPassword &&
    password === resetPassword
  )
  return (
    <Form
      className="left-section__wrapper-form"
      method="post"
      action="/create-account/"
    >
      <InputComponent
        type="email"
        placeholder="Enter Email Id"
        id="email-id"
        label="Email"
        value={email}
        onChange={(value: string) => setEmail(value)}
      />
      <PasswordComponent
        id="password"
        label="Create password"
        placeholder="Enter Password"
        type="password"
        value={password}
        onChange={(value: string) => setPassword(value)}
      />
      <PasswordComponent
        id="reenter-password"
        label="Enter password again"
        placeholder="Enter password again"
        type="password"
        value={resetPassword}
        onChange={(value: string) => setResetPassword(value)}
      />
      <div className="left-section__wrapper-form-footer">
        <Button
          className="create-account-btn body bold"
          disabled={!isValid}
          type="submit"
        >
          Create account
        </Button>
      </div>
      {/* <Stack>
              <Checkbox
                label="I agree to sell my privacy"
                classNames={{
                  inner: 'checkbox-inner',
                  input: 'checkbox-input',
                  label: 'checkbox-label',
                }}
              />
            </Stack> */}
    </Form>
  )
}
