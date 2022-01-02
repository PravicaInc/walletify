import { useCallback, useEffect, useState } from 'react';

export const usePasswordField = (
  validation: (val: string) => void = () => null,
  extraDeps: any[] = [],
) => {
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (extraDeps.length > 0) {
      setInput('');
    }
  }, extraDeps);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (touched && validation) {
        try {
          setError(undefined);
          validation(input);
        } catch (e) {
          setError(e.message);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [input, touched, ...extraDeps]);

  const handleChangeText = useCallback(text => {
    setInput(text);
    setTouched(true);
  }, []);

  return {
    handleChangeText,
    input,
    error,
    touched,
    setError,
  };
};
