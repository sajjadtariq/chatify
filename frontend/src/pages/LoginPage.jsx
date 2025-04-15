import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../components/ui/InputField';
import { useAuthStore } from '../components/store/useAuthStore';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Centralized width configuration
const FORM_CONFIG = {
  width: 'min-w-[400px]',
  inputClass: 'p-3 rounded-xl text-lg text-black border border-slate-300 outline-none',
  buttonClass: 'rounded-xl border border-slate-400 text-black px-5 py-3'
};

const LoginPage = () => {
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const logInSchema = z
    .object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters")
    })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(logInSchema),
  });

  const onSubmit = async (data) => {
    const response = await login(data);
    if (response) { return reset() }
    else { reset({ password: '' }) }
  }

  return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen">
      <div
        className="flex flex-col gap-5 items-center p-10 rounded-xl shadow-xl"
        style={{
          boxShadow: '0px 2px 10px rgba(88, 99, 255, 0.3), 0px 1px 5px rgba(88, 99, 255, 0.15)',
          border: '1px solid rgba(200, 200, 200, 0.25)',
        }}
      >
        <h2 className="text-5xl">LOG IN</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 items-center"
        >
          <div className={FORM_CONFIG.width}>
            <InputField
              label="Email"
              type="email"
              placeholder="Enter your email"
              register={register}
              errors={errors}
              name="email"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-lg">Password</label>
            <div className={`relative ${FORM_CONFIG.width}`}>
              <input
                className={`${FORM_CONFIG.width} ${FORM_CONFIG.inputClass}`}
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                {...(register ? register("password") : {})}
              />
              <button
                type="button"
                className="absolute right-5 inset-y-0 top-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500">{errors.password?.message}</p>}
          </div>

          <div className="w-full flex justify-end mt-6">
            <button
              disabled={isSubmitting}
              type="submit"
              className={`${FORM_CONFIG.width} ${FORM_CONFIG.buttonClass}`}
            >
              Log In
            </button>
          </div>
        </form>
        <h5>
          Don't have an account?
          <Link to="/signup">
            <p className="ml-2 inline-flex underline linktext"> Signup </p>
          </Link>
        </h5>
      </div>
    </div>
  )
}

export default LoginPage;