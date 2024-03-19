import {useContext} from 'react';
import {AuthContext} from '@/navigation/AuthProvider';

const useAuth = () => useContext(AuthContext);

export default useAuth;
