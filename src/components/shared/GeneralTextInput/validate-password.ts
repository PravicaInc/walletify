import zxcvbn, { ZXCVBNResult, ZXCVBNScore } from 'zxcvbn';

const requiredStrengthScore: ZXCVBNScore = 4;

const requiredPasswordLength = 12;

export interface IValidatedPassword extends ZXCVBNResult {
  meetsLengthRequirement: boolean;
  meetsScoreRequirement: boolean;
  meetsAllStrengthRequirements: boolean;
}

export function validatePassword(input: string): IValidatedPassword {
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
