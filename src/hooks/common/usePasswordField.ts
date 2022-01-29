import { useCallback, useEffect, useState } from 'react';

export const usePasswordField = (
  validation: (val: string) => Promise<any> = () => Promise.resolve(),
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
          const result = validation(input);
          if (result instanceof Promise) {
            result.catch(e => setError(e.message));
          }
        } catch (e: any) {
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
