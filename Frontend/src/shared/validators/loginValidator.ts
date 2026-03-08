import { z } from "zod";

export const LoginRules = {
  hasMinLength: (val: string, min: number) => val.length >= min,
  hasBigLetter: (val: string) => /[A-Z]/.test(val),
  hasNumber: (val: string) => /[0-9]/.test(val),
  hasSpecialChar: (val: string) => /[!@#$%^&*]/.test(val),
};

// Tworzysz bazowy walidator
const basePassword = z.string();

// Tworzysz konkretne "warstwy" walidacji
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
