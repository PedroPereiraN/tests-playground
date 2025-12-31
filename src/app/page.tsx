'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type CustomEvent = {
  color: 'blue' | 'yellow' | 'red';
  description: string;
  title: string;
};

const schema = z.object({
  username: z.string().min(1, {
    message: 'Username is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }).superRefine((value, ctx) => {
    if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password needs to contain uppercase and lowercase letters, numbers and special characters (@$!%*?&#)."
      })
    }
  }),
});

export default function Auth() {
  const [events, setEvents] = React.useState<CustomEvent[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(async response => {
        const responseMessage = await response.json();
        if (!response.ok) {
          setEvents(prev => [
            {
              color: 'red',
              title: 'Error!',
              description: responseMessage.error,
            },
            ...prev,
          ]);

          return;
        }

        setEvents(prev => [
          {
            color: 'blue',
            title: 'Success!',
            description: `Token gerado com sucesso: "${responseMessage.token}"`,
          },

          ...prev,
        ]);

        reset();
      })
      .catch(error => {
        setEvents(prev => [
          {
            color: 'red',
            title: 'Error!',
            description: error.toString(),
          },
          ...prev,
        ]);
      });
  }

  const onFieldValidationError = (errors: any) => {
    const errorsWithCorrectType = errors as { password?: { message: string }; name?: { message: string } }

    for (const err in errorsWithCorrectType) {
      const errorMessage = errorsWithCorrectType[err as 'password' | 'name']?.message

      if (errorMessage) {
        setEvents(prev => [
          {
            color: 'red',
            title: 'Error!',
            description: errorMessage
          },
          ...prev,
        ]);
      }
    }
  }

  return (
    <main className="flex flex-col items-center justify-center gap-10 h-screen w-screen bg-slate-100">
      <h1 className="font-bold text-3xl">Jwt Authentication</h1>

      <form className="w-72 " onSubmit={handleSubmit(onSubmit, onFieldValidationError)}>
        <fieldset className="w-full">
          <Label htmlFor="username" className="mb-3">
            Username
          </Label>
          <input
            className="w-full border border-gray-200 rounded-lg p-2 focus:outline-2 focus:outline-black"
            id="username"
            placeholder="enter you username"
            {...register('username')}
            aria-invalid={!!errors.username}
          />
          {errors.username && (
            <span className="text-red-600 text-sm">
              {errors.username.message}
            </span>
          )}
        </fieldset>

        <fieldset className="w-full my-5">
          <Label htmlFor="password" className="mb-3">
            Password
          </Label>
          <input
            className="w-full border border-gray-200 rounded-lg p-2 focus:outline-2 focus:outline-black"
            id="password"
            placeholder="enter you password"
            type="password"
            {...register('password')}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <span className="text-red-600 text-sm">
              {errors.password.message}
            </span>
          )}
        </fieldset>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>

      <section className="w-2/5 overflow-y-scroll p-10">
        <h2 className="font-bold">Events</h2>

        <Separator className="w-full my-3" />

        <div className="flex flex-col gap-2 overflow-y-scroll min-h-[12rem]">
          {events.map((event: CustomEvent, index: number) => (
            <div
              className={cn(
                'rounded-lg',
                'p-4',
                'border',
                event.color == 'blue'
                  ? 'border-blue-600 bg-blue-600/20 text-blue-900'
                  : event.color == 'yellow'
                    ? 'border-yellow-600 bg-yellow-600/20 text-yellow-900'
                    : 'border-red-600 bg-red-600/20 text-red-900',
              )}
              key={index}
            >
              <h3 className="font-bold">{event.title}</h3>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
