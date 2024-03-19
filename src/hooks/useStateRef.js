import {useState, useCallback, useRef} from 'react';

const useStateRef = defaultValue => {
  var [state, setState] = useState(defaultValue);
  var ref = useRef(state);

  var dispatch = useCallback(function (val) {
    ref.current = typeof val === 'function' ? val(ref.current) : val;
    setState(ref.current);
  }, []);

  return [state, dispatch, ref];
};

export default useStateRef;
