import zxcvbn, { ZXCVBNResult, ZXCVBNScore } from 'zxcvbn';

const requiredStrengthScore: ZXCVBNScore = 4;

const requiredPasswordLength = 12;

export interface ValidatedPassword extends ZXCVBNResult {
  meetsLengthRequirement: boolean;
  meetsScoreRequirement: boolean;
  meetsAllStrengthRequirements: boolean;
}

export function validatePassword(input: string): ValidatedPassword {
  const password = input.substr(0, 100);
  const result = zxcvbn(password);
  const meetsScoreRequirement = result.score >= requiredStrengthScore;
  const meetsLengthRequirement = input.length >= requiredPasswordLength;
  const meetsAllStrengthRequirements =
    meetsScoreRequirement && meetsLengthRequirement;

  return Object.freeze({
    ...result,
    meetsScoreRequirement,
    meetsLengthRequirement,
    meetsAllStrengthRequirements,
  });
}
