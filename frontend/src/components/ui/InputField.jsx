import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function InputField({
  label,
  type,
  placeholder,
  register,
  errors,
  name,
  width = 'w-full'
}) {
  const [showPassword, setShowPassword] = useState(false)

  const inputType = type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type

  return (
    <div className={`flex flex-col gap-2 ${width}`}>
      {/* Label */}
      {label && <label htmlFor={name} className="text-base lg:text-lg">{label}</label>}

      <div className="relative w-full">
        <input
          id={name}
          className={`
            w-full p-3 rounded-lg text-sm lg:text-lg text-black 
            border border-slate-300 outline-none
            ${type === 'password' ? 'pr-12' : ''}
          `}
          placeholder={placeholder}
          type={inputType}
          {...(register ? register(name) : {})}
        />

        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        )}
      </div>

      {errors && errors[name] && (
        <p className="text-red-500 text-sm">{errors[name]?.message}</p>
      )}
    </div>
  )
}