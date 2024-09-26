'use client'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Debe tener al menos dos caracteres'),
    email: z.string().email('Debe ser un mail válido'),
    password: z
      .string()
      .min(8, 'Debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener al menos una mayuscula')
      .regex(/[a-z]/, 'Debe tener al menos una letra minuscula')
      .regex(/[0-9]/, 'Debe incluir un numero'),
    confirmPassword: z.string(),
    country: z.string(),
    terms: z.boolean().refine(
      (val) => {
        return val === true
      },
      { message: 'Debe aceptar la condiciones' },
    ),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword
    },
    { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] },
  )

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegistrationForm() {
  const [countries, setContries] = useState([])
  useEffect(() => {
    axios.get('/api/countries').then((res) => {
      const { data } = res
      setContries(data)
    })
  }, [])
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      terms: false,
    },
  })
  const { handleSubmit, reset } = form
  // app/api/register/route.ts
  const submit = (data: RegisterFormData) => {
    axios
      .post('/api/register', data)
      .then((res) => {
        alert(res.data.message)
        reset()
      })
      .catch((err) => {
        // test@example.com
        console.error(err.response.data.error)
        alert(err.response.data.error)
      })
  }
  return (
    <div className="registration-form">
      <Form {...form}>
        <form
          className="max-w-md mx-auto space-y-4"
          onSubmit={handleSubmit(submit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <p>Nombre: </p>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de usuario" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <p>Mail: </p>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="pepito@mail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <p>Contraseña: </p>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Introduce la contraseña"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <p>Confirme la contraseña: </p>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Repite la contraseña"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <p>Seleccione el pais: </p>
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    {' '}
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleccione su pais" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <p>Terminos y condiciones: </p>
                </FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Enviar</Button>
        </form>
      </Form>
    </div>
  )
}
