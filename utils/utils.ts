export const generatePassphrase = (): string => {
    const words = ['apple', 'orange', 'banana', 'grape', 'peach', 'cherry', 'mango', 'berry', 'melon', 'kiwi'];
    return Array(4)
      .fill('')
      .map(() => words[Math.floor(Math.random() * words.length)])
      .join(' ');
  };

  type PasswordValidationResult = {
    isValid: boolean;
    message: string;
  };
  
 export const validatePassword = (password: string, confirmPassword: string): PasswordValidationResult => {
    const minLength = 8;
    const uppercasePattern = /[A-Z]/;
    const lowercasePattern = /[a-z]/;
    const digitPattern = /\d/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
  
    if (password.length < minLength) {
      return { isValid: false, message: `Password must be at least ${minLength} characters long.` };
    }
    if (!uppercasePattern.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!lowercasePattern.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!digitPattern.test(password)) {
      return { isValid: false, message: 'Password must contain at least one digit.' };
    }
    if (!specialCharPattern.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character.' };
    }
    if (password !== confirmPassword) {
      return { isValid: false, message: 'Passwords do not match.' };
    }
  
    return { isValid: true, message: 'Password is valid.' };
  };
  