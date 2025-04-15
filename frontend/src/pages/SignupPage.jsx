import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../components/ui/InputField';
import { useAuthStore } from '../components/store/useAuthStore';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const { signup } = useAuthStore()

  const FORM_CONFIG = {
    width: 'w-[80vw] md:w-[400px] lg:w-[500px] xl:w-[600px]',
    inputClass: 'p-3 rounded-xl text-lg text-black border border-slate-300 outline-none',
    buttonClass: 'rounded-xl border border-slate-400 text-black px-5 py-3'
  };

  const signUpSchema = z
    .object({
      fullname: z.string().min(1, "Full name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmpassword: z.string(),
    })
    .refine((data) => data.password === data.confirmpassword, {
      message: "Passwords must match",
      path: ["confirmpassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    const { confirmpassword, ...signupData } = data;
    const res = await signup(signupData)

    if (!res) return
    reset()
  };

  return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen">
      <div
        className="flex flex-col gap-10 items-center p-4 lg:p-10 rounded-xl shadow-xl"
        style={{
          boxShadow: '0px 2px 10px rgba(88, 99, 255, 0.3), 0px 1px 5px rgba(88, 99, 255, 0.15)',
          border: '1px solid rgba(200, 200, 200, 0.25)',
        }}
      >
        <h2 className="text-3xl lg:text-5xl">SIGN UP</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 items-center"
        >
          <InputField
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            register={register}
            errors={errors}
            name="fullname"
            width={FORM_CONFIG.width}
          />

          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            register={register}
            errors={errors}
            name="email"
            width={FORM_CONFIG.width}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            register={register}
            errors={errors}
            name="password"
            width={FORM_CONFIG.width}
          />

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            register={register}
            errors={errors}
            name="confirmpassword"
            width={FORM_CONFIG.width}
          />

          <button
            disabled={isSubmitting}
            type="submit"
            className={`${FORM_CONFIG.width} ${FORM_CONFIG.buttonClass} text-sm lg:text-lg`}
          >
            Sign Up
          </button>

          <h5>
            Already have an account?
            <Link to="/login">
              <span className="ml-2 inline-flex underline  linktext"> Login </span>
            </Link>
          </h5>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;