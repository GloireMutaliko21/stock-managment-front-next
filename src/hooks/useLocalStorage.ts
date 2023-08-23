/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';

type Action = 'CREATE' | 'REMOVE';

interface Props {
  action?: Action;
  value?: any;
}

const useLocalStorage = (key: string): [any, ({ action, value }: Props) => void] => {
  const [item, setItem] = useState<string | null>();
  const [action, setAction] = useState<Action>();
  const [value, setValue] = useState('');

  const handleAddItem = useCallback(
    ({ action, value }: Props) => {
      setAction(action);
      setValue(value);
    },
    [action]
  );

  useEffect(() => {
    if (action === 'CREATE') {
      localStorage.setItem(key, JSON.stringify(value));
    } else if (action === 'REMOVE') {
      localStorage.removeItem(key);
    } else {
      if (localStorage.getItem(key)) {
        setItem(JSON.parse(localStorage.getItem(key) as string));
      }
    }

    return () => {
      setItem(null);
      setAction(undefined);
      setValue('');
    };
  }, [action]);

  return [item, handleAddItem];
};

export default useLocalStorage;
