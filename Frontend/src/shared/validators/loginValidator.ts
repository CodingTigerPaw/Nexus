import { z } from "zod";

// Reusable low-level predicates used by zod refinements.
export const LoginRules = {
  hasMinLength: (val: string, min: number) => val.length >= min,
  hasBigLetter: (val: string) => /[A-Z]/.test(val),
  hasNumber: (val: string) => /[0-9]/.test(val),
  hasSpecialChar: (val: string) => /[!@#$%^&*]/.test(val),
};

// Base schema reused to build composable password checks.
const basePassword = z.string();

// Validation "layers" can be mixed on a field in any order.
export const minLengthValidator = (min: number) =>
  basePassword.refine((val) => LoginRules.hasMinLength(val, min), {
    message: `Hasło musi mieć minimum ${min} znaków`,
  });

export const bigLetterValidator = basePassword.refine(LoginRules.hasBigLetter, {
  message: "Wymagana wielka litera",
});

export const numberValidator = basePassword.refine(LoginRules.hasNumber, {
  message: "Wymagana cyfra",
});
