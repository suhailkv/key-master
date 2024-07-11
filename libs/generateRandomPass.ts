import * as Crypto from 'expo-crypto';

async function generateStrongPassword(length: number = 16): Promise<string> {
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?~';
    const allCharacters = upperCaseLetters + lowerCaseLetters + numbers + specialCharacters;

    const getRandomChar = (charset: string, randomByte: number) => charset[randomByte % charset.length];

    if (length < 16) {
        throw new Error("Password length should be at least 16 characters.");
    }

    let password = '';

    // Ensure the password has at least one of each required character type
    let randomBytes = await Crypto.getRandomBytesAsync(4);
    password += getRandomChar(upperCaseLetters, randomBytes[0]);
    password += getRandomChar(lowerCaseLetters, randomBytes[1]);
    password += getRandomChar(numbers, randomBytes[2]);
    password += getRandomChar(specialCharacters, randomBytes[3]);

    // Fill the rest of the password length with random characters
    randomBytes = await Crypto.getRandomBytesAsync(length - 4);
    for (let i = 0; i < randomBytes.length; i++) {
        password += getRandomChar(allCharacters, randomBytes[i]);
    }

    // Shuffle the password to avoid predictable patterns
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    // Ensure no two consecutive characters are the same
    while (/([A-Za-z0-9!@#$%^&*()_+[\]{}|;:,.<>?~])\1/.test(password)) {
        password = password.split('').sort(() => 0.5 - Math.random()).join('');
    }

    return password;
}
export {generateStrongPassword}
