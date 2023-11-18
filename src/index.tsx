import html from '@kitajs/html';
import { clsx } from 'clsx';
import { z } from 'zod';
import express from 'express';

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static('./public'));

app.get('/', (_req, res) => {
  res.send(
    <BaseHtml>
      <body>
        <div class="h-screen flex flex-col items-center justify-center">
          <h2 class="text-3xl">Awesome app!</h2>
          <div class="card card-compact w-96 bg-base-100 shadow-xl">
            <div class="card-body">
              <RegistrationForm />
            </div>
          </div>
          <div id="register-success" class="h-20">
            <div
              role="alert"
              class="alert alert-success w-auto mt-2 invisible"
            />
          </div>
        </div>
      </body>
    </BaseHtml>,
  );
});

const RegisterBodySchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password should be a minimum of 8 characters'),
});

type Errors = Record<string, { message: string }>;

app.post('/register', (req, res) => {
  const result = RegisterBodySchema.safeParse(req.body);
  if (result.success) {
    res.send(
      <div role="alert" class="alert alert-success w-auto mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Registration Successful!</span>
      </div>,
    );
  } else {
    const errors: Errors = {};
    for (let error of result.error.errors) {
      errors[error.path[0]] = { message: error.message };
    }

    res.send(
      <RegistrationForm
        email={req.body.email}
        password={req.body.password}
        errors={errors}
      />,
    );
  }
});

// components
type ResistrationFormProps = {
  email?: string;
  password?: string;
  errors?: Errors;
};

function RegistrationForm(props: ResistrationFormProps) {
  return (
    <div>
      <h2 class="card-title">Register</h2>
      <form hx-post="/register" hx-target="closest div" hx-swap="outerHTML">
        <div class="form-control w-full max-w-xs">
          <label class="label" for="email">
            <span class="label-text">What is your email?</span>
          </label>
          <input
            type="email"
            placeholder="enter your email"
            id="email"
            name="email"
            value={props.email}
            class={clsx('input input-bordered w-full max-w-xs', {
              'input-error': props.errors?.email,
            })}
            required
          />
          <p safe class="m-2 text-error h-4">
            {props.errors?.email && props.errors.email.message}
          </p>
        </div>

        <div class="form-control w-full max-w-xs">
          <label class="label" for="password">
            <span class="label-text">What is your password?</span>
          </label>
          <input
            type="password"
            placeholder="enter your password"
            id="password"
            name="password"
            value={props.password}
            class={clsx('input input-bordered w-full max-w-xs', {
              'input-error': props.errors?.password,
            })}
            required
          />
          <p safe class="m-2 text-error h-4">
            {props.errors?.password && props.errors.password.message}
          </p>
        </div>

        <div class="mt-2 flex">
          <button class="btn btn-primary" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

function BaseHtml({ children }: html.PropsWithChildren) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTMX forms</title>
    <link rel="stylesheet" href="/static/index.css" />
    <script src="/static/htmx@1.9.8.js"></script>
    <script src="/static/hyperscript@0.9.12.js"></script>
  </head>
  ${children}
  <script>
    htmx.config.globalViewTransitions = true;
    htmx.config.useTemplateFragments = true;
  </script>
  </html>
`;
}
