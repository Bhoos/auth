
# Bhoos Google Authentication Library/GAPI auth2
This library provides the hook to connect and authenticate different third parties libraries such as Google, Facebook and twitter.
(3rd Party Authentication Library)

# Hooks and Components
### useGoogleAuth({clientId}) 
Google API needs validity of its clientId to return the response. 
So, This hook will validate and initialize the clientId with Google API. 
This hook should be used in the top level component before using any other available hook.

### useGoogleLogin()
This hook provides a void function which will login the users to google account.
Users are automatically signed in if the user does not logout. 
useGoogleAuth hook must be initialized before using this hook.

### useAuthLogout() 
This hook provides a void function which will sign out the users from any third party authentication.
useGoogleAuth must be initialized or is a requirement.

### useAuthProfile()
This hook will return the data or profile of user if the user is signed in. if the user is not signed in then
a null value is provided.
useGoogleAuth hook must be initialized before using this hook.


# Library Usage

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
	//Get the credential i.e. from googleAPI. https://console.developers.google.com/apis/credentials?project=esoteric-ripple-242102
  useGoogleAuth({clientId:''}) 
    return (
    <>
        <UserBar />
        <LoginButton/>
        <LogoutButton/>
    </>
    );
  }
  
  function LoginButton() {
    const login = useGoogleLogin(); //hook for login into google, provides user information as response	
    return <button onClick={login}>Login</button>
  }
  
  function LogoutButton() {
    const logout = useAuthLogout(); 	//hook for logging out from any third party authentication
    return <button onClick={logout}>Logout</button>
  }
  
  function UserBar() {
    const user = useAuthProfile(); //hook that will return either user,null or undefined value.
    if (!user) return null;
		if(user===undefined) return <Loader/>
    return user.name;
  }
```
