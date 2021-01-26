# auth
3rd Party Authentication Library

## gapi.auth2

### Api

```
GapiAuth: React.Component
  props: {
    clientId: string
  }

useGapiAuthLogin(): () => void
  Hook to perform login

useGapiAuthLogout(): () => void
  Hook to perform logout

useGapiAuthUser(): () => UserProfile | null
  Logged in user profile
```


```typescript
  function App() {
    return (
      <GapiAuth clientId="">
        <UserBar />
      </GapiAuth>
    );
  }
  
  function LoginButton() {
    const login = useGapiAuthLogin();
    return <button onClick={login}>Login</button>
  }
  
  function LogoutButton() {
    const logout = useGapiAuthLogout();
    return <button onClick={logout}>Logout</button>
  }
  
  function UserBar() {
    const user = useGapiAuthUser();
    if (!user) return null;
    return user.name;
  }
```
