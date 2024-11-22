import React, { FormEvent } from 'react';
import { useFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

interface FormProps<T> {
  initialValues: T;
  validationSchema?: Yup.Schema<T>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
  children: (props: FormikProps<T>) => React.ReactNode;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touched?: boolean;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  touched?: boolean;
}

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export function Form<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  validate,
}: FormProps<T>) {
  const formik = useFormik<T>({
    initialValues,
    validationSchema,
    validate,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSubmit(values);
        resetForm();
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      {children(formik)}
    </form>
  );
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  touched,
  className = '',
  ...props
}) => {
  const showError = error && touched;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          showError
            ? 'border-red-300 text-red-900 placeholder-red-300'
            : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {showError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  touched,
  className = '',
  ...props
}) => {
  const showError = error && touched;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          showError
            ? 'border-red-300 text-red-900 placeholder-red-300'
            : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {showError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  children,
  className = '',
  disabled,
  ...props
}) => (
  <button
    type="submit"
    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
      loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`}
    disabled={loading || disabled}
    {...props}
  >
    {loading ? (
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    ) : null}
    {children}
  </button>
);
