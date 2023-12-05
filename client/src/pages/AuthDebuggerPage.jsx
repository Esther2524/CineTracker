import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthDebuggerPage = () => {
    const [token, setToken] = useState('');
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const getToken = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                setToken(accessToken);
            } catch (e) {
                console.error('Error getting token', e);
            }
        };

        if (isAuthenticated) {
            getToken();
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    if (!isAuthenticated) {
        return <div>Please login to view your authentication token.</div>;
    }

    return (
        <div>
            <h2 className="center-title">Auth Token Debugger Page🙈</h2>
            <div className='debugger-page'>
                <h3>This page displays your current authentication token</h3>
                {token ? (
                    <textarea readOnly value={token} style={{ width: '100%', height: '300px' }} />
                ) : (
                    <p>Loading token...</p>
                )}
            </div>

        </div>

    );
};

export default AuthDebuggerPage;
